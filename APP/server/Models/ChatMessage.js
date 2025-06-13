const mongoose = require('mongoose');


const ChatMessageSchema = new mongoose.Schema(
    {
        Sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        Room:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Room",
            required:true,
        },
        Message:{
            type:String,
            required:true,
        },
        sentAt:{
            type:Date,
            default:Date.now,
            required:true,
        }
    }
)


module.exports = mongoose.model("ChatMessage",ChatMessageSchema);