import express from "express";
const router = express.Router();

import messageController from "../controllers/message.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

router.get("/getuser",authMiddleware,messageController.getUserForSideBar)
router.get("/getmessage/:id",authMiddleware,messageController.getMessage);
router.post("/sendmessage/:id",authMiddleware,upload.single("image"),messageController.sendMessage);
router.post("/upload-image",authMiddleware,upload.single("image"),messageController.uploadImage);
export default router;