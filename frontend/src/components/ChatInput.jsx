import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from ".././reducers/UserchatSlice";
import { io } from "socket.io-client";
import { axiosInstance } from "../axios/axios";
import msgtone from "../assets/msg_tone.mp3";
import msgrcvtone from "../assets/msg2_tone.mp3"

const ChatInput = () => {
  const msgSound = useRef(new Audio(msgtone));
  const msgSound2 = useRef(new Audio(msgrcvtone));
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isUploading, setisUploading] = useState(false)
  const {messages}= useSelector((state)=>state.chat);
  const { user } = useSelector((state) => state.auth);
  const [text, settext] = useState("");
  const [imagePreview, setimagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [Socket_id, setSocket_id] = useState(null);
  const [ImageUrl, setImageUrl] = useState(null);

  const socket = useMemo(
    () => io("http://localhost:5000", { autoConnect: true }),
    []
  );
  const handleImageChange = async(e) => {
    const file = e.target.files[0];
    if(!file)return;
    setisUploading(true);
    const urlPreview = URL.createObjectURL(file);
    setimagePreview(urlPreview);
    const formData = new FormData();
    formData.append("image",file);

 try {
    const upload = await axiosInstance.post("/message/upload-image", formData);
    setImageUrl(upload.data.url);
  } catch (error) {
    console.error("Image upload failed:", error);
    removeImage();
  } finally {
    setisUploading(false); 
  }




  };
  



  const removeImage = () => {
    setimagePreview(null);
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Socket connection setup and cleanup
  useEffect(() => {
    const handleConnect = () => console.log("Connected with socket");
    const handleTakeSid = (sid) => setSocket_id(sid);

    socket.on("connect", handleConnect);
    socket.on("take_sid", handleTakeSid);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("take_sid", handleTakeSid);
      // do NOT fully disconnect here if other components need the socket
      socket.disconnect();
    };
  }, [socket]);

  // join room when socket id available
  useEffect(() => {
    if (!Socket_id) return;
    const chatUsers = {
      roomId: [user._id, id].sort().join("_"),
      SenderId: user._id,
      ReceiverId: id,
      Socket_id,
    };
    socket.emit("join-room", chatUsers);
  }, [Socket_id, socket, id, user._id]);

  // LISTEN for incoming messages from server and update redux
  useEffect(() => {
    const handleReceive = (msg) => {
      // msg is the saved message object from server (with _id, createdAt)
      dispatch(addMessage(msg));
          if (msg.SenderId === user._id) {
      removeImage();
      settext("");
      setImageUrl(null);
    }
    };

    msgSound2.current.play().catch(()=>{});
    socket.on("receive-msg", handleReceive);

    return () => {
      socket.off("receive-msg", handleReceive);
    };
  }, [socket, dispatch]);

  const handleSendMsg = (e) => {
    e.preventDefault();
    if (!text.trim() && !ImageUrl) return;

    let newMessage = {
      SenderId: user._id,
      ReceiverId: id,
      text: text.trim() || null,
      image: ImageUrl,
      roomId: [user._id, id].sort().join("_"),
    };

    // Emit to server — server will save and emit the canonical message back to the room.
    socket.emit("send-msg", newMessage);
    msgSound.current.play().catch(()=>{});

    // REMOVE optimistic local dispatch to avoid duplicate messages.
    // The server will emit "receive-msg" to everyone in the room (including this sender).
    // dispatch(addMessage(newMessage)); // <-- removed

    // settext("");
    // setImageUrl(null)
    // removeImage();
  };

  return (
    <div className="p-4 w-full bg-linear-to-tr from-white to-blue-50 rounded-b-3xl shadow-inner flex flex-col gap-3 select-none">
      {imagePreview && (
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-md relative max-w-xs">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-blue-300"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center hover:bg-blue-300 transition"
            type="button"
            aria-label="Remove image preview"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <form onSubmit={handleSendMsg} className="flex items-center gap-3">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg border border-blue-300 bg-white text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => settext(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 rounded-full hover:bg-blue-100 transition ${
            imagePreview ? "text-blue-600" : "text-blue-300"
          }`}
          aria-label="Add image"
        >
          <Image size={20} />
        </button>
        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isUploading}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 disabled:cursor-not-allowed transition"
          aria-label="Send message"
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
