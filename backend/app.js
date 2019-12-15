const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);



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
        res.setHeader('Access-Control-Allow-Method',
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
    User.findOne({ user_name: req.body.user_name, password: req.body.password }).then((user) => {
        if (user) {
            return res.status(200).json({ message: "CONGRATULATIONS!", user: user });
            // console.log(user);
        }
        res.status(404).json({ message: "USER NOT FOUND!" });
    });
});

app.get('/', (req, res, next) => {
    res.send('200K, OCR RESTAPI UP AND RUNNING!');
});

module.exports = app;