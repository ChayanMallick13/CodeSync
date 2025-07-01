const mongoose = require('mongoose');


const MediaSchema = new mongoose.Schema(
    {
        Room:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Room",
            required:true,
        },
        Folder:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Folder",
            required:true,
        },
        mediaType:{
            type:String,
            required:true,
        },
        name:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now,
        },
        isDeleted:{
            type:Boolean,
            default:false,
        }
    }
);


module.exports = mongoose.model("Media",MediaSchema);