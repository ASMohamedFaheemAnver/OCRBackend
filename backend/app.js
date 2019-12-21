const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const path = require('path');
const Result = require('./models/result');
const tesseract = require('tesseract.js');
const fs = require('fs');
const app = express();
const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

app.use('/images', express.static(path.join('backend/images')));
app.use('/tempimg', express.static(path.join('backend/tempimg')));

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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/ocr-application')
    .then(() => {
        // console.log('Connected to mongoDB!');
    }).catch((err) => {
        console.log('Error occurred : ' + err);
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.post('/api/users', (req, res, next) => {

    User.findOne({ user_name: req.body.user_name }).then((ures) => {
        if (!ures) {
            const user = new User({
                user_name: req.body.user_name,
                password: req.body.password
            });
            user.save();
            // console.log(user);
            return res.status(201).json({
                message: '201K SUCCESS!',
                user: user
            });
        }

        res.status(403).json({ message: "ALREADY A USER EXIST!" });
    });
});

app.get('/api/users', (req, res, next) => {
    // We don't use params!
    // console.log(req.query);
    // https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js
    User.findOne({ user_name: req.query.user_name, password: req.query.password }).then((user) => {
        if (user) {
            return res.status(200).json({ message: "CONGRATULATIONS!", id: user._id });
            // console.log(user);
        }
        res.status(404).json({ message: "USER NOT FOUND!" });
    });
});

app.get('/api/user_id', (req, res, next) => {
    // console.log(req);
    User.findOne({ _id: req.query.user_id }).then(user => {
        if (user) {
            return res.status(200).send({ message: "ONGRATULATIONS!" });
        }
    }, err => {
        return res.status(404).send({ message: '404, NOT FOUND!' });
    });
});

app.delete('/api/users/', (req, res, next) => {
    User.deleteOne({ _id: req.query.id, user_name: req.query.user_name, password: req.query.password }).then(del => {
        if (del.n) {
            return res.status(201).send({ message: '201K, SUCCESS!' })
        }
        res.status(404).send({ message: '404, NOT FOUND!' });
    });
});

app.put('/api/users', (req, res, next) => {
    User.updateOne();
});

app.post('/api/result', multer({ storage: tempstorage }).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    let imagePath = url + '/tempimg/' + req.file.filename;
    tesseract.recognize(imagePath, 'eng').then(({ data: { text } }) => {
        res.json({ message: 'SUCCESS!', image_text: text });
    });
});

app.post('/api/results', multer({ storage: storage }).single('image'), (req, res, next) => {
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

app.get('/api/results', (req, res, next) => {
    Result.find({ user_id: req.query.user_id }).then(results => {
        // console.log(results);
        res.json(results);
    });
});

app.get('/api/image_results', (req, res, next) => {
    Result.find().then(results => {
        // console.log(results);
        res.json(results);
    });
});

app.delete('/api/results/:id/:image_url', (req, res, next) => {
    fs.unlink('backend/images/' + req.params.image_url, (err) => {
        if (err) {
            console.log(err);
        }
        Result.deleteOne({ _id: req.params.id }).then(result => {
            res.status(201).json({ message: 'SUCCESS!' });
        });
    });
});

app.get('/', (req, res, next) => {
    res.send('200K, OCR RESTAPI UP AND RUNNING!');
});

module.exports = app;