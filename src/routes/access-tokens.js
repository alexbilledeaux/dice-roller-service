const express = require('express');

const router = express.Router();

/*
    POST endpoint for requesting access tokens
    Tokens expire after 3 minutes or anytime a new token is requested
*/
router.post('/', async(req, res) => {
    try {
        console.log('Creating new access token')
        res.status(200).json({ message: 'Valid request' });
    } catch(error) {
        console.error('Error creating an access token:', error);
        res.status(500).json({ message: 'Error creating an access token', error: error.message });
    }
});

module.exports = router;