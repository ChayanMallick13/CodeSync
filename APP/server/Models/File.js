const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
    {
        content:{
            type:String,
            default:"",
        },
        name:{
            type:String,
            required:true,
        },
        Folder:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Folder",
            required:true,
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        language:{
            type:String,
            required:true,
        },
        Room:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Room",
            required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now,
        }
    }
);


module.exports = mongoose.model("File",FileSchema);