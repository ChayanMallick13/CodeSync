const mongoose = require('mongoose');



const RoomSchema = new mongoose.Schema(
    {
        permittedUsers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }],
        name:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            trim:true,
            required:true,
        },
        activeUsers:[{
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
            cursorColor:{
                type:String,
                required:true,
                default:function(){
                    return `rgb(${Math.floor(Math.random()*200)+55},${Math.floor(Math.random()*200)+55},${Math.floor(Math.random()*200)+55})`;
                }
            },
        }],
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        rootFolder:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Folder",
            required:true,
        },
        joinCode:{
            type:String,
        },
        messages:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ChatMessage",
        }],
        createdAt:{
            type:Date,
            required:true,
            default:Date.now,
        },
        bannedUsers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }],
    }
)

module.exports = mongoose.model("Room",RoomSchema);