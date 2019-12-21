const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/api/users', (req, res, next) => {

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

router.get('/api/users', (req, res, next) => {
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