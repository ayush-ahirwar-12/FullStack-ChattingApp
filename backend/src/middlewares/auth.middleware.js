import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import cacheClient from "../services/cache.service.js";

const authMiddleware = async (req, res, next) => {
  try {
      console.log("Cookies:", req.cookies);
  console.log("Auth header:", req.headers.authorization);
    const authHeader = req.headers.authorization;
    const token =
      (authHeader && authHeader.split(" ")[1]) ||
      req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied.",
      });
    }

    const isBlacklisted = await cacheClient.get(token);
    if (isBlacklisted) {
      return res.status(422).json({
        message: "Token is blacklisted",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};
export default authMiddleware;
