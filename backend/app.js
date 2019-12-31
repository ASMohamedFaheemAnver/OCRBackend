const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const userRoutes = require('./router/user');
const resultRoutes = require('./router/result');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

app.use('/images', express.static(path.join('backend/images')));
app.use('/tempimg', express.static(path.join('backend/tempimg')));

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
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.use(userRoutes);
app.use(resultRoutes);



app.get('/', (req, res, next) => {
    res.send('200K, OCR RESTAPI UP AND RUNNING!');
});

module.exports = app;