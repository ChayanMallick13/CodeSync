const User = require("../Models/User");
const File = require('../Models/File');
const Folder = require("../Models/Folder");
const Media = require('../Models/Media');
const RoomModel = require('../Models/Room');
const { removeFileFromCloudinary } = require("../Utilities/FileRemover");
const { deleteFoldersRecursively, isUserActionAllowed } = require("./Rooms");
const Permissions = require("../Models/Permissions");
const ChatMessage = require("../Models/ChatMessage");
const { mapMediaTypeToCloudinaryResource, getMediaType } = require("../Data/extensionsData");
const Room = require("../Models/Room");
const { UploadFileToCloudinary } = require("../Utilities/FileUploader");





// delete a folder
exports.deleteFolder = async(req,res) => {
    try {
        const {folderId,prevFolderId,roomId,softDelete,softDeleteVal} = req.body;
        // console.log(req.body);
        const user = req.user;

        if(!user || !folderId || !prevFolderId){
            return res.status(400).json(
                {
                    success:false,
                    message:"Invalid Request",
                }
            )
        }

        const reqUser = await User.findById(user._id);
        const prevFolder = await Folder.findById(prevFolderId);
        const folder = await Folder.findById(folderId);
        const room = await RoomModel.findById(roomId);

        if(!reqUser || !prevFolder || !folder || !room || folder.isRoot){
            return res.status(404).json(
                {
                    success:false,
                    message:"User or Folder Not Found or Not Authorized",
                }
            )
        }

        //check the permmission
        let isDeletionAllowed = await isUserActionAllowed(room,reqUser,'delete',folder);

        

        if(!isDeletionAllowed){
            return res.status(401).json(
                {
                    success:false,
                    message:"You Are Not Given Deletion Access",
                }
            )
        }

        if(!softDelete){
            // remove the folder from prev folder
            await Folder.findByIdAndUpdate(prevFolder._id,
                {
                    $pull:{
                        Folders:folder._id,
                    }
                },{
                    new:true,
                }
            );
        }

        //delete the folder recursively
        await deleteFoldersRecursively(folder._id,softDelete,softDeleteVal);

        return res.status(200).json(
            {
                success:true,
                message:"Folder Deleted Successfully",
            }
        );

    } catch (error) {
        console.error(error);
        console.log('Error in Deleting Folder');
        return res.status(500).json(
            {
                success:false,
                message:"Some Problem in Deleting Folder",
            }
        )
    }
}

// delete file
exports.deleteFile = async(req,res) => {
    try {
        const {fileId,roomId,softDelete,softDeleteVal} = req.body;
        const reqUser = req.user;
        const room = await RoomModel.findById(roomId);

        if(!fileId || !reqUser || !room){
            return res.status(400).json(
                {
                    success:false,
                    message:"Invalid User",
                }
            );
        }

        // find the file
        const file = await File.findById(fileId);
        
        const isDeletionAllowed = await isUserActionAllowed(room,reqUser,'delete',file);

        if(!isDeletionAllowed){
            return res.status(401).json(
                {
                    success:"You are Not Given Deletion access for this room",
                }
            )
        }

        // if deletion allowed 

        // first pull this out of te folder
        if(!softDelete){
            await Folder.findByIdAndUpdate(file.Folder,
                {
                    $pull:{
                        Files:file._id,
                    }
                }
            );
        }

        // now nothing just delete this file
        if(softDelete){
            await File.findByIdAndUpdate(file._id,{
                isDeleted:softDeleteVal,
            });
        }
        else{
            await File.findByIdAndDelete(file._id);
        }

        // all success
        return res.status(200).json(
            {
                success:true,
                message:"File Deleted Succesffully",
            }
        )
    } catch (error) {
        console.error(error);
        console.log('Some Error in Deleting in The file');
        return res.status(500).json(
            {
                success:false,
                message:"Some Internal Problem Occurred",
            }
        )
    }
}

// delete a media
exports.deleteMedia = async(req,res) => {
    try {
        const {mediaId,roomId,softDelete,softDeleteVal} = req.body;

        // console.log(req.body);
        const reqUser = req.user;
        const room = await RoomModel.findById(roomId);

        if(!mediaId || !reqUser || !room){
            return res.status(400).json(
                {
                    success:false,
                    message:"Invalid User",
                }
            );
        }

        // find the file
        const media = await Media.findById(mediaId);
        
        const isDeletionAllowed = await isUserActionAllowed(room,reqUser,'delete',media);

        if(!isDeletionAllowed){
            return res.status(401).json(
                {
                    success:"You are Not Given Deletion access for this room",
                }
            )
        }

        // if deletion allowed 

        if(!softDelete){
            // first pull this out of te folder
            await Folder.findByIdAndUpdate(media.Folder,
                {
                    $pull:{
                        Files:media._id,
                    }
                }
            );

            //delete the media fro cloudinary
            await removeFileFromCloudinary(media.url,mapMediaTypeToCloudinaryResource(media.mediaType));
        }

        

       if(softDelete){
            await Media.findByIdAndUpdate(media._id,{
                isDeleted:softDeleteVal,
            })
       }
       else{
            // now nothing just delete this Media
            await Media.findByIdAndDelete(media._id);
        }

        // all success
        return res.status(200).json(
            {
                success:true,
                message:"File Deleted Succesffully",
            }
        )
    } catch (error) {
        console.error(error);
        console.log('Some Error in Deleting in The media');
        return res.status(500).json(
            {
                success:false,
                message:"Some Internal Problem Occurred",
            }
        )
    }
}

// rename a file 
exports.renameFile = async (req, res) => {
  try {

    const user = req.user;
    const {fileId,roomId,newName} = req.body;
    const reqUser = await User.findById(user._id);
    const reqFile = await File.findById(fileId);
    const room = await RoomModel.findById(roomId);

    if(!reqUser || !reqFile || !room || !newName){
        // console.log(reqUser,reqFile,room,newName);
        return res.status(404).json({
          success: false,
          message: "user or file Not Found"
        });
    }

    const permisiions = await Permissions.findOne(
        {
            Room:room._id,
            User:reqUser._id,

        }
    );
    // console.log(permisiions);
    if( (!reqUser._id.equals(room.owner)) && ((!permisiions) || (!permisiions.write))){
        return res.status(401).json({
          success: false,
          message: "User Action Not Allowed",
        });
    }

    // everything okay so now chnage the file name
    await File.findByIdAndUpdate(reqFile._id,
        {
            name:newName,
        },
        {
            new:true,
        }
    );


    return res.status(200).json({
      success: true,
      message: "File renamed successfully"
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in renameFile');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in renaming the file'
    });
  }
};

//rename a folder
exports.renamefolder = async (req, res) => {
  try {

    const user = req.user;
    const {folderId,roomId,newName} = req.body;
    const reqUser = await User.findById(user._id);
    const reqFolder = await Folder.findById(folderId);
    const room = await RoomModel.findById(roomId);

    if(!reqUser || !reqFolder || !room || !newName){
        return res.status(404).json({
          success: false,
          message: "user or file Not Found"
        });
    }

    const permisiions = await Permissions.findOne(
        {
            Room:room._id,
            User:reqUser._id,
        }
    );

    if( (!reqUser._id.equals(room.owner)) && ((!permisiions) || (!permisiions.write))){
        return res.status(401).json({
          success: false,
          message: "User Action Not Allowed",
        });
    }

    // everything okay so now chnage the file name
    await Folder.findByIdAndUpdate(reqFolder._id,
        {
            name:newName,
        },
        {
            new:true,
        }
    );


    return res.status(200).json({
      success: true,
      message: "Folder renamed successfully"
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in renameFolder');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in renaming the Folder'
    });
  }
};


//rename a media
exports.renameMedia = async (req, res) => {
  try {

    const user = req.user;
    const {mediaId,roomId,newName} = req.body;
    const reqUser = await User.findById(user._id);
    const reqMedia = await Media.findById(mediaId);
    const room = await RoomModel.findById(roomId);

    if(!reqUser || !reqMedia || !room || !newName){
        return res.status(404).json({
          success: false,
          message: "user or file Not Found"
        });
    }

    const permisiions = await Permissions.findOne(
        {
            Room:room._id,
            User:reqUser._id,
        }
    );

    if( (!reqUser._id.equals(room.owner)) && ((!permisiions) || (!permisiions.write))){
        return res.status(401).json({
          success: false,
          message: "User Action Not Allowed",
        });
    }

    // everything okay so now chnage the file name
    await Media.findByIdAndUpdate(reqMedia._id,
        {
            name:newName,
        },
        {
            new:true,
        }
    );


    return res.status(200).json({
      success: true,
      message: "Folder renamed successfully"
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in renameMedia');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in renaming the Media'
    });
  }
};

// get the folder details 
exports.getItemDetails = async(req,res) => {
    try {
        const {itemId,roomId,type} = req.body;
        const reqUser = req.user;
        const types = ['file','folder','media'];
        if(!itemId || !roomId || !reqUser || !types.includes(type)){
            // console.log(itemId,roomId,reqUser,type);
            return res.status(400).json(
                {
                    success:false,
                    message:"Inavlid Request",
                }
            )
        }

        const room = await RoomModel.findById(roomId);
        // console.log(room);
        let item = null;
        if(type===types[0]){
            item = await File.findById(itemId);
        }
        else if(type===types[1]){
            item = await Folder.findById(itemId);
        }
        else{
            item = await Media.findById(itemId);
        }

        if(!item){
            return res.status(404).json({
              success: false,
              message: "Item Not found"
            });
        }

        // console.log(folder);

        const isReadAloowed = await isUserActionAllowed(room,reqUser,'read',item);

        if(!isReadAloowed && !room.owner===reqUser._id){
            return res.status(401).json(
                {
                    success:false,
                    message:"User Action Not Allowed",
                }
            )
        }

        return res.status(200).json(
            {
                success:true,
                message:"Item Info Fetched",
                item:item,
            }
        );
    } catch (error) {
        console.error(error);
        console.log('Some Problem Occurred in Getting Item Info');
        return res.status(500).json(
            {
                success:false,
                message:"Some Problem Occured in Item Info",
            }
        )
    }
}

// get all room chats 
exports.getRoomChats = async (req, res) => {
  try {
    const user = req.user;
    const {roomId} = req.body;

    if(!user._id || !roomId){
        return res.status(404).json({
          success: false,
          message: "Invalid Request"
        });
    }

    const room = await RoomModel.findById(roomId);
    if(!room || (!(room.owner!==user._id) && !room.permittedUsers.includes(user._id))){
        return res.status(401).json({
          success: false,
          message: "Inavlid Request"
        });
    }

    const messages = await ChatMessage.find({
        Room:room._id,
    }).sort(
        {
            sentAt:1,
        }
    ).populate('Sender');

    return res.status(200).json({
      success: true,
      message: "All Messages Fetched",
      messages,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in getRoomChats');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in getting Room Chats'
    });
  }
};

exports.createAItem = async (req, res) => {
  try {
    const user = req.user;
    const {parentFolder,type,roomId,name,language,extension} = req.body;
    // console.log(req.body);
    const newFile = req.files?.newFile;
    const types = ['file','folder','media'];

    if(!(user._id) || !parentFolder || !type || !types.includes(type)){
        return res.status(404).json({
          success: false,
          message: "Not Found Enough Details"
        });
    }
    let item = null;
    const room = await Room.findById(roomId);
    const isAllowed = isUserActionAllowed(room,user,'write');

    if(!isAllowed){
        return res.status(401).json({
          success: false,
          message: "Unthorised access"
        });
    }

    if(type===types[0]){
        item = await File.create({
            Folder:parentFolder,
            owner:user._id,
            name,
            language,
            Room:room._id,
        });
        await Folder.findByIdAndUpdate(parentFolder,{
            $push:{
                Files:item._id,
            }
        })
    }
    else if(type===types[1]){
        item = await Folder.create({
            isRoot:false,
            name,
            owner:room.user_id,
            parentFolder,
            Room:room._id,
        });
        await Folder.findByIdAndUpdate(parentFolder,{
            $push:{
                Folders:item._id,
            }
        })
    }
    else{
        const uploadDetails = await UploadFileToCloudinary(newFile,'CodeSyncRoomData-'+room._id);
        item = await Media.create({
            Folder:parentFolder,
            mediaType:getMediaType(extension),
            name,
            owner:user._id,
            Room:room._id,
            url:uploadDetails.secure_url,
        })
        await Folder.findByIdAndUpdate(parentFolder,{
            $push:{
                Medias:item._id,
            }
        })
    }

    return res.status(200).json({
      success: true,
      message: "Item Added To Room",
      item,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in createAItem');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in creating A Item'
    });
  }
};

exports.saveAFile = async(req,res) => {
    try {
        const user = req.user;
        const {roomId,fileId,newContent} = req.body;

        if(!user._id || !roomId || !fileId){
            return res.status(44).json({
              success: false,
              message: "User Or File Not Found"
            });
        }

        const room = await Room.findById(roomId);
        const isAllowed = await isUserActionAllowed(room,user,'write');
        if(!isAllowed){
            return res.status(401).json({
              success: false,
              message: "User Action Not Allowed"
            });
        }

        const newFile = await File.findByIdAndUpdate(fileId,{
            content:newContent,
        },{new:true});

        return res.status(200).json(
            {
                success:true,
                message:"File Saving Successfull",
                newFile,
            }
        )
    } catch (error) {
        console.error(error);
        console.log('Some Internal Error in Saving The file');
        return res.status(500).json({
          success: false,
          message: "Some Internal Error in Saving The file"
        });
    }
}