const { default: mongoose } = require("mongoose");
const Room = require("../Models/Room");
const User = require("../Models/User");

function getRandomRGBColor() {
  const randColor = () => Math.floor(Math.random() * 100) + 50; // Generates 50–149
  const r = randColor();
  const g = randColor();
  const b = randColor();
  return `rgb(${r}, ${g}, ${b})`;
}


exports.handleUserRoomJoin = async(data,socket) => {
    try {
        const {roomId,userId} = data;

        // get the rrom
        const room = await Room.findById(roomId);
        // console.log(room);
        // console.log(room.activeUsers,userId);
        const val = room.activeUsers.filter(ele => ele.user===(userId));
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
        }

        socket.to(roomId).emit('user-join-event',body);

    } catch (error) {
        console.log(error.message);
        console.log('SOme Problem in socket io handler join room');
    }
}

exports.handleUserRoomLeave = async(data,socket) => {
    try {
        const {roomId,userId} = data;

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

        const user = await User.findById(userId);

        const body = {
            newUser:`${user.firstName} ${user?.lastName}`,
            room:removedUserRoom,
        }

        socket.to(roomId).emit('user-leave-event',body);

        // console.log('temp ----> ',userId,removedUserRoom);
        socket.leave(roomId);

    } catch (error) {
        console.error(error.message);
        console.log('Some Error Occurred in Socket Io handler leave room');
    }
}