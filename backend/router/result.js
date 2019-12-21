const express = require('express');
const router = express.Router();
const Result = require('../models/result');
const tesseract = require('tesseract.js');
const fs = require('fs');
const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = null;
        if (!isValid) {
            error = 'INVALID FILE TYPE!';
        }

        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        let name = file.originalname.toLowerCase().split(' ').join('-');
        name = name.substring(0, name.indexOf('.'));
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

const tempstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = null;
        if (!isValid) {
            error = 'INVALID FILE TYPE!';
        }

        cb(error, 'backend/tempimg');
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, 'tempimg.' + ext);
    }
});

router.post('/api/result', multer({ storage: tempstorage }).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    let imagePath = url + '/tempimg/' + req.file.filename;
    tesseract.recognize(imagePath, 'eng').then(({ data: { text } }) => {
        res.json({ message: 'SUCCESS!', image_text: text });
    });
});

router.post('/api/results', multer({ storage: storage }).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    // console.log(req.body.result);
    let imagePath = url + '/images/' + req.file.filename;
    // console.log(imagePath);
    // tesseract.recognize(imagePath, 'eng').then(({data : {text}})=>{
    //     console.log(text);
    // });
    const result = new Result({
        image_path: imagePath,
        image_text: req.body.result,
        user_id: req.body.user_id
    });
    result.save().then(result => {
        res.json({});
    });
});

router.get('/api/results', (req, res, next) => {
    Result.find({ user_id: req.query.user_id }).then(results => {
        // console.log(results);
        res.json(results);
    });
});

router.get('/api/image_results', (req, res, next) => {
    Result.find().then(results => {
        // console.log(results);
        res.json(results);
    });
});

router.delete('/api/results/:id/:image_url', (req, res, next) => {
    fs.unlink('backend/images/' + req.params.image_url, (err) => {
        if (err) {
            console.log(err);
        }
        Result.deleteOne({ _id: req.params.id }).then(result => {
            res.status(201).json({ message: 'SUCCESS!' });
        });
    });
});

module.exports = router;