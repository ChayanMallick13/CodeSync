const { Server } = require("socket.io");
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


        socket.on('disconnection',() => {
            console.log('User Disconnected');
        })
    });
};
