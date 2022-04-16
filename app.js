// Imports
const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const { createWorker } = require("tesseract.js");
const worker = createWorker({
  logger: (m) => console.log(m),
});

// Armazenamento
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, res, cb) => {
    cb(null, res.file);
  },
});
const upload = multer({ storage: storage }).single("file");

app.set("view engine", "ejs");

// Rotas
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
// app.get("/uploads", (req, res) => {
//   console.log("hey");
// });
