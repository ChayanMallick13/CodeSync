const mongoose = require('mongoose');


const FolderSchema = new mongoose.Schema(
    {
        Files:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"File",
        }],
        Folders:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Folder",
        }],
        name:{
            type:String,
            required:true,
            trim:true,
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        createdAt:{
            type:Date,
            default:Date.now,
        },
        Medias:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Media",
        }],
        isRoot:{
            type:Boolean,
            required:true,
            default:false,
        },
        Room:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Room",
        },
    }
);

module.exports = mongoose.model("Folder",FolderSchema);