const mongoose = require('mongoose');

const PermissionsSchema = new mongoose.Schema(
    {
        User:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        Room:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Room",
            required:true,
        },
        read:{
            type:Boolean,
            required:true,
            default:true,
        },
        write:{
            type:Boolean,
            required:true,
            default:false,
        },
        delete:{
            type:Boolean,
            required:true,
            default:false,
        },
    }
);


module.exports = mongoose.model("Permissions",PermissionsSchema);