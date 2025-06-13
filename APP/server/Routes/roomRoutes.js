const express = require('express');

const { 
    createRoomForGithubRepo 
} = require('../Controllers/Rooms');

const { auth } = require('../Middlewares/Auth');



const roomRoutes = express.Router();


roomRoutes.post('/createroom-fromRepo',auth,createRoomForGithubRepo);


module.exports = roomRoutes;