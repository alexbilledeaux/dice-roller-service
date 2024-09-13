const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const diceRollsRoute = require('./routes/dice-rolls');
const accessTokenRoute = require('./routes/access-tokens');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

app.use('/api/dice-rolls', diceRollsRoute(io));
app.use('/api/access-token/', accessTokenRoute);

io.on('connection', (socket) => {
    console.log('A new client is watching for dice rolls.');
    socket.on('disconnect', () => {
        console.log('A client has stopped watching for dice rolls.');
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;