const server = require('http');

server.createServer((req, res, err)=>{
    res.writeHead('200', {'Content-Type': 'text/plain'});
    res.end('Hello World!');
}).listen("3000");