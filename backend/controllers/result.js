const tesseract = require('tesseract.js');
const Result = require('../models/result');
const fs = require('fs');

exports.getResult = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    let imagePath = url + '/tempimg/' + req.file.filename;
    tesseract.recognize(imagePath, 'eng', {logger: m => console.log(m)}).then(({ data: { text } }) => {
        res.json({ message: 'SUCCESS!', image_text: text });
    });
}

exports.postResult = (req, res, next) => {
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
        res.json({message: "SUCCESS!"});
    });
}

exports.getResultsById = (req, res, next) => {
    Result.find({ user_id: req.query.user_id }).then(results => {
        // console.log(results);
        res.json(results);
    });
}

exports.getResultsForMobile = (req, res, next) => {
    Result.find().then(results => {
        // console.log(results);
        res.json(results);
    });
}

exports.deleteResult = (req, res, next) => {
    fs.unlink('backend/images/' + req.params.image_url, (err) => {
        if (err) {
            console.log(err);
        }
        Result.deleteOne({ _id: req.params.id }).then(result => {
            res.status(201).json({ message: 'SUCCESS!' });
        });
    });
}