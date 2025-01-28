const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 5003;



const OUTPUT_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// Ensure Homebrew and yt-dlp are installed
function checkAndInstallDependencies() {
  exec("brew --version", (err) => {
    if (err) {
      console.log("Homebrew not found. Installing...");
      exec('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', (err) => {
        if (!err) installYtDlp();
        else console.error("Error installing Homebrew:", err);
      });
    } else {
      console.log("Homebrew is already installed.");
      installYtDlp();
    }
  });
}

function installYtDlp() {
  exec("yt-dlp --version", (err) => {
    if (err) {
      console.log("yt-dlp not found. Installing...");
      exec("brew install yt-dlp", (err) => {
        if (!err) console.log("yt-dlp installed successfully.");
        else console.error("Error installing yt-dlp:", err);
      });
    } else {
      console.log("yt-dlp is already installed.");
    }
  });
}
checkAndInstallDependencies();

// Video download route
app.post("/download", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send({ error: "YouTube URL is required." });

  const outputFile = path.join(OUTPUT_DIR, `video_${Date.now()}.mp4`);
  const command = `yt-dlp -o "${outputFile}" "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Error downloading video:", stderr);
      return res.status(500).send({ error: "Failed to download video." });
    }

    res.download(outputFile, "video.mp4", (err) => {
      if (err) console.error("Error sending file:", err);
      fs.unlinkSync(outputFile); // Clean up file
    });
  });
});



app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
