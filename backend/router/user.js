const express = require('express');
const router = express.Router();
const User = require('../models/user');
const UserController = require('../controllers/user');

router.post('/api/users', UserController.createUser);

router.get('/api/users', UserController.loginUser);

router.get('/api/user_id', (req, res, next) => {
    // console.log(req);
    User.findOne({ _id: req.query.user_id }).then(user => {
        if (user) {
            return res.status(200).send({ message: "CONGRATULATIONS!" });
        }
    }, err => {
        return res.status(404).send({ message: '404, NOT FOUND!' });
    });
});

// router.delete('/api/users/', (req, res, next) => {
//     User.deleteOne({ _id: req.query.id, user_name: req.query.user_name, password: req.query.password }).then(del => {
//         if (del.n) {
//             return res.status(201).send({ message: '201K, SUCCESS!' })
//         }
//         res.status(404).send({ message: '404, NOT FOUND!' });
//     });
// });

// router.put('/api/users', (req, res, next) => {
//     User.updateOne();
// });

module.exports = router;