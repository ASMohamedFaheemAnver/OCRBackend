const server = require('http');
const app = require('./backend/app');

const PORT = 3000;
// console.log('OCR RESTAPI UP AND RUNNING!');
server.createServer(app).listen(PORT);