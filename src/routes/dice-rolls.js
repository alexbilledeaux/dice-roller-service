const express = require('express');
const dynamoDB = require('../db/dynamoClient');
const MersenneTwister = require('mersenne-twister');
const router = express.Router();

/*
    We are using Mersenne Twister for random number generation.
    From what I can tell, its still a popular algorithm for gaming and simulations.
    It also lets us seed for bug testing purposes.
*/
const generator = new MersenneTwister();

// The API supports keep highest (kh), keep lowest (kl), drop lowest (dl), minimum roll (min), max roll (max), and exploding dice (exp)
const detectModifiers = (rolls, part) => {
    // Rolls should be in ascending order
    rolls.sort((a, b) => a - b);
    switch (true) {
        case part.exploding:
            rolls = rolls.reduce((acc, roll) => {
                acc.push(roll);
                while (roll === part.sides) {
                    roll = Math.floor(generator.random() * part.sides) + 1;
                    acc.push(roll);
                }
                return acc;
            }, []);
            break;

        case part.min !== undefined:
            rolls = rolls.map(roll => Math.max(roll, part.min));
            break;

        case part.max !== undefined:
            rolls = rolls.map(roll => Math.min(roll, part.max));
            break;

        case part.dropLowest !== undefined:
            rolls = rolls.slice(part.dropLowest);
            break;

        case part.dropHighest !== undefined:
            rolls = rolls.slice(0, rolls.length - part.dropHighest);
            break;

        case part.keepHighest !== undefined:
            rolls = rolls.slice(-part.keepHighest);
            break;

        case part.keepLowest !== undefined:
            rolls = rolls.slice(0, part.keepLowest);
            break;
    }

    return rolls;
};


const getRollResults = (notationAsJson) => {
    const rollDie = (sides) => Math.floor(generator.random() * sides) + 1;
    let sum = 0;

    const results = notationAsJson.map(part => {
        if (part.constant !== undefined) {
            sum += part.constant;
            return {
                type: 'constant',
                result: part.constant
            };
        } else {
            let rolls = Array.from({ length: part.count }, () => rollDie(part.sides));
            const allRolls = [...rolls];
            const keptRolls = detectModifiers(rolls, part);

            const total = keptRolls.reduce((acc, roll) => acc + roll, 0) * (part.negative ? -1 : 1);
            sum += total;

            return {
                type: 'dice',
                count: part.count,
                sides: part.sides,
                allRolls,
                keptRolls,
                total
            };
        }
    });

    return { results, sum };
};

const diceNotationToJson = (notation) => {
    return notation.match(/([+-]?\d*d\d+((kh|kl|dl|dh)\d*|(min|max)\d*|exp)?|[+-]?\d+)/g).map(part => {
        if (part.includes('d')) {
            // This is a die, let's get sides, count, and modifiers
            const negative = part.startsWith('-');
            const [countSides, modifier] = part.replace('-', '').split(/(kh|kl|dl|dh|min|max|exp)/);
            const [count, sides] = countSides.split('d').map(Number);
            const result = {
                count: count || 1,
                sides,
                negative
            };

            if (modifier) {
                const value = part.match(/\d+$/);
                const modifierValue = value ? Number(value[0]) : 1;

                if (part.includes('kh')) result.keepHighest = modifierValue;
                else if (part.includes('kl')) result.keepLowest = modifierValue;
                else if (part.includes('dl')) result.dropLowest = modifierValue;
                else if (part.includes('dh')) result.dropHighest = modifierValue;
                else if (part.includes('min')) result.min = modifierValue;
                else if (part.includes('max')) result.max = modifierValue;
                else if (part.includes('exp')) result.exploding = true;
            }

            return result;
        } else {
            return { constant: Number(part) };
        }
    });
};

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
        const { accessToken, verbose } = req.query;

        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required'});
        }

        if (await isTokenValid(accessToken) == false) {
            return res.status(401).json({ message: 'Access token is expired or invalid'});
        }

        const notationAsJson = diceNotationToJson(notation);
        const {results, sum} = getRollResults(notationAsJson);

        if (verbose === 'false') {
            res.json({ sum, notation });
        } else {
            res.json({
                notationAsJson,
                results,
                sum,
                notation
            })
        }
    } catch(error) {
        console.error('Error processing dice roll:', error);
        res.status(500).json({ message: 'Invalid dice notation or request', error: error.message });
    }
});

module.exports = router;