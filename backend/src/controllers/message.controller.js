import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import sendFiles from "../services/storage.service.js";

const getUserForSideBar = async (req, res) => {
  try {
    const CurrentUserId = req.user._id;
    const CurrentUser = await userModel.findById(CurrentUserId);
    if (!CurrentUser) {
      res.status(404).json({ message: "user not found" });
    }
    const AllUsers = await userModel.find({ _id: { $ne: CurrentUser } });
    res.status(200).json({
      message: "All users fetched",
      AllUsers: AllUsers,
    });
  } catch (error) {
    res.status(400).json({ message: "error in getuserforsidebar" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await messageModel
      .find({
        $or: [
          { SenderId: myId, ReceiverId: userToChatId },
          { SenderId: userToChatId, ReceiverId: myId },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "messages fetched successfully",
      messages,
    });
  } catch (error) {
    res.status(400).json({ message: "error in getmessage controller" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, imageurl } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;


    const Message = await messageModel.create({
      SenderId: senderId,
      ReceiverId: receiverId,
      text,
      image: imageurl,
    });
    await Message.save();
    req.io.to(receiverId.toString()).emit("receive-msg",Message);
    res.status(200).json({
      message: "message sent successfully",
      Message,
    });
  } catch (error) {
    console.log("error in sendmessage controller", error);
    res.status(400).json({
      message: "error in sendmessage controller",
    });
  }
};

const uploadImage=async(req,res)=>{
  try {
    const file = req.file;
    const uploadResponse=await sendFiles(file.buffer,`chat_${Date.now()}`);
    res.json({success:true,url:uploadResponse.url})
  } catch (error) {
    console.log("Image Upload Error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
}
export default{ getUserForSideBar, getMessage, sendMessage,uploadImage };
