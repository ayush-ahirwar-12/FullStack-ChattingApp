const express = require("express")
const router = express.Router();
const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../config/multer");

router.get("/getuser",authMiddleware,messageController.getUserForSideBar)
router.get("/getmessage/:id",authMiddleware,messageController.getMessage);
router.post("/sendmessage/:id",authMiddleware,upload.single("image"),messageController.sendMessage);
router.post("/upload-image",authMiddleware,upload.single("image"),messageController.uploadImage);
module.exports = router;