// Imports
const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const { createWorker, TesseractWorker } = require("tesseract.js");

const worker = new TesseractWorker();

// Armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");

app.set("view engine", "ejs");

// Rotas
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        worker
          .recognize(data, "eng")
          .progress((progress) => {
            console.log(progress);
          })
          .then((result) => {
            res.send(result.text);
          })
          .finally(() => {
            worker.terminate();
            fs.unlinkSync(`./uploads/${req.file.originalname}`);
          });
      }
    });
  });
});

// Start server
const PORT = 5000 || process.env.PORT;

app.use(express.static("public"));

app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
