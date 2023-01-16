const express = require('express');
const http = require('http'),
url = require('url');
const app = express();


http.createServer((req, res) => {
    let reqURL = url.parse(req.url, true);
    if (reqURL.pathname == '/documentation.html') {
        res.writeHead(200, {'Content-Type': 'test/plain'
    });
res.end('Documentation on the bookclub API.\n');
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Welcome to my book club!\n');
    }
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');