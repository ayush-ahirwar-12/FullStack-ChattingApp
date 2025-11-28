import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import cacheClient from "../services/cache.service.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1] || req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied." });
  const isBlacklisted = await cacheClient.get(token);
  if(isBlacklisted){
    res.status(422).json({
      message:"token is blacklisted"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findById(decoded.id);
  if (!user) {
    res.status(404).json({ message: "user not found" });  
  }
  req.user = user;
  next();
  } catch (error) {
    return res.status(400).json({
        message:"token is not valid"
    })
  }
};

export default authMiddleware;
