const jwt = require('jsonwebtoken');
const User = require('../Models/User');


exports.auth = async(req,res,next) => {
    try {
        //try to take out the cookie auth cookie 
        const AuthToken = req.cookies.AuthCookie;

        if(!AuthToken){
            return res.status(401).json(
                {
                    success:false,
                    message:"Session Expired",
                }
            );
        }

        //check the token validity
        const userDetails = jwt.verify(AuthToken,process.env.JWT_SECRET_KEY);

        //check it is a valid user
        const userExits = await User.findById(userDetails.userId);

        if(!userExits){
            return res.status(401).json(
                {
                    success:false,
                    message:"User doesn't exits",
                }
            )
        }
        userExits.password = undefined;

        userExits.token = AuthToken;
        
        req.user = userExits;

        next();

    } catch (error) {
        return res.status(400).json(
            {
                success:false,
                message:"Permission Denied",
            }
        )
    }
}