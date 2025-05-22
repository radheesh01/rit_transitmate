const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow cross-origin requests

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (change to your frontend URL in production)
    methods: ["GET", "POST"]
  }
});

// Handle client connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When a sender sends location
  socket.on("sendLocation", (data) => {
    console.log("Location received:", data);
    // Broadcast to all clients
    io.emit("receiveLocation", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log('Server listening on port ${PORT}');
});