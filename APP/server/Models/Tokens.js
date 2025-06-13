const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        provider:{
            type:String,
            enum:["google","github"],
            required:true,
        },
        token:{
            type:String,
            required:true,
        },
        CreatedAt:{
            type:Date,
            default:Date.now,
            required:true,
        },
    }
);


module.exports = mongoose.model("Token",TokenSchema);