const express = require('express')
const fs = require('fs')

exports.uploadVideo = (req,res) => {
    res.status(200).send('Video uploaded successfully');
}

exports.streamVideo = (req,res) => {
    // fetching video details
    const videoName = req.params.videoName;
    const path = `uploads/${videoName}`;
    // storing video details
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    // getting video range from request headers
    const range = req.headers.range;

    if(range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        // console.log(start)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);

        // creating a read stream for streaming the video
        fs.createReadStream(path).pipe(res);
    }
}

exports.downloadVideo = (req, res) => {
    const videoName = req.params.videoName;
    const path = `uploads/${videoName}`;
    res.download(path);
}

