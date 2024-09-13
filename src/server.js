const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const diceRollsRoute = require('./routes/dice-rolls');
const accessTokenRoute = require('./routes/access-tokens');

dotenv.config();
const app = express();
app.use(express.json());

const server = http.createServer(app);

app.use('/api/dice-rolls', diceRollsRoute);
app.use('/api/access-token/', accessTokenRoute);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;