const express = require('express');

const { 
    createRoomForGithubRepo, 
    getUserRooms,
    getRoomDetails,
    joinARoom
} = require('../Controllers/Rooms');

const { auth } = require('../Middlewares/Auth');
const { getFolderDetails, getRoomChats } = require('../Controllers/RoomItems');



const roomRoutes = express.Router();


roomRoutes.post('/createroom-fromRepo',auth,createRoomForGithubRepo);
roomRoutes.get('/getAllUserRooms',auth,getUserRooms);
roomRoutes.post('/getRoomInfo',auth,getRoomDetails);
roomRoutes.post('/folder/getDetails',auth,getFolderDetails);
roomRoutes.post('/joinRoom',auth,joinARoom);
roomRoutes.post('/getAllMsgs',auth,getRoomChats);


module.exports = roomRoutes;