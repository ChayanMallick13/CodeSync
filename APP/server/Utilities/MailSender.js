const nodeMailer = require('nodemailer');
require('dotenv').config();


exports.mailSender = async(email,title,body) => {
    try{
        const transporter = nodeMailer.createTransport(
            {
                host:process.env.MAIL_HOST,
                auth:{
                    user:process.env.MAIL_USER,
                    pass:process.env.MAIL_PASS,
                },
            }
        );

        const mailInfo = await transporter.sendMail(
            {
                from:"CodeSync Private Limited || By Chayan Mallick",
                to:`${email}`,
                subject:`${title}`,
                html:`${body}`,
            }
        );

        console.log('Mail Sent Successfully To ',email);
        return mailInfo;
    }catch(err){
        console.error(err);
        console.log('Some Problem Occurred in Sending Mail');
    }
};