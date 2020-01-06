const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const tempstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = null;
        if (!isValid) {
            error = 'INVALID FILE TYPE!';
        }

        cb(error, 'backend/tempimg');
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, 'tempimg.' + ext);
    }
});

module.exports = multer({ storage: tempstorage }).single('image');