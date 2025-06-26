const { Server } = require("socket.io");
const { handleUserRoomJoin, handleUserRoomLeave } = require("../Socket_Controllers/Rooms");
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
            handleUserRoomJoin(data,socket);
        })

        socket.on('disconnect_from_room',(data)=>{
            handleUserRoomLeave(data,socket);
        })

        socket.on('sendMessage',(data)=>{
            sendMessageHandler(data,io);
        })

        socket.on('disconnect',() => {
            console.log('User Disconnected');
        })
    });
};
