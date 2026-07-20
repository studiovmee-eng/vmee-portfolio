require("dotenv").config();

console.log("R2_PUBLIC_URL =", process.env.R2_PUBLIC_URL);

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

app.get("/", (req, res) => {
  res.send("VMEE Upload Server Running");
});
app.post("/upload", upload.single("file"), async (req, res) => {

  console.log("===== NEW REQUEST =====");
  console.log("Upload request received");
  console.log("Headers:", req.headers);

  try {

    console.log("After multer");

    if (!req.file) {

      console.log("req.file is missing");

      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });

    }

    console.log("Filename:", req.file.originalname);

    const fileName = `${Date.now()}-${req.file.originalname}`;
const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
});

console.log("Uploading to R2...");

await r2.send(command);

console.log("R2 Upload Complete");

const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

console.log("Generated URL:", fileUrl);

const response = {
  success: true,
  url: fileUrl,
  fileName: fileName
};

console.log("Sending response:", response);

res.json(response);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
const PORT = process.env.PORT || 3000;
app.post("/delete", async (req, res) => {
  console.log("===== DELETE REQUEST =====");
console.log(req.body);
  try {

    const { fileName, fileUrl } = req.body;

    let key = fileName;

    // Fallback for old data
    if (!key && fileUrl) {
      key = decodeURIComponent(fileUrl.split("/").pop());
    }

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "No filename provided"
      });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key
    });

    await r2.send(command);
    console.log("DELETE SUCCESS:", key);

    res.json({
      success: true,
      message: "File deleted successfully"
    });

  } catch (err) {

    console.error("DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});