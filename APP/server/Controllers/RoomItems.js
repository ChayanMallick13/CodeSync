const User = require("../Models/User");
const File = require('../Models/File');
const Folder = require("../Models/Folder");
const Media = require('../Models/Media');
const RoomModel = require('../Models/Room');
const { removeFileFromCloudinary } = require("../Utilities/FileRemover");
const { deleteFoldersRecursively, isUserActionAllowed } = require("./Rooms");
const Permissions = require("../Models/Permissions");





// delete a folder
exports.deleteFolder = async(req,res) => {
    try {
        const {folderId,prevFolderId,roomId} = req.body;
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

        if(!reqUser || !prevFolder || !folder || !room){
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

        //delete the folder recursively
        await deleteFoldersRecursively(folder._id);

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
        const {fileId,roomId} = req.body;
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
        await Folder.findByIdAndUpdate(file.Folder,
            {
                $pull:{
                    Files:file._id,
                }
            }
        );

        // now nothing just delete this file
        await File.findByIdAndDelete(file._id);

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
        const {mediaId,roomId} = req.body;
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

        // first pull this out of te folder
        await Folder.findByIdAndUpdate(media.Folder,
            {
                $pull:{
                    Files:media._id,
                }
            }
        );

        //delete the media fro cloudinary
        await removeFileFromCloudinary(media.url);

        // now nothing just delete this Media
        await Media.findByIdAndDelete(media._id);

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
        return res.status(404).json({
          success: false,
          message: "user or file Not Found"
        });
    }

    const permisiions = await Permissions.findOne(
        {
            Room:room._id,
            User:room._id,

        }
    );

    if(reqUser._id!==room.owner && !permisiions.write){
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
            User:room._id,
        }
    );

    if(reqUser._id!==room.owner && !permisiions.write){
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
            User:room._id,
        }
    );

    if(reqUser._id!==room.owner && !permisiions.write){
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
exports.getFolderDetails = async(req,res) => {
    try {
        const {folderId,roomId} = req.body;
        const reqUser = req.user;

        if(!folderId || !roomId || !reqUser){
            return res.status(400).json(
                {
                    success:false,
                    message:"Inavlid Request",
                }
            )
        }

        const room = await RoomModel.findById(roomId);
        const folder = Folder.findById(folderId)
        .populate('Files')
        .populate('Medias')
        .exec();

        const isReadAloowed = await isUserActionAllowed(room,reqUser,'read',folder);

        if(!isReadAloowed){
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
                message:"Folder Info Fetched",
                folder:folder,
            }
        );
    } catch (error) {
        console.error(error);
        console.log('Some Problem Occurred in Getting Folder Info');
        return res.status(500).json(
            {
                success:false,
                message:"Some Problem Occured in Folder Info",
            }
        )
    }
}
