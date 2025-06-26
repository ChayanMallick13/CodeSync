const express = require('express');
const {auth} = require('../Middlewares/Auth');

const 
{ 
    getAllUserInfo, 
    updateUserName, 
    getUserAllRepos,
    updatePassword,
    changeProfilePicture
} = require('../Controllers/Profile');
const { getUserRepos } = require('../Controllers/User');
const { AddReview, getAllReviews } = require('../Controllers/Review');

const profileRouter = express.Router();

profileRouter.get('/getuserInfo',auth,getAllUserInfo);

profileRouter.post('/updateUsername',auth,updateUserName);

profileRouter.get('/getAllUsersRepo',auth,getUserAllRepos);

profileRouter.post('/updatePassword',auth,updatePassword);

profileRouter.post('/changeProfilePicture',auth,changeProfilePicture);

profileRouter.get('/getAllUserRepos',auth,getUserRepos);

profileRouter.post('/addReview',auth,AddReview);

profileRouter.get('/getAllReviews',getAllReviews);

module.exports = profileRouter;