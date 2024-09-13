const express = require('express');

const router = express.Router();

/*
    GET endpoint for submitting dice rolls
    Rolls are submitted in dice notation (e.g. 1d20+5)
*/
router.get('/:notation', async(req, res) => {
    try {
        console.log('Rolling dice...')
        res.status(200).json({ message: 'Valid request' });
    } catch(error) {
        console.error('Error processing dice roll:', error);
        res.status(500).json({ message: 'Invalid dice notation or request', error: error.message });
    }
});

module.exports = router;