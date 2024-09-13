const express = require('express');
const dynamoDB = require('../db/dynamoClient');
const router = express.Router();

const isTokenValid = async (token) => {
    const storedToken = await dynamoDB.getToken(token);
    if (!storedToken || !storedToken.valid || storedToken.expirationTime < Date.now()) {
        return false;
    }
    return true;
}

/*
    GET endpoint for submitting dice rolls
    Rolls are submitted in dice notation (e.g. 1d20+5)
*/
router.get('/:notation', async(req, res) => {
    try {
        const { notation } = req.params;
        const { accessToken } = req.query;

        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required'});
        }

        if (await isTokenValid(accessToken) == false) {
            return res.status(401).json({ message: 'Access token is expired or invalid'});
        }

        console.log('Rolling dice...')
        res.status(200).json({ message: 'Valid request' });
    } catch(error) {
        console.error('Error processing dice roll:', error);
        res.status(500).json({ message: 'Invalid dice notation or request', error: error.message });
    }
});

module.exports = router;