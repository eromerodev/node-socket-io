const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let accountBalance = 100; // Example starting balance

app.use('/socket.io', express.static('node_modules/socket.io/client-dist'));
app.get('/', (req, res) => res.sendFile(__dirname + '/client.html'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('balance.update', accountBalance);

    const interval = setInterval(() => {
        accountBalance += Math.floor(Math.random() * 10) - 5;
        io.emit('balance.update', accountBalance);
    }, 3000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

server.listen(4000, () => {
    console.log('Listening on port 4000');
});
