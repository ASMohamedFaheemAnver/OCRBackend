const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    image_path: {type: String, require: true},
    image_text: {type: String, require: true},
    user_id: {type: String, require: true}
},{
    versionKey: false
});

module.exports = mongoose.model('Result', resultSchema);