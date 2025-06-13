const { monacoSuportedExtension, cloudinarySupportedExtensions, languageMapping, getMediaType } = require("../Data/extensionsData");
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
        let name = "";
        const parts = file.path.split('.');
        for(let x of parts){
            if(x===extension){
                break;
            }
            name = name + x;
        }
        

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
            const uploadDetails = await uploadBufferTocloudinary(buff,roomId,name);

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
        const {owner,branch,name} = req.body.repo;
        const {roomName} = req.body;

        if(!user || !owner || !branch || !name ){
            return res.status(404).json(
                {
                    success:false,
                    message:"Invalid Request",
                }
            )
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
                name:roomName,
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

        if(!room || !reqUser || room.owner!==reqUser._id){
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

        // use recursion to get all folder info
        roomInfo.rootFolder = this.populateAllRecursiveFolders(roomInfo.rootFolder);

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

exports.deleteFoldersRecursively = async(folderId) => {
    try {
        const folderDetails = await Folder.findById(folderId).populate('Medias').exec();

        // delete the files
        for(let fileId of folderDetails){
            await File.findByIdAndDelete(fileId);
        }

        // delete the medias
        for(let media of folderDetails.Medias){
            await removeFileFromCloudinary(media.url);
            await Media.findByIdAndDelete(media._id);
        }

        // recursively delete the sub folders
        for(let folderId of folderDetails.Folders){
            await this.deleteFoldersRecursively(folderId);
        }

        //delete this folder also
        await Folder.findByIdAndDelete(folderDetails._id);

    } catch (error) {
        console.log('Some Problem In Deleting Folder');
    }
}

// delete a room
exports.deleteRoom = async(req,res) => {
    try {
        const {roomId} = req.body;
        const user = req.user;
        
        if(!roomId || !user){
            return res.status(400).json(
                {
                    success:false,
                    message:"Bad or Invalid Request",
                }
            )
        }

        const reqUser = await User.findById(user._id);

        const room = await RoomModel.findById(roomId);

        if(!reqUser || !room || reqUser._id!==room.owner){
            return res.status(404).json(
                {
                    success:false,
                    message:"Room or User Not found or Not Authrized",
                }
            )
        }

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

        // delete the folders recursivesly
        await this.deleteFoldersRecursively(room.rootFolder);

        // delete this room also
        await RoomModel.findByIdAndDelete(room._id);


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
    if(item.owner===reqUser._id){
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

// rename a room
