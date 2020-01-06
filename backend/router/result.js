const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ResultController = require('../controllers/result');

const extractFile = require('../middleware/file');
const extractTempFile = require('../middleware/temp_file');

router.post('/api/result',
    extractTempFile,
    ResultController.getResult);

router.post('/api/results',
    extractFile,
    ResultController.postResult);

router.get('/api/results',
    checkAuth,
    ResultController.getResultsById);

router.get('/api/image_results',
    ResultController.getResultsForMobile);

router.delete('/api/results/:id/:image_url',
    checkAuth,
    ResultController.deleteResult);

module.exports = router;