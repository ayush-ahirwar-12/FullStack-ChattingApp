import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectdb from "./src/db/db.js";
import authRouter from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRouter from "./src/routes/message.route.js";
import { app, io, server } from "./src/config/socket.js";
import passport from "passport";
import session from "express-session";
import userModel from "./src/models/user.model.js";
import GoogleStrategy from "passport-google-oauth20";
import path from "path";
import { fileURLToPath } from "url";

// fix __dirname manually in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.use(express.json());
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookie());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    cookie: {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
}
}));

passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:5000/api/auth/google/callback"
},async(accessToken,refreshToken,profile,done)=>{
    try {
        const email = profile._json.email;
         const fullname = profile._json.name;
        // const googleId = profile._json.sub;
        const profilepic = profile._json.picture;

        let user = await userModel.findOne({email});
        if(!user){
            user = await userModel.create({
                email,fullname,profilepic
            })
        }


        return done(null,user)
        
    } catch (error) {
        return done(error,null)
    }
}))

passport.serializeUser((user,done)=>done(null,user._id));
passport.deserializeUser(async(id,done)=>{
    const user = await userModel.findById(id);
    done(null,user)
});


app.use((req,res,next)=>{
    req.io=io;
    next();
})



app.use("/api/auth",authRouter)
app.use("/api/message",messageRouter);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}
































server.listen(5000,()=>{
    console.log("server connected to port 5000");
    connectdb();
})