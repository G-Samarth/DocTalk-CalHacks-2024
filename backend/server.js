const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Update this to your frontend URL when hosted
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 4000;

let doctorSocket = null;
let patientSocket = null;

io.on("connection", (socket) => {
  socket.on("request_id", (role) => {
    if (role === "doctor") {
      if (doctorSocket) {
        socket.emit("error", "A doctor is already connected");
        return;
      }
      doctorSocket = socket;
      socket.emit("assigned_id", "doctor");
    } else if (role === "patient") {
      if (patientSocket) {
        socket.emit("error", "A patient is already connected");
        return;
      }
      patientSocket = socket;
      socket.emit("assigned_id", "patient");
    } else {
      socket.emit("error", "Invalid role");
    }
  });

  socket.on("disconnect", () => {
    if (socket === doctorSocket) {
      doctorSocket = null;
    } else if (socket === patientSocket) {
      patientSocket = null;
    }
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    const targetSocket = userToCall === "doctor" ? doctorSocket : patientSocket;
    if (targetSocket) {
      targetSocket.emit("callUser", { signal: signalData, from, name });
    }
  });

  socket.on("answerCall", (data) => {
    const targetSocket = data.to === "doctor" ? doctorSocket : patientSocket;
    if (targetSocket) {
      targetSocket.emit("callAccepted", data.signal);
    }
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
