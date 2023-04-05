const express = require('express');
const multer = require('multer');
require('dotenv').config()
const fs = require('fs');
const morgan = require('morgan');

const { uploadVideo, streamVideo, downloadVideo } = require('./controllers/controllers')

const app = express();

app.use(morgan('tiny'))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('video'),uploadVideo);

app.get('/stream/:videoName', streamVideo);

app.get('/download/:videoName', downloadVideo);

app.listen(process.env.PORT || 3000,() => {
  console.log(`Server running on port ${process.env.PORT||3000}`);
});
