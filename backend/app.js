const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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