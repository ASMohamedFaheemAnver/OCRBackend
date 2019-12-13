const express = require('express');

const app = express();

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