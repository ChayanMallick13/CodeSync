const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true,
        },
        lastName:{
            type:String,
            trim:true,
        },
        email:{
            type:String,
            required:true,
        },
        image:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            default:null,
        },
        accountType:[{
            type:String,
            enum:['google','github','traditional'],
        }],
        resetpasswordToken:{
            token:{
                type:String,
            },
            createdAt:{
                type:Date,
                default:Date.now,
            },
        }
    }
);


module.exports = mongoose.model("User",UserSchema);