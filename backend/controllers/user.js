const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
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
}

exports.loginUser = (req, res, next) => {
    // console.log(req.query);
    // We don't use params!
    // console.log(req.query);
    // https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js
    if(!(req.query.user_name&&req.query.password)){
        return res.status(401).json({
            message: 'AUTH FAILED!'
        });
    }
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
}