const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-2',
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const invalidateTokens = async () => {
    // Find all valid tokens
    const scanParams = {
        TableName: 'AccessTokens',
        FilterExpression: 'valid = :v',
        ExpressionAttributeValues: { ':v': true}
    }

    try {
        const validTokens = await dynamoDB.scan(scanParams).promise();
        // Invalidate all valid tokens
        const invalidatePromises = validTokens.Items.map(item => {
            const updateParams = {
                TableName: 'AccessTokens',
                Key: {token: item.token},
                UpdateExpression: 'set valid = :v',
                ExpressionAttributeValues: {':v': false}
            };

            return dynamoDB.update(updateParams).promise();
        });
        await Promise.all(invalidatePromises);
    } catch (error) {
        console.error('Error invalidating Dynamo tokens:', error);
    }
};

const storeToken = async (token, expirationTime) => {
    const params = {
        TableName: 'AccessTokens',
        Item: {
            token: token,
            expirationTime: expirationTime,
            valid: true
        }
    };

    try {
        await invalidateTokens();
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error storing access token in Dynamo:', error);
    }
}

const getToken = async (token) => {
    const params = {
        TableName: 'AccessTokens',
        Key: {
            token: token
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        return result.Item;
    } catch (error) {
        console.error('Error getting access token from Dynamo:', error);
    }
};

module.exports = {dynamoDB, storeToken, getToken};