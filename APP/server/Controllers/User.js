const providerTypes = require("../Data/providerTypes");
const Permissions = require("../Models/Permissions");
const Room = require("../Models/Room");
const Tokens = require("../Models/Tokens");
const User = require("../Models/User");
const apiConnector = require("../Utilities/apiConnector");



exports.changeUserPermmissions = async(req,res) => {
    try {
        const {targetUser,isread,iswrite,isdelete,roomId} = req.body;
        const userId = req.user._id;
        
        if(!targetUser || !userId || !roomId){
            return res.status(401).json(
                {
                    success:false,
                    message:"Invalid Request",
                }
            )
        }

        const reqUser = await User.findById(userId);
        const targetUserInfo = await User.findById(targetUser);
        const room = await Room.findById(roomId);

        if(!reqUser || !targetUserInfo || !room || room.owner!==reqUser._id){
            return res.status(404).json(
                {
                    success:false,
                    message:"Invalid User",
                }
            )
        }

        // make a permission 

        //check for a previous permission
        const prev = await Permissions.findOne(
            {
                User:targetUserInfo._id,
                Room:room._id,
            }
        );
        const permission = await Permissions.findByIdAndUpdate(prev._id,
            {
                read:isread,
                delete:isdelete,
                write:iswrite,
                User:targetUserInfo._id,
                Room:room._id,
            }
        );

        return res.status(200).json(
            {
                success:true,
                message:"Permissions Chnaged",
                permission,
            }
        )

    } catch (error) {
        console.error(error);
        console.log('Some Problem Occurred in Chnaging Permissions');
        return res.status(500).json(
            {
                success:false,
                message:"Some Internal Problem Occur",
            }
        )
    }
}

exports.addUserToRoom = async(req,res) => {
    try {
        const {targetUser,roomId,token} = req.body;
        const reqUserId = req.user._id;

        if(!targetUser || !roomId || !token || !reqUserId){
            return res.status(404).json(
                {
                    success:false,
                    message:"Invalid User",
                }
            )
        }

        const reqUser = await User.findById(reqUserId);
        const room = await Room.findById(roomId);
        const targetUserDetails = await User.findById(targetUser);

        if(!reqUser || !room || !targetUserDetails || room.owner!==reqUser._id || targetUserDetails._id===reqUser._id){
            return res.status(401).json(
                {
                    success:false,
                    message:"Invalid User Request",
                }
            )
        }

        // modify the room
        const modifiedRoom = await Room.findByIdAndUpdate(room._id,
            {
                $push:{
                    permittedUsers:targetUserDetails._id,
                }
            }
        );

        // add the permissions
        await Permissions.create(
            {
                delete:false,
                read:true,
                Room:modifiedRoom._id,
                User:targetUserDetails._id,
                write:false,
            }
        );

        // permission added and user added to room
        return res.status(200).json(
            {
                success:true,
                message:"Added To Room Successfully",
            }
        );

    } catch (error) {
        console.error(error);
        console.log('SOme Internal Problem In Adding User To room');
        return res.status(500).json(
            {
                success:false,
                message:"Some Internal Problem occurred",
            }
        );
    }
}

exports.getUserPermissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const roomId = req.body.roomId;

    if(!userId || !roomId){
        return res.status(400).json({
          success: false,
          message: "Ivalid Request Made"
        });
    }

    return res.status(200).json({
      success: true,
      message: ""
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in getUserPermissions');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in users Permissions'
    });
  }
};

exports.getAllUserReposUtil = async(token) => {
    let allRepos = [];
    let page = 1;
    const perPage = 100;
    while(true){
        const url = `https://api.github.com/user/repos?per_page=${perPage}&page=${page}`;
        const response = await apiConnector('GET',url,null,{
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json"
        });

        const repos = response.data;

        allRepos.push(...repos);
        if(repos.length<perPage){
            break;
        }
        page++;
    }
    return allRepos;
}

exports.getUserRepos = async (req, res) => {
  try {
    const user = req.user;
    const reqUser = await User.findById(user._id);

    if(!user._id || !reqUser || !reqUser.accountType.includes(providerTypes.GITHUB)){
        return res.status(401).json(
            {
                success:false,
                message:"User Not Found",
            }
        )
    }

    // find the github token
    const token = await Tokens.findOne({
        user:reqUser._id,
        provider:providerTypes.GITHUB,
    });

    // if no token found return error
    if(!token){
        return res.status(404).json({
          success: false,
          message: "Token Not Found"
        });
    }

    // get all the repos of the user
    const allRepos = await this.getAllUserReposUtil(token.token);


    return res.status(200).json({
      success: true,
      message: "All Repos Fetched",
      allRepos,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in getUserRepos');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in getting User Repos'
    });
  }
};