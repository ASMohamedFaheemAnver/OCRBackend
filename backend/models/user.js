const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_name: {type: String, require: true},
    password: {type: String, require: true}
},{
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);