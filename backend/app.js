const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

app.get('/api/users', (req, res, next)=>{
    let users = [
        {
            id: 1,
            user_name: 'jstrfaheem065@gmail.come',
            password: '*74362@?'
        }
    ];
    res.json(users);
});

app.get('/', (req, res, next)=>{
    res.send('200K, OCR RESTAPI UP AND RUNNING!');
});

module.exports = app;