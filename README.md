# dice-roller-service

A simple service for rolling dice

## Using the API

### Authentication

```
/api/access-token/
```

To get an access token from the API, send a POST request to the /api/access-tokens endpoint.

### Making a Roll

```
/api/dice-rolls/1d20/?accessToken=example
```

To make a dice roll, send a GET request to the /api/dice-rolls/:notation endpoint. Your request must include a valid access token.

**Dice Notation**

The endpoint uses dice notation in the format of [number of dice][d][number of sides] (e.g. 2d6). You may also add or subtract constants from the total (e.g. 2d6 + 4).

## Running the API locally

If you want to run the API locally, there are two steps.

**Set up a DynamoDB table**

Go to [AWS ](https://aws.amazon.com/)and create a DynamoDB table named `AccessTokens`. It must have the partition key of `token`

**Set up a .env file**

Add the following environmental variables to a .env located at the root of the project. The AWS profile you use must have access to your Dynamo table.

AWS_REGION='example'

AWS_ACCESS_KEY_ID='example'

AWS_SECRET_ACCESS_KEY='example'
