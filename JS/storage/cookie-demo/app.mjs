import http from 'http';

const server = http.createServer((req, res) => {
    res.end("Hello Http Server")
})

server.listen(1234);