const { googleSignInClient } = require("../Server_Config/GoogleSignInConfig");
const apiConnector = require("../Utilities/apiConnector");
const User = require("../Models/User");
const Tokens = require("../Models/Tokens");
const OTP = require("../Models/otp");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const providerTypes = require("../Data/providerTypes");
const { mailSender } = require("../Utilities/MailSender");
const { generateResetPasswordEmailTemplate } = require("../Mail/Templates/resetPasswordTemplate");

require("dotenv").config();

// This will take the login Request from the front end and make the user navigate to github login page
exports.handleGithubLoginRequest = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUrl = encodeURIComponent(
      `${process.env.GITHUB_CALLBACK_URL}`
    );
    const scope = encodeURIComponent("read:user user:email repo");

    // console.log("Contro");

    const githubAuthUrl = `${process.env.GITHUB_BASE_AUTH_URL}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}`;

    res.redirect(githubAuthUrl);
  } catch (error) {
    console.error(error);
    console.log("Some Problem in Github Request Handler");
  }
};

//This will be callled by the github itself on successfull Login Complete
exports.handleGithubCallback = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const code = req.query.code;

    const requestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    };

    const requestHeader = {
      Accept: "application/json",
    };

    const userDetailsResponse = await apiConnector(
      "POST",
      process.env.GITHUB_TOKEN_EXCHANGE_URL,
      requestBody,
      requestHeader
    );

    // console.log('yy --> ',userDetailsResponse);

    const accessToken = userDetailsResponse.data.access_token;

    // console.log(userDetailsResponse.data);

    const userInfoRes = await apiConnector(
      "GET",
      process.env.GITHUB_USER_INFO_URL,
      null,
      {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      }
    );
    const userInfo = userInfoRes.data;
    const userEmailDetailsResponse = await apiConnector(
      "GET",
      process.env.GITHUB_USER_EMAIL_INFO_URL,
      null,
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );

    // console.log(userInfo);
    const email = userEmailDetailsResponse.data
      .filter((ele) => ele.primary === true)
      .at(0).email;
    // console.log(email,userInfo,userInfo.name,userInfo.login);
    const name = ((userInfo.name ?? userInfo.login) || "noName").split(" ");
    const firstName = name[0];
    let lastName = "";
    if (name.length > 1) {
      for (let i = 1; i < name.length; i++) {
        lastName += name[i];
      }
    }
    const password = null;

    req.body = {
      firstName,
      lastName,
      image: userInfo.avatar_url,
      email,
      password,
      accountType: "github",
      token: accessToken,
      success: true,
    };

    // console.log(req.body);
  } catch (error) {
    console.error(error);
    console.log("Some Problem Occurred in Signing In with github");
    req.body.success = false;
  }

  return this.handleSignUp(req,res);
};

// The google Sign in Handler
exports.handleGoogleSignIn = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleSignInClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // console.log(payload);

    if (!payload.email_verified) {
      throw new Error("Email Not verified in Google Sign In");
    }

    req.body = {
      firstName: payload.given_name,
      lastName: payload?.family_name ?? "",
      image: payload.picture,
      email: payload.email,
      password: null,
      accountType: "google",
      success: true,
      token: credential,
    };

    // console.log(req.body);

    

  } catch (error) {
    console.error(error);
    console.log("Some Problem Occurred in Signing In with github");
    req.body.success = false;
  }

  return this.handleSignUp(req,res);
  
};

//sign in handler
exports.handleSignIn = async (req, res) => {
    try {
        const {email,password,accountType} = req.body;

        if(!email || (accountType==='traditional' && !password) || !accountType){
            if(accountType==='gtithub'){
                return res.redirect(process.env.UNSUCCESSFULL_LOGIN_REDIRECT);
            }
            return res.status(404).json(
                {
                    success:false,
                    message:"Some Problem Occurred in Signin",
                }
            )
        }

        const userExits = await User.findOne({
            email,
            accountType,
        });

        if(!userExits || !userExits.accountType.includes(accountType)){
            if(accountType==='gtithub'){
                return res.redirect(process.env.UNSUCCESSFULL_LOGIN_REDIRECT);
            }
            return res.status(404).json(
                {
                    success:false,
                    message:"You Are Not Registered With Us",
                }
            )
        }
        // console.log('password',password,userExits);
        if(accountType==='traditional'){
            const passwordsMatch = await bcrypt.compare(password,userExits.password);
            if(!passwordsMatch){
                return res.status(401).json(
                    {
                        success:false,
                        message:"Passwords Do Not Match",
                    }
                )
            }
        }

        const payload = {
            email,
            accountType,
            userId:userExits._id,
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,
            {
                expiresIn: '3d',
            }
        ); // new Date(Date.now() + 3*24*60*60*1000)

        const cookieOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"None",
            expires: new Date(Date.now() + 3*24*60*60*1000),
        }

        res.cookie("AuthCookie",token,cookieOptions);

        if(accountType==='github'){
            return res.redirect(process.env.SUCCESSFULL_LOGIN_REDIRECT);
        }
        else{
            return res.status(200).json(
                {
                    success:true,
                    message:"Sign In Successfull",
                    accountType,
                }
            )
        }

    } catch (error) {
        console.error(error);
        // console.log('Some Error in Loggin You In');
        if(req.body.accountType===providerTypes.GITHUB){
            return res.redirect(process.env.UNSUCCESSFULL_LOGIN_REDIRECT);
        }
        else{
            return res.status(401).json(
                {
                    success:false,
                    message:"Some Problem Occured in Signin In",
                }
            )
        }
    }

};

//sign up handler
exports.handleSignUp = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      image,
      email,
      password,
      confirmPassword,
      accountType,
      success,
      token,
      otp
    } = req.body;


    // console.log(otp,typeof(otp),success);

    // console.log(req.body);


    // console.log(req.body);
    

    if (!success || !firstName || !email || !accountType) {
      if (accountType === "github") {
        res.redirect(process.env.UNSUCCESSFULL_LOGIN_REDIRECT);
        return;
      } else {
        return res.status(401).json({
          success: false,
          message: "Some Error Occurred in Signing You In",
        });
      }
    }

    if(confirmPassword && confirmPassword!==password){
      return res.status(400).json({
        success: false,
        message: "Passwords Do Not Match"
      });
    }


    //check if the user already exits
    let userExists = await User.findOne({
      email,
    });

    // console.log(accountType);

    if(userExists && userExists.accountType.includes(accountType)){
        if(accountType==='traditional'){
            return res.status(403).json({
                success:false,
                message:'You Are Already Registered With Us',
            })
        }
    }

    if(!image){
      image = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    }

    if(accountType==='traditional'){
      //hash the password
      password = await bcrypt.hash(password,10);
    }

    const recentotp = await OTP.find({
        email,
    }).sort({CreatedAt:-1});


    if(accountType==='traditional' && (recentotp.at(-1).otp!==`${otp}`)){
        return res.status(401).json(
            {
                success:false,
                message:"OTPs DO NOT MATCH",
            }
        )
    }


    if (!userExists) {
      // if the user not exits already no account

      //create a new user entry
      userExists = await User.create({
        firstName,
        lastName,
        email,
        image,
        password,
        accountType: [accountType],
      });

      // make a new token entry for this provide login if its not normal login
      if (token) {
        await Tokens.create({
          token,
          user: userExists._id,
          provider: accountType,
        });

      }
    } 
    else {

        // user already exits

        //if not normal login need to see about the token
      if (token) {

        // if the token for this provider already exits then just modify it
        if (userExists.accountType.includes(accountType)) {
          await Tokens.findOneAndUpdate(
            {
              user: userExists._id,
              provider: accountType,
            },
            {
              token: token,
              CreatedAt: Date.now(),
            }
          );
        } else {
            
            //else create a new token entry for this provider  and make this new entry type possible for User
          await User.findByIdAndUpdate(userExists._id, {
            $push: {
              accountType: accountType,
            },
          });

          await Tokens.create({
            token,
            user: userExists._id,
            provider: accountType,    
          });

        }
      }
      else{
        //else create a new token entry for this provider  and make this new entry type possible for User
          await User.findByIdAndUpdate(userExists._id, {
            $push: {
              accountType: accountType,
            },
            password,
            lastName:(userExists.lastName??lastName),
          });
      }
    }
    
    

    // if the github is provide redirect ir else send a res
    if(accountType==='github' || accountType==='google'){
      // console.log('This is a call to next');
        return this.handleSignIn(req,res);
    }

    return res.status(200).json(
        {
            success:true,
            message:'User SignUp Successfull',
        }
    );

  } catch (error) {
    console.error(error.message);
    console.log('Some Error in SingUp Handler');
    if(req.body.accountType==='github'){
        res.redirect(process.env.UNSUCCESSFULL_LOGIN_REDIRECT);
        return;
    }
    return res.status(401).json(
        {
            success:false,
            message:'Some Problem Occurred in Signing You Up',
        }
    )
  }
};

exports.sendChangePasswordMail = async(req,res) => {
  try {
    const {email} = req.body;

    if(!email){
      return res.status(401).json(
        {
          success:false,
          message:"Invalid Email"
        }
      )
    }

    const existingUser = await User.findOne({
      email,
      accountType:providerTypes.TRADITIONAL,
    });

    if(!existingUser){
      return res.status(404).json(
        {
          success:false,
          message:"No Such User Found",
        }
      )
    }

    //create a new reset token
    const token = crypto.randomUUID();

    //make thses changes in user
    await User.findByIdAndUpdate(existingUser._id,
      {
        resetpasswordToken:{
          token,
        },
      }
    );

    const resetLink = `${process.env.FRONT_END_URL}/resetpassword/${token}`;
    //make a mail to the user
    await mailSender(existingUser.email,
      'Reset Your Password – CodeSync Account Security',
      generateResetPasswordEmailTemplate(existingUser.firstName,existingUser.email,resetLink)
    )

    console.log('Mail sent');

    return res.status(200).json(
      {
        success:true,
        message:"Reset Mail Sent Check Your Email",
      }
    )


  } catch (error) {
    console.error(error);
    console.log('Some Problem in Sending Reset Password Link');
    return res.status(500).json(
      {
        success:false,
        message:"Some Problem in sending Reset Mail",
      }
    )
  }
}

exports.resetPassword = async(req,res) => {
  try {
    const {token,password,confirmPassword} = req.body;
    // console.log(req.body);

    const user = await User.findOne({
      resetpasswordToken:{
        token,
      }
    });

    if(!user || !password || !confirmPassword || confirmPassword!==password){
      return res.status(404).json(
        {
          success:false,
          message:"Invalid Request",
        }
      )
    }

    if(Date.now() > user.resetpasswordToken.createdAt + 60*1000){
      return res.status(401).json(
        {
          success:false,
          message:"Token Expired",
        }
      )
    }

    // all okay chnage the password
    const newHashedPassword = await bcrypt.hash(password,10);

    await User.findByIdAndUpdate(user._id,
      {
        password:newHashedPassword,
        resetpasswordToken:null,
      }
    );


    return res.status(200).json(
      {
        success:true,
        message:"User Password Chnaged",
      }
    )


  } catch (error) {
    console.log('Some Error occurred in Reseting The Password');
    console.error(error);
    return res.status(500).success(
      {
        success:false,
        message:"Some Problem Occured in Reseting The passowrd",
      }
    )

  }
}