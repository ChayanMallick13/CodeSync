const { Server } = require("socket.io");
const { handleUserRoomJoin, handleUserRoomLeave, upDateOldData, removeUserFrom, removeUserFromRoom } = require("../Socket_Controllers/Rooms");
const { sendMessageHandler } = require("../Socket_Controllers/chat_Msg");
require("dotenv").config();

module.exports = function setUpSocketIo(server) {
    const io = new Server(server, {
        cors: {
        origin: process.env.FRONT_END_URL,
        credentials: true,
        methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("User Connected To Socket IO Web Socket");

        socket.on('connect_To_Room',(data) => {
            // console.log(data);
            handleUserRoomJoin(data,socket);
        })

        socket.on('disconnect_from_room',(data)=>{
            handleUserRoomLeave(data,socket);
        })

        socket.on('sendMessage',(data)=>{
            sendMessageHandler(data,io);
        })

        socket.on('fileChnaged',(data)=>{
            upDateOldData(data,io);
        })

        socket.on('userPermissionChange',(data) => {
            io.to(data.roomId).emit('updateRoomPermissions',data);
        })

        socket.on('handleRoomDeleted',async (data)=>{
            // console.log(data,'newww');
            socket.to(data.roomId).emit('roomDeletedCheck',data);
        })

        socket.on('leaveRoomByUser',(data)=>{
            removeUserFromRoom(data,io);
        })

        socket.on('disconnect',() => {
            console.log('User Disconnected');
        })
    });
};
