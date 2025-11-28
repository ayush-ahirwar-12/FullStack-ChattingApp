// backend socket server (e.g. server.js)
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const messageModel = require("../models/message.model");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const onlineUsers = [];
let ActiveUser=[];

// Use the correct event name: "connection"
io.on("connection", (socket) => {
  console.log("A user Connected", socket.id);

  socket.on("user-online",(userId)=>{
    ActiveUser.push({userId,socketId:socket.id});
    io.emit("online-users",ActiveUser)
  })

  // send the socket id to client
  socket.emit("take_sid", socket.id);

  socket.on("join-room", async (ChatUsers) => {
    // join the room for this chat (roomId is fine)
    socket.join(ChatUsers.roomId);

    // keep track of online sockets if needed (optional)
    if (ChatUsers.Socket_id && !onlineUsers.includes(ChatUsers.Socket_id)) {
      onlineUsers.push(ChatUsers.Socket_id);
    }

    // load old messages and send them to this socket
    let restMessages = await messageModel
      .find({
        $or: [
          { SenderId: ChatUsers.SenderId, ReceiverId: ChatUsers.ReceiverId },
          { SenderId: ChatUsers.ReceiverId, ReceiverId: ChatUsers.SenderId },
        ],
      })
      .sort({ createdAt: 1 });

    console.log("user joined with room id->", ChatUsers.roomId);
    socket.emit("load-old-messages", restMessages);
  });

  socket.on("send-msg", async (msg) => {
    try {
      // create message in DB
      const newMessage = await messageModel.create({
        SenderId: msg.SenderId,
        ReceiverId: msg.ReceiverId,
        text: msg.text || null,
        image: msg.image,
      });

      io.to(msg.roomId).emit("receive-msg", newMessage);
    } catch (err) {
      console.error("Error saving/sending message:", err);
      // optionally notify the sender of an error
      socket.emit("send-error", { error: "Message not delivered" });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    // optional: remove from onlineUsers
    const idx = onlineUsers.indexOf(socket.id);
    if (idx !== -1) onlineUsers.splice(idx, 1);

    ActiveUser = ActiveUser.filter((u) => u.socketId !== socket.id);

    io.emit("online-users", ActiveUser);
  });
});

module.exports = { io, app, server };
