import mongoose from "mongoose";
const messageShema = new mongoose.Schema({
    SenderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    ReceiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,

    },
    image:{
        type:String
    }
    
},{
    timestamps:true
})

const messageModel = mongoose.model("message",messageShema);

export  default messageModel;