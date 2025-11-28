require("dotenv").config();
const express = require("express")
const connectdb = require("./src/db/db")
const authRouter = require("./src/routes/auth.route")
const cookie = require("cookie-parser")
const cors = require("cors")
const messageRouter = require("./src/routes/message.route")
const {app,io,server} =require("./src/config/socket")
const passport = require("passport");
const session = require("express-session");
const userModel = require("./src/models/user.model");
var googleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
const __dirname = path.resolve();





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