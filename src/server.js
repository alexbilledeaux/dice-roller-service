const express = require('express');
const dotenv = require('dotenv');
const diceRollsRoute = require('./routes/dice-rolls');
const accessTokenRoute = require('./routes/access-tokens');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/dice-rolls', diceRollsRoute);
app.use('/api/access-token/', accessTokenRoute);

const PORT = process.env.PORT || 5000;
module.exports = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));