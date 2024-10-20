const express = require("express");
const http = require("http");
const https = require("https");
const socketIo = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-adminsdk.json");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const apiKey = process.env.DAILY_API_KEY;

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
  const folders = ["audio_recordings", "pdfs"];

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
  const filePath = `pdfs/${fileName}`;

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

const recordingsDir = path.join(__dirname, "recordings");

if (!fs.existsSync(recordingsDir)) {
  try {
    fs.mkdirSync(recordingsDir, { recursive: true });
  } catch (err) {
    process.exit(1);
  }
}

try {
  fs.accessSync(recordingsDir, fs.constants.W_OK);
} catch (err) {
  process.exit(1);
}

const checkRecordingStatus = async (recordingId) => {
  try {
    const response = await axios.get(
      `https://api.daily.co/v1/recordings/${recordingId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return (
      response.data.status === "finished" ||
      response.data.status === "completed"
    );
  } catch (error) {
    return false;
  }
};

const getDownloadLink = async (recordingId) => {
  for (let i = 0; i < 5; i++) {
    try {
      const downloadLinkResponse = await axios.get(
        `https://api.daily.co/v1/recordings/${recordingId}/access-link`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      return downloadLinkResponse.data.download_link;
    } catch (error) {
      if (i < 4) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }
  throw new Error(
    `Failed to get download link for recording ${recordingId} after 5 attempts`
  );
};

const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
          return;
        }

        response.pipe(fileStream);

        fileStream.on("error", (err) => {
          fileStream.close();
          reject(err);
        });

        fileStream.on("finish", () => {
          fileStream.close();
          resolve(filePath);
        });
      })
      .on("error", (err) => {
        fileStream.close();
        reject(err);
      });
  });
};

app.get("/api/check-call-and-recording", async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({ error: "API key is not configured" });
  }

  try {
    const sessionsResponse = await axios.get(
      "https://api.daily.co/v1/meetings",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        params: {
          room: "doc-talk",
        },
      }
    );

    const activeSessions = sessionsResponse.data.data.filter(
      (session) => session.ongoing
    );
    const callEnded = activeSessions.length === 0;

    let recordingReady = false;
    let downloadedFilePath = null;
    let processingResult = null;

    if (callEnded) {
      const recordingsResponse = await axios.get(
        "https://api.daily.co/v1/recordings",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          params: {
            room_name: "doc-talk",
            limit: 10,
          },
        }
      );

      const sortedRecordings = recordingsResponse.data.data.sort(
        (a, b) => b.start_ts - a.start_ts
      );
      const latestRecording = sortedRecordings[0];

      if (latestRecording) {
        recordingReady = await checkRecordingStatus(latestRecording.id);
        if (recordingReady) {
          try {
            const downloadLink = await getDownloadLink(latestRecording.id);
            const fileName = `recording_${latestRecording.id}.mp4`;
            const filePath = path.join(recordingsDir, fileName);
            await downloadFile(downloadLink, filePath);
            downloadedFilePath = filePath;

            // Send the file to the Flask server
            console.log("Sending file to Flask server");
            processingResult = await sendFileToFlaskServer(filePath);
          } catch (error) {
            console.error("Error processing audio:", error);
            return res.status(500).json({
              error: "Failed to process audio file",
              details: error.message,
            });
          }
        }
      }
    }

    res.json({
      callEnded,
      recordingReady,
      downloadedFilePath: downloadedFilePath
        ? path.basename(downloadedFilePath)
        : null,
      processingResult,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to check call and recording status",
      details: error.message,
    });
  }
});

async function sendFileToFlaskServer(filePath) {
  const form = new FormData();
  form.append("audio", fs.createReadStream(filePath));

  try {
    const response = await axios.post(
      "http://localhost:5000/process_transcription",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending file to Flask server:", error);
    throw error;
  }
}

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
