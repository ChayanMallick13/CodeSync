const express = require('express');

const { 
    handleGithubLoginRequest, 
    handleGithubCallback, 
    handleGoogleSignIn, 
    handleSignUp, 
    handleSignIn, 
    sendChangePasswordMail, 
    resetPassword
} = require('../Controllers/Auth');

const { sendOtp } = require('../Controllers/otp');

const authRouter = express.Router();


authRouter.get('/githubReq',handleGithubLoginRequest);

authRouter.get('/github/verify',handleGithubCallback);

authRouter.post('/google/verify',handleGoogleSignIn);

authRouter.post('/signup',handleSignUp);

authRouter.post('/signin',handleSignIn);

authRouter.post('/sendOtp',sendOtp);

authRouter.post('/forgot-password/sendmail',sendChangePasswordMail);

authRouter.post('/forgot-password/resetpasswordVerify',resetPassword);

module.exports = authRouter;