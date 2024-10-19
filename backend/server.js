const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-adminsdk.json");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "doctalk-9e28b.appspot.com",
});

const bucket = admin.storage().bucket();

// Function to check Firebase connection
async function checkFirebaseConnection() {
  try {
    await bucket.exists();
    console.log("Successfully connected to Firebase Storage");
    return true;
  } catch (error) {
    console.error("Failed to connect to Firebase Storage:", error);
    return false;
  }
}

// Use this function in your server startup
checkFirebaseConnection().then((isConnected) => {
  if (isConnected) {
    // Start your server or proceed with other initializations
    console.log("Server is ready to use Firebase Storage");
  } else {
    console.log("Please check your Firebase configuration");
  }
});

async function setupFolders() {
  const folders = ["audio_recordings", "other_files"];

  for (const folder of folders) {
    try {
      // Check if folder exists
      const [files] = await bucket.getFiles({ prefix: `${folder}/` });

      if (files.length === 0) {
        // If folder doesn't exist, create an empty file to establish the folder
        await bucket.file(`${folder}/.placeholder`).save("");
        console.log(`Created folder: ${folder}`);
      } else {
        console.log(`Folder already exists: ${folder}`);
      }
    } catch (error) {
      console.error(`Error setting up folder ${folder}:`, error);
    }
  }
}

// Call this function during your server initialization
setupFolders();

// Set up multer for handling file uploads
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// Helper function to generate a unique filename
const generateUniqueFilename = (originalName, prefix) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();
  return `${prefix}_${timestamp}_${randomString}.${extension}`;
};

app.post("/save-audio", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    console.log("No file received in the request");
    return res.status(400).send("No file uploaded.");
  }

  const file = req.file;
  const fileName = generateUniqueFilename(file.originalname, "audio");
  const filePath = `audio_recordings/${fileName}`;

  console.log(`Attempting to upload file: ${filePath}`);

  const fileUpload = bucket.file(filePath);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    console.error("Error uploading to Firebase:", error);
    res.status(500).send("An error occurred during file upload.");
  });

  blobStream.on("finish", () => {
    console.log(`File uploaded successfully: ${filePath}`);
    res.status(200).json({
      message: "File uploaded successfully to Firebase",
      fileName: filePath,
    });
  });

  blobStream.end(file.buffer);
});

// Add a new route to handle other file uploads
app.post("/save-file", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const file = req.file;
  const fileName = generateUniqueFilename(file.originalname, "file");
  const filePath = `other_files/${fileName}`;

  const fileUpload = bucket.file(filePath);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    console.error("Error uploading to Firebase:", error);
    res.status(500).send("An error occurred during file upload.");
  });

  blobStream.on("finish", () => {
    res.status(200).json({
      message: "File uploaded successfully to Firebase",
      fileName: filePath,
    });
  });

  blobStream.end(file.buffer);
});

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
