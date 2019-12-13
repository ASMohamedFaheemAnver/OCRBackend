const server = require('http');
const app = require('./backend/app');

console.log('OCR RESTAPI UP AND RUNNING!');
server.createServer(app).listen("3000");