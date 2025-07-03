const { default: mongoose } = require("mongoose");
const Room = require("../Models/Room");
const User = require("../Models/User");
const File = require("../Models/File");
const Folder = require("../Models/Folder");
const Media = require("../Models/Media");
const Permissions = require("../Models/Permissions");
const { removeFileFromCloudinary } = require("../Utilities/FileRemover");
const { mapMediaTypeToCloudinaryResource } = require("../Data/extensionsData");

function getRandomRGBColor() {
  const randColor = () => Math.floor(Math.random() * 100) + 50; // Generates 50–149
  const r = randColor();
  const g = randColor();
  const b = randColor();
  return `rgb(${r}, ${g}, ${b})`;
}

exports.handleUserRoomJoin = async(data,socket) => {
    try {
        const {roomId,userId,isDash,userDetails,remove} = data;

        if(isDash){
            socket.join(roomId);
            // const permissions = await Permiss
            socket.to(roomId).emit('checkNewMember',{userDetails:userDetails,remove});
            // console.log('temp',userDetails);
            return;
        }

        // get the rrom
        const room = await Room.findById(roomId);
        // console.log(room);
        // console.log(room.activeUsers,userId);
        const val = room.activeUsers.filter(ele => ele.user.toString()===(userId.toString()));
        // console.log(val);
        if(val.length!==0){
            return;
        }

        // make the room current users update with the values
        const activeUser = {
            user:userId,
            cursorColor:getRandomRGBColor(),
        }
        const newRoom = await Room.findByIdAndUpdate(roomId,{
            $push:{
                activeUsers:activeUser,
            }
        },{new:true}).populate('permittedUsers')
        .populate('activeUsers.user')
        .populate('owner')
        .populate('rootFolder')
        .populate('messages')
        .exec()
        ;

        // console.log(newRoom);
        socket.join(roomId);
        const user = await User.findById(userId);

        const body = {
            newUser:`${user.firstName} ${user?.lastName}`,
            room:newRoom,
            newUserDetails:user,
        }

        socket.to(roomId).emit('user-join-event',body);

    } catch (error) {
        console.log(error.message);
        console.log('SOme Problem in socket io handler join room');
    }
}

exports.handleUserRoomLeave = async(data,socket) => {
    try {
        const {roomId,userId,changedFiles} = data;

        // console.log(data);

        // remove the user from active place
        const removedUserRoom = await Room.findByIdAndUpdate(roomId,{
            $pull:{
                activeUsers:{user:userId}
            }
        },{new:true}).populate('permittedUsers')
        .populate('activeUsers.user')
        .populate('owner')
        .populate('rootFolder')
        .populate('messages')
        .exec()
        ;

        if(removedUserRoom.activeUsers.length===0){
            const allFolders = await Folder.find({
                Room:roomId,
                isDeleted:true,
            });

            for(let folder of allFolders){
                if(!folder.isRoot)
                    await Folder.findByIdAndUpdate(folder.parentFolder,{
                $pull:{
                    Folders:folder._id,
                }})
                await Folder.findByIdAndDelete(folder._id);
            }

            const allMedia = await Media.find({
                Room:roomId,
                isDeleted:true,
            });

            for(let media of allMedia){
                await removeFileFromCloudinary(media.url,mapMediaTypeToCloudinaryResource(media.mediaType));
                await Folder.findByIdAndUpdate(media.Folder,{
                    $pull:{
                        Medias:media._id,
                    }
                });
                await Media.findByIdAndDelete(media._id);
            }

            const allFiles = await File.find({
                Room:roomId,
                isDeleted:true,
            });

            for(let file of allFiles){
                await Folder.findByIdAndUpdate(file.Folder,{
                    $pull:{
                        Files:file._id,
                    }
                });
                await File.findByIdAndDelete(file._id);
            }
        }

        const user = await User.findById(userId);

        const body = {
            newUser:`${user.firstName} ${user?.lastName}`,
            room:removedUserRoom,
        }

        for(let file of changedFiles){
            let item = await File.findByIdAndUpdate(file.fileId,{
                content:file.content,
            },{new:true});
            const res = {
                item,
                type:'file',
            }
            socket.to(roomId).emit('fileChnagedSocketRes',res)
        }
        

        socket.to(roomId).emit('user-leave-event',body);

        // console.log('temp ----> ',userId,removedUserRoom);
        socket.leave(roomId);

    } catch (error) {
        console.error(error.message);
        console.log('Some Error Occurred in Socket Io handler leave room');
    }
}

exports.upDateOldData = async(data,io) => {
    const {itemId,type,roomId,userName,operation,oldName,isnew,recover} = data;
    // console.log(data);
    let item = '';
    if(type==='file'){
        item = await File.findById(itemId);
    }
    else if(type==='folder'){
        item = await Folder.findById(itemId);
    }
    else if(type==='media'){
        item = await Media.findById(itemId);
    }
    // console.log(data,item);
    const res = {
        item,
        oldName,
        userName,
        operation,
        type,
        isnew,
        recover,
    };
    // console.log(res);
    io.to(roomId).emit('fileChnagedSocketRes',res);
}

exports.removeUserFromRoom = async(data,socket) => {
    const {targetUserId,userId,kick,ban,roomId,targetUser,kickedBy} = data;
    // console.clear();
    // console.log('ppp',data);


    let permitted = !kick;
    const roomDetails = await Room.findById(roomId);

    if(!permitted){
        permitted = permitted || (roomDetails.owner.equals(userId));
    }

    // get the this user permisisions
    if(!permitted){
        const permissions = await Permissions.findOne({
            User:userId,
            Room:roomId,
        });
        permitted = permissions.delete;
    }

    if(!permitted){
        return;
    }

    let updateValue = {
        $pull:{
            permittedUsers:targetUserId,
            activeUsers:{user:targetUserId},
        }
    };

    if(ban){
        updateValue = {...updateValue,$push:{
            bannedUsers:targetUserId,
        }}
    }

    const newRoom = await Room.findByIdAndUpdate(roomDetails._id,updateValue,{new:true});
    // console.log(data);
    // console.log(newRoom);

    socket.to(roomId).emit('checkNewMember',{userDetails:{_id:targetUserId},remove:true,targetUser,kickedBy});

}