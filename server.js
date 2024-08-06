const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const PORT = 3001;

let messages = [];

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");
  
  socket.on("send-message", (message) => {
    const messageWithId = {
      id: socket.id,
      text: message
    };
    messages.push(messageWithId);
    socket.broadcast.emit("receive-message", messageWithId);
  });

  socket.emit("socket-id", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));