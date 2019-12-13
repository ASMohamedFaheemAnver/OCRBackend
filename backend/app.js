const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb://localhost:27017/ocr-application')
.then(()=>{
    console.log('Connected to mongoDB!');
}).catch((err)=>{
    console.log('Error occurred : ' + err);
});

app.post('/api/users', (req, res, next)=>{
    const user = new User({
        user_name: req.body.user_name,
        password: req.body.password
    });
    user.save();
    console.log(user);
    res.status(201).json({
        message: '201K SUCCESS!'
    });
});

app.get('/api/users', (req, res, next)=>{
    User.find().then((users)=>{
        res.json(users);
        console.log(users);
    });
});

app.get('/', (req, res, next)=>{
    res.send('200K, OCR RESTAPI UP AND RUNNING!');
});

module.exports = app;