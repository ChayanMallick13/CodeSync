const mongoose = require('mongoose');
const { mailSender } = require('../Utilities/MailSender');
const { generateOtpEmailTemplate } = require('../Mail/Templates/otpMailTemplate');


const otpSchema = new mongoose.Schema({
    otp:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    createdAT:{
        type:Date,
        expires: 15*60,
        default:Date.now,
    }
});

//post hook 
async function sendEmailWithOtp(email,otp){
    try {
        const title = `Verify Yourself For CodeSync Platform || CodeSync Chayan Mallick`;

        const mailInfo = await mailSender(email,title,
            generateOtpEmailTemplate(otp,email,process.env.COMPANY_LOGO_URL)
        );

        console.log('Mail for Otp Sent Successfully');

    } catch (error) {
        console.error(error.message);
        console.log('Some Problem in Sending Mail for otp');
    }
}

otpSchema.pre('save',async function(next){
    await sendEmailWithOtp(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP",otpSchema);