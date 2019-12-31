const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/api/users', (req, res, next) => {
    User.findOne({ user_name: req.body.user_name }).then((ures) => {
        if (!ures) {
            return bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    user_name: req.body.user_name,
                    password: hash
                });
                user.save().then(res0=>{
                    return res.status(201).json({
                        message: '201K SUCCESS!',
                        user: res0
                    });
                });
                // console.log(user);
            }).catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
        }
        res.status(403).json({ message: "ALREADY A USER EXIST!" });
    });
});

router.get('/api/users', (req, res, next) => {
    // console.log(req.query);
    // We don't use params!
    // console.log(req.query);
    // https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js
    let oUser;
    User.findOne({ user_name: req.query.user_name }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "USER NOT FOUND!" });
            // console.log(user);
        }

        oUser = user;
        return bcrypt.compare(req.query.password, user.password);
    }).then(res0 => {
        if (!res0) {
            return res.status(401).json({
                message: 'AUTH FAILED!'
            });
        }
        const token = jwt.sign({ email: oUser.email, userId: oUser._id },
            'i_type_rifa_to_secure_my_token',
            { expiresIn: '1h' });
            // console.log(token);
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            id: oUser._id
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });;
});

router.get('/api/user_id', (req, res, next) => {
    // console.log(req);
    User.findOne({ _id: req.query.user_id }).then(user => {
        if (user) {
            return res.status(200).send({ message: "ONGRATULATIONS!" });
        }
    }, err => {
        return res.status(404).send({ message: '404, NOT FOUND!' });
    });
});

router.delete('/api/users/', (req, res, next) => {
    User.deleteOne({ _id: req.query.id, user_name: req.query.user_name, password: req.query.password }).then(del => {
        if (del.n) {
            return res.status(201).send({ message: '201K, SUCCESS!' })
        }
        res.status(404).send({ message: '404, NOT FOUND!' });
    });
});

router.put('/api/users', (req, res, next) => {
    User.updateOne();
});

module.exports = router;