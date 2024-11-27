import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import poll from "./routes/uploadRoute.js";
import { s3Client } from "./config/awsConfig.js";
import fs from "fs";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import db from "./db/firebaseconfig.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get the __dirname equivalent
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// all videos data
app.get("/videos", async (req, res) => {
  try {
    const videosSnapshot = await db.collection("video-metadata").get();
    const videos = [];
    //console.log(videosSnapshot);

    videosSnapshot.forEach((doc) => {
      videos.push({ key: doc.id, ...doc.data() });
    });

    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).send("Error fetching videos");
  }
});

// specific video data
app.get("/video/:key/data", async (req, res) => {
  const key = req.params.key;
  try {
    const videoDoc = await db.collection("video-metadata").doc(key).get();

    if (!videoDoc.exists) {
      return res.status(404).send("Video not found");
    }
    console.log(videoDoc.data());
    res.json(videoDoc.data());
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).send("Error fetching video");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets/tempvids/");
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("vids"), async (req, res) => {
  const file = req.file;
  const { title, description } = req.body;

  if (!file || !title || !description) {
    return res.status(400).send("Missing required fields.");
  }

  const baseDir = `video-id-${uuidv4()}`;

  try {
    const cmd = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: file.filename,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
      Metadata: {
        "transcoded-basedir": baseDir,
      },
    });

    await s3Client.send(cmd);
    console.log("File succesfully uploaded to S3");

    // Save metadata to Firestore
    const videoRecord = {
      title,
      description,
      transcodedKey: baseDir,
      likes: 0,
      comments: 0,
    };

    const docRef = db.collection("video-metadata").doc(baseDir);

    await docRef.set(videoRecord);

    // now deleting it from the server

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting file from server:", err);
      } else {
        console.log("File deleted from server.");
      }
    });

    res.status(200).send("Uploaded Successfully to S3");
  } catch (error) {
    console.error(error);

    // in case of error, delete the unncessary video
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting file from server:", err);
      } else {
        console.log("File deleted from server.");
      }
    });

    return res.status(500).send("Error uploading file");
  }
});

poll();
app.listen(4000, () => {
  console.log("Listening on port 4000");
});
