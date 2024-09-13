const express = require('express');
const crypto = require('crypto');
const dynamoDB = require('../db/dynamoClient');
const router = express.Router();

// Using the Node crypto module to create cryptographically secure access tokens
const createAccessToken = async () => {
    const token = crypto.randomBytes(32).toString('hex');
    // Set token to expire in 3 minutes
    const expirationTime = Date.now() + 3 * 60 * 1000;
    await dynamoDB.storeToken(token, expirationTime);
    return (token);
}

/*
    POST endpoint for requesting access tokens
    Tokens expire after 3 minutes or anytime a new token is requested
*/
router.post('/', async(req, res) => {
    try {
        const accessToken = await createAccessToken();
        res.json({ accessToken });
    } catch(error) {
        console.error('Error creating an access token:', error);
        res.status(500).json({ message: 'Error creating an access token', error: error.message });
    }
});

module.exports = router;