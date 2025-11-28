import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true

    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
    },
    // role:{
    //     type:String,
    //     default:"user",
    //     enum:["user","admin"],

    // }

},{timestamps:true})

const userModel = mongoose.model("User",userSchema);

export default userModel;