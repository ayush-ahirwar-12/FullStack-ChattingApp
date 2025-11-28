import express from "express";
const router = express.Router();

import AuthController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";
import passport from "passport";
import jwt from "jsonwebtoken";

router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Cuurent loggedin user",
    user: req.user,
  });
});
router.post("/register",AuthController.UserRegisterController);
router.post("/login",AuthController.UserLoginController);
router.post("/logout",authMiddleware,AuthController.UserLogoutController);
router.put("/profilepic",authMiddleware,upload.single("image"),AuthController.setProfilePic);
router.get("/check",authMiddleware,AuthController.checkUser);
router.put("/updateprofile",authMiddleware,AuthController.UpdateProfileController);

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}));
router.get("/google/callback",passport.authenticate("google",{session:true,failureRedirect:"/api/auth/google/failed"}),async(req,res)=>{
  try {
    const user = req.user;
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax",
       maxAge: 24 * 60 * 60 * 1000
    })
    console.log("Logged in:", user.name);
    res.redirect("http://localhost:5173/?google=success")
  } catch (error) {
    console.log("error in callbaack",error);
     res.redirect("http://localhost:5173/?google=failed");
    
  }
})

router.get("/google/failed",(req,res)=>{
  res.status(400).json({
    message:"authentication failed"
  })
})

router.get("/profile",authMiddleware,(req,res)=>{
  // if(!req.user) return res.status(400).json("not authenticated")
  res.status(200).json({
    message:"authentication successfull",
    user:req.user
})
})





export default router;