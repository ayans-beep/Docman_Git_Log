const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 8000;
const HOST = "0.0.0.0";

// Z drive location
const BASE_DIR = "D:\\DOCMAN_LOGS";
const AYAN_DIR = path.join(BASE_DIR, "ayan");
const TEST_FILE = path.join(AYAN_DIR, "test.txt");

// Middleware
app.use(express.json());

// Create required folders
function ensureDirectory() {
  if (!fs.existsSync(AYAN_DIR)) {
    fs.mkdirSync(AYAN_DIR, {
      recursive: true,
    });

    console.log(`Created folder: ${AYAN_DIR}`);
  }
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Docman Test Server is running",
  });
});

// Receive data from VM
app.post("/log", (req, res) => {
  try {
    const data = req.body;

    // Make sure folder exists
    ensureDirectory();

    // Convert received data to readable JSON
    const logData = JSON.stringify(data, null, 2);

    // Add timestamp
    const timestamp = new Date().toISOString();

    const finalData =
      `==============================\n` +
      `Timestamp: ${timestamp}\n` +
      `==============================\n` +
      `${logData}\n\n`;

    // Append data to test.txt
    fs.appendFileSync(TEST_FILE, finalData, "utf8");

    console.log("Data saved successfully");

    res.status(200).json({
      success: true,
      message: "Data saved successfully",
      file: TEST_FILE,
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save data",
      error: error.message,
    });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
ensureDirectory();

app.listen(PORT, HOST, () => {
  console.log("----------------------------------");
  console.log("Docman Test Server Started");
  console.log("----------------------------------");

  console.log(`Server: http://${HOST}:${PORT}`);
  console.log(`Log folder: ${AYAN_DIR}`);
  console.log(`Log file: ${TEST_FILE}`);
});
