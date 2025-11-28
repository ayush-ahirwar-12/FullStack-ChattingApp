import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import sendFiles from "../services/storage.service.js";
import cacheClient from "../services/cache.service.js";

const UserRegisterController = async (req, res) => {
  try {
    const { email, fullname, password } = req.body;
    if (!email || !fullname || !password) {
      res.status(400).json({
        message: "All fields required",
      });
    }
    const ifUserExists = await userModel.findOne({ email });
    if (ifUserExists) {
      res.status(400).json({
        message: "user already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      fullname,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    res.status(201).json({
      message: "user created successfully",
      user,
    });
  } catch (error) {
    console.log("error in userRegistercontroller", error);
    res.status(401).json({
      message: "error in creating user",
    });
  }
};

const UserLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "all fields required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "no user exists" });
    }
    const decrypt = await bcrypt.compare(password, user.password);
    if (!decrypt) {
      res.status(400).json({ message: "invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:"12h"});
    res.cookie("token", token);

    return res.status(200).json({
      message: "user login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("error in userLogincontroller", error);
    res.status(401).json({
      message: "error in login user",
    });
  }
};

const UserLogoutController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(404).json({
        message: "token not found",
      });
    }
    await cacheClient.set(token,"blacklisted")
    res.clearCookie("token",{
      httpOnly:true,
      secure:false,
      sameSite:"lax"
    });
     req.logout((err) => {
            if (err) return next(err);
            req.session.destroy((err) => {
                if (err) console.log('Session destroy error:', err);
            });
        });
    res.status(200).json({
      message: "user logout successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal server error",
    });
    console.log("error-->", error);
  }
};

const setProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      res.status(404).json({ message: "no file uploaded" });
    }

    const uploadResponse = await sendFiles(req.file.buffer, "profilepic");

    const currentUserId = req.user._id;
    const user = await userModel.findByIdAndUpdate(
      currentUserId,
      { profilepic: uploadResponse.url },
      { new: true }
    );

    res.status(200).json({ message: "profile pic uploaded", user });
  } catch (error) {
    console.log("error in uploading pic", error);
    res.status(500).json({ message: "Error uploading pic", error });
  }
};

const checkUser = async (req, res) => {
  res.status(200).json({
    message: "current loggedin user",
    user: req.user,
  });
};

const UpdateProfileController = async (req, res) => {
  try {
    const id = req.user;
    const { email, fullname } = req.body;
    // if (!email|| !fullname) {
    //   res.status(401).json({
    //     messsage: "Fields cannot be empty",
    //   });
    // }
    const user = await userModel.findByIdAndUpdate(
      id,
      { fullname: fullname, email: email },
      { new: true }
    );
    console.log(user);
    
    res.status(200).json({
      message: "User Profile Information Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message:"error in updating the user info"
    })
  }
};
export default {
  UserRegisterController,
  UserLoginController,
  UserLogoutController,
  setProfilePic,
  checkUser,
  UpdateProfileController
};
