const providerTypes = require("../Data/providerTypes");
const OTP = require("../Models/otp");
const User = require("../Models/User");
const otpGenerator = require('otp-generator');



exports.sendOtp = async(req,res) => {
    try {
        const {email} = req.body;


        //check if the user already exits 
        const userExits = await User.findOne({
            email,
        });

        if(userExits && userExits.accountType.includes(providerTypes.TRADITIONAL)){
            return res.status(403).json(
                {
                    success:false,
                    message:"You are Already Registered With Us Login",
                }
            );
        }

        //generate a otp
        const otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            digits:true,
        });

        //create a otp doc
        const otpInfo = await OTP.create(
            {
                email,
                otp,
            }
        );

        //otp is
        // console.log('otp is ',otp);

        //return successfull response
        return res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
        })

    } catch (error) {
        console.error(error);
        console.log('Error in Sending OTP');
        return res.status(403).json(
            {
                success:false,
                message:"OTP Not Sent",
            }
        )
    }
}