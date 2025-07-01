const express = require('express');

const { 
    createRoomForGithubRepo, 
    getUserRooms,
    getRoomDetails,
    joinARoom,
    deleteRoom
} = require('../Controllers/Rooms');

const { auth } = require('../Middlewares/Auth');
const { getItemDetails, getRoomChats, renameFile, renamefolder, renameMedia, 
    deleteFile, deleteFolder, deleteMedia, createAItem } = require('../Controllers/RoomItems');
const { changeUserPermmissions } = require('../Controllers/User');



const roomRoutes = express.Router();


roomRoutes.post('/createroom-fromRepo',auth,createRoomForGithubRepo);
roomRoutes.get('/getAllUserRooms',auth,getUserRooms);
roomRoutes.post('/getRoomInfo',auth,getRoomDetails);
roomRoutes.post('/folder/getDetails',auth,getItemDetails);
roomRoutes.post('/joinRoom',auth,joinARoom);
roomRoutes.post('/getAllMsgs',auth,getRoomChats);
roomRoutes.post('/file/rename',auth,renameFile);
roomRoutes.post('/folder/rename',auth,renamefolder);
roomRoutes.post('/media/rename',auth,renameMedia);
roomRoutes.post('/file/delete',auth,deleteFile);
roomRoutes.post('/folder/delete',auth,deleteFolder);
roomRoutes.post('/media/delete',auth,deleteMedia);
roomRoutes.post('/delete',auth,deleteRoom);
roomRoutes.post('/createItem',auth,createAItem);
roomRoutes.post('/changePermissions',auth,changeUserPermmissions);


module.exports = roomRoutes;