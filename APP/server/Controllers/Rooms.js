const { monacoSuportedExtension, cloudinarySupportedExtensions, languageMapping, getMediaType, mapMediaTypeToCloudinaryResource } = require("../Data/extensionsData");
const providerTypes = require("../Data/providerTypes");
const Tokens = require("../Models/Tokens");
const User = require("../Models/User");
const apiConnector = require("../Utilities/apiConnector");
const File = require('../Models/File');
const Folder = require("../Models/Folder");
const { uploadBufferTocloudinary } = require("../Utilities/FileUploader");
const Media = require('../Models/Media');
const RoomModel = require('../Models/Room');
const ChatMsg = require('../Models/ChatMessage');
const Permissions = require("../Models/Permissions");
const { removeFileFromCloudinary } = require("../Utilities/FileRemover");


// GITHUB PART

exports.getGithubFileContent = async(file,token,name,owner,folderId,userId,roomId) => {
    try {
        // console.log('FIle -> ',file.path);
        const url = `https://api.github.com/repos/${owner}/${name}/git/blobs/${file.sha}`;
        const fileRes = await apiConnector('GET',url,null,
            {
                Authorization:`Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            }
        );
        const fileData = fileRes.data.content; 

        if(fileRes.data.encoding!=="base64"){
            throw new Error("Error In FIle Decode");
        }

        const buff = Buffer.from(fileData,'base64');

        const extension = file.path.split('.').at(-1);
        name = file.path;
        

        if(monacoSuportedExtension.includes(extension)){
            const text = buff.toString('utf-8');
            // console.log(text);

            //make a new file 
            const file = await File.create(
                {
                    content:text,
                    Folder:folderId,
                    name,
                    owner:userId,
                    Room:roomId,
                    language:languageMapping[extension],
                }
            );

            //store the file in the required folder
            const updatedFolder = await Folder.findByIdAndUpdate(folderId,
                {
                    $push:{
                        Files:file._id,
                    }
                }
            );


        }
        else if(cloudinarySupportedExtensions.includes(extension)){

            //upload the file to cloudinary
            const uploadDetails = await uploadBufferTocloudinary(buff,'CodeSyncRoomData-'+roomId,name);

            // then make a media document and store in db
            const newMedia = await Media.create(
                {
                    Folder:folderId,
                    owner:userId,
                    Room:roomId,
                    url:uploadDetails.secure_url,
                    mediaType:getMediaType(extension),
                    name,
                }
            );
            
            // store the media in the folder
            const updatedFolder = await Folder.findByIdAndUpdate(folderId,
                {
                    $push:{
                        Medias:newMedia._id,
                    }
                }
            )
        }

    } catch (error) {
        console.error(error);
        console.log('Some Problem in Storing File');
    }
}

exports.getFolderContent = async(folderId,owner,name,sha,isroot,branch,token,roomId,userId) => {
    try {

        const url = `https://api.github.com/repos/${owner}/${name}/git/trees/${sha}`;
        const rootUrl = `https://api.github.com/repos/${owner}/${name}/git/trees/${branch}`

        const fileRes = await apiConnector('GET',(isroot)?(rootUrl):(url),
            null,
            {
                Authorization:`Bearer ${token}`
            }
        );

        const allFiles = (fileRes.data.tree);
        // console.log(allFiles);
        for(let file of allFiles){
            if(file.type==='blob'){
                await this.getGithubFileContent(file,token,name,owner,folderId,userId,roomId);
            }
            else{
                const subFolderName = file.path;


                // make a new subfolder
                const newFolder = await Folder.create(
                    {
                        isRoot:false,
                        name:subFolderName,
                        owner:userId,
                        Room:roomId,
                        parentFolder:folderId,
                    }
                );

                // add this folder to this folder
                const updatedFolder = await Folder.findByIdAndUpdate(folderId,
                    {
                        $push:{
                            Folders:newFolder._id,
                        }
                    }
                );



                await this.getFolderContent(newFolder._id,owner,name,file.sha,false,null,token,roomId,userId);
            }
        }
    } catch (error) {
        console.error(error);
        console.log('Some Problem in Recursive Folder Creator');
    }
}

exports.createRoomForGithubRepo = async(req,res) => {
    try {
        const user = req.user;
        let {owner,branch,name,description} = req.body;

        if(!user || !owner || !branch || !name ){
            console.log(user,owner,branch,name);
            return res.status(404).json(
                {
                    success:false,
                    message:"Invalid Request",
                }
            )
        }

        if(!description){
            description = 'No Description';
        }

        const reqUser = await User.findById(user._id);

        if(!reqUser){
            return res.status(401).json(
                {
                    success:false,
                    message:"User Not Found",
                }
            );
        }

        const tokenItem = await Tokens.findOne(
            {
                user:reqUser._id,
                provider:providerTypes.GITHUB,
            }
        );

        const token = tokenItem.token;

        // create a root folder for the room
        const rootFolder = await Folder.create(
            {
                isRoot:true,
                name:name,
                owner:reqUser._id,
            }
        );

        const roomJoinCode = crypto.randomUUID().substring(0,16);
        // for this repo create a new room
        const newRoom = await RoomModel.create(
            {
                joinCode:roomJoinCode,
                owner:reqUser._id,
                rootFolder:rootFolder._id,
                name:name,
                description,
            }
        );

        // update the root folder to get the room id
        const updatedFolder = await Folder.findByIdAndUpdate(rootFolder._id,{
            Room:newRoom._id,
        },{new:true});


        await this.getFolderContent(updatedFolder._id,owner,name,null,true,branch,token,newRoom._id,reqUser._id);


        return res.status(200).json(
            {
                success:true,
                message:"All Files Made Successfully",
            }
        )
    } catch (error) {
        console.log('Some Problem in Creating Room For Repo');
        console.error(error);
        return  res.status(500).json(
            {
                success:false,
                message:"Some Problem Occurred in Creating Room",
            }
        );
    }
}


// NORMAL PART
exports.populateAllRecursiveFolders = async(folder) => {
    const id = folder._id;
    let folderDetails = await Folder.findById(id)
    .polygon('Files')
    .populate('Folders')
    .populate('Medias')
    .exec();

    for(let i = 0;i<folderDetails.Folders.length;i++){
        folderDetails.Folders[i] = await this.populateAllRecursiveFolders(folderDetails.Folders[i]);
    }

    return folderDetails;
}

// get a room all data 
exports.getRoomDetails = async(req,res) => {
    try {
        const {roomId} = req.body;

        const user = req.user;

        if(!roomId || !user || !user._id){
            return res.status(404).json(
                {
                    success:false,
                    message:"User Not Not or Room Not Found",
                }
            )
        }

        const reqUser = await User.findById(user._id);
        const room = await RoomModel.findById(roomId);

        if(!room || !reqUser){
            return res.status(401).json(
                {
                    success:false,
                    message:"Unauthorized Request",
                }
            );
        }

        // get all the information of the room 
        let roomInfo = await RoomModel.findById(room._id)
        .populate('permittedUsers')
        .populate('activeUsers.user')
        .populate('owner')
        .populate('rootFolder')
        .populate('messages')
        .exec()
        ;

        // get the permissions
        const permissions = await Permissions.findOne(
            {
                User:reqUser._id,
                Room:roomInfo._id,
            }
        );

        roomInfo = {...roomInfo.toObject(),permissions};
        let newPermittedUsersVal = [];
        for(let user of roomInfo.permittedUsers){
            const per = await Permissions.findOne({
                User:user._id,
                Room:room._id,
            });
            newPermittedUsersVal.push({...user,permissions:per});
        }
        roomInfo = {...roomInfo,permittedUsers:newPermittedUsersVal}; 

        // console.log(roomInfo,'done');

        // return response 
        return res.status(200).json(
            {
                success:true,
                message:"Room Info Fetched",
                roomInfo,
            }
        );


    } catch (error) {
        console.error(error);
        console.log('Some Error Occurred in Getting Room Info');
        return res.status(500).json(
            {
                success:false,
                message:"Some Problem Occurred in Getting Room Info",
            }
        )
    }
}

exports.deleteFoldersRecursively = async(folderId,softDelete=true,softDeleteVal=true) => {
    try {
        const folderDetails = await Folder.findById(folderId).populate('Medias').exec();

        // delete the files
        for(let fileId of folderDetails.Files){
            if(softDelete){
                await File.findByIdAndUpdate(fileId,{
                    isDeleted:softDeleteVal,
                });
            }
            else{
                await File.findByIdAndDelete(fileId);
            }
        }

        // delete the medias
        for(let media of folderDetails.Medias){
            if(softDelete){
                await Media.findByIdAndUpdate(media,{
                    isDeleted:softDeleteVal,
                });
            }
            else{
                await removeFileFromCloudinary(media.url);
                await Media.findByIdAndDelete(media._id);
            }
        }

        // recursively delete the sub folders
        for(let folderId of folderDetails.Folders){
            await this.deleteFoldersRecursively(folderId,softDelete,softDeleteVal);
        }

        //delete this folder also
        if(softDelete){
            await Folder.findByIdAndUpdate(folderDetails._id,{
                isDeleted:softDeleteVal,
            })
        }
        else{
            await Folder.findByIdAndDelete(folderDetails._id);
        }

    } catch (error) {
        console.log('Some Problem In Deleting Folder');
        console.error(error);
    }
}

// delete a room
exports.deleteRoom = async(req,res) => {
    try {
        const {roomId} = req.body;
        const user = req.user;

        console.log(roomId,3);
        
        if(!roomId || !user){
            return res.status(400).json(
                {
                    success:false,
                    message:"Bad or Invalid Request",
                }
            )
        }

        console.log(roomId,1);

        const reqUser = await User.findById(user._id);

        const room = await RoomModel.findById(roomId);

        if(!reqUser || !room || !reqUser._id.equals(room.owner)){
            return res.status(404).json(
                {
                    success:false,
                    message:"Room or User Not found or Not Authrized",
                }
            )
        }

        console.log(roomId,2);

        //delete the chat messages
        for(let msgId of room.messages){
            await ChatMsg.findByIdAndDelete(msgId);
        }

        //delete permisiions
        const allPermissions = await Permissions.find(
            {
                User:reqUser._id,
                Room:room._id,
            }
        );

        //delete all the permissions
        for(const permission of allPermissions){
            await Permissions.findByIdAndDelete(permission._id);
        }

        // delete all medias
        const medias = await Media.find({
            Room:roomId,
        });
        for(let media of medias){
            await removeFileFromCloudinary(media.url,mapMediaTypeToCloudinaryResource(media.mediaType));
            await Media.findByIdAndDelete(media._id);
        }

        // delete all files
        await File.deleteMany({
            Room:roomId,
        });

        // delete all folders 
        await Folder.deleteMany({
            Room:roomId,
        });

        await RoomModel.findByIdAndDelete(roomId);


        // all done
        return res.status(200).json(
            {
                success:true,
                message:"Room Deleted Successfully",
            }
        )


    } catch (error) {
        console.error(error);
        console.log('Some Problem in Room Deletion');
        return res.status(500).json(
            {
                success:false,
                message:"Some Problem in Room Deletion"
            }
        )
    }
}

exports.isUserActionAllowed = async(room,reqUser,action,item) => {
    let isActionAllowed = false;
    if(reqUser._id.equals(room.owner)){
        isActionAllowed = true;
    }
    else{
        //take out the permission
        const permission = await Permissions.findOne(
            {
                Room:room._id,
                User:reqUser._id,
            }
        );
        isActionAllowed = (room.permittedUsers.includes(reqUser._id)
                                && (permission[action])
                            );
    }

    return isActionAllowed;
}

// get all rooms
exports.getUserRooms = async (req, res) => {
  try {
    const user = req.user;

    const id = user._id;
    let allRooms = await RoomModel.find({
        $or:[
            {permittedUsers:id},
            {owner:id},
        ]
    }).populate('activeUsers.user') // populate user inside activeUsers
    .exec();

    for(let i = 0;i<allRooms.length;i++){
        const permisiions = await Permissions.findOne({
            User:id,
            Room:allRooms[i]._id,
        });
        allRooms[i].joinCode = null;
        if(allRooms[i].owner.equals(id)){
            allRooms[i] = {...allRooms[i].toObject(),permissions:{read:true,write:true,delete:true}};
        }
        else{
            allRooms[i] = {...allRooms[i].toObject(),permissions:permisiions};
        }
    }

    return res.status(200).json({
      success: true,
      message: "All rooms fetched successfully",
      allRooms,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in getUserRooms');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in getting User Rooms'
    });
  }
};

// join a room
exports.joinARoom = async(req,res) => {
    try {
        const {roomId,joinCode} = req.body;
        const reqUser = req.user;

        if(!roomId || !joinCode || !reqUser._id){
            return res.status(401).json({
              success: false,
              message: "Invalid Request"
            });
        }

        // find the room
        const room = await RoomModel.findById(roomId);
        if(!room || room.bannedUsers.includes(reqUser._id)){
            return res.status(404).json({
              success: false,
              message: "No Such Room Found"
            });
        }

        if( (!(room.owner.equals(reqUser._id))) && (!room.permittedUsers.includes(reqUser._id))){
            if(room.joinCode!==joinCode){
                return res.status(401).json({
                  success: false,
                  message: "Wrong Join Code"
                });
            }
            await RoomModel.findByIdAndUpdate(room._id,{
                $push:{
                    permittedUsers:reqUser._id,
                }
            },{new:true})

            // create a new permission for the user enabled all
            const newPermissions = await Permissions.create(
                {
                    User:reqUser._id,
                    Room:room._id,
                }
            );
        }

        return res.status(200).json(
            {
                success:true,
                message:"User Added to Room"
            }
        )
    } catch (error) {
        console.log('Some Problem in Join Room');
        console.error(error);
        return res.status(500).json(
            {
                success:false,
                message:"Some Problem Occurred in Join Room"
            }
        )
    }
}

exports.leaveARoom = async (req, res) => {
  try {
    const user = req.user;
    const {roomId} = req.body;

    const room = await RoomModel.findById(roomId);
    if(!user._id || !roomId){
        return res.status(404).json({
          success: false,
          message: "Room or User Not Found"
        });
    }

    let newRoom = room;

    if(room.permittedUsers.includes(user._id)){
        newRoom = await RoomModel.findByIdAndUpdate(room._id,{
            $pull:{
                permittedUsers:user._id,
            }
        },{new:true})
    }

    return res.status(200).json({
      success: true,
      message: "User Removed From Room",
      newRoom,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in leaveARoom');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in leaving A Room'
    });
  }
};

exports.CreateARoom = async (req, res) => {
  try {
    const user = req.user;
    const {name,description,} = req.body;
    const roomJoinCode = crypto.randomUUID().substring(0,16);

    if(!roomJoinCode || !user._id || !name || !description){
        return res.status(404).json({
          success: false,
          message: "User Not Found Or Details Not Found",
        });
    }

    // make a root folder
    let rootFolder = await Folder.create({
        isRoot:true,
        name:name,
        owner:user._id,
        parentFolder:null,
    });

    // create a new room
    let newRoom = await RoomModel.create({
        description,
        joinCode:roomJoinCode,
        name,
        owner:user._id,
        rootFolder:rootFolder._id,
    });

    //update the room in root folder
    rootFolder = await Folder.findById(rootFolder._id,{
        Room:newRoom._id,
    },{new:true}) 

    newRoom = {...newRoom.toObject(),rootFolder};

    return res.status(200).json({
      success: true,
      message: "Room Created Successfully",
      newRoom,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in CreateARoom');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in CreateARoom'
    });
  }
};