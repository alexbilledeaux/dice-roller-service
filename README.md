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
/api/dice-rolls/1d20+5/?accessToken=example&verbose=true
```

To make a dice roll, send a GET request to the /api/dice-rolls/:notation endpoint. Your request must include a valid access token. You may set the query parameter verbose to false, if you only need the sum of the roll.

#### Dice Notation

The endpoint uses dice notation in the format of [number of dice][d][number of sides] (e.g. 2d6). You may also add or subtract constants from the total (e.g. 2d6 + 4).

You can make complex rolls by using my additional flags:

**Keep highest (kh[x]):** Keeps *x* highest dice.

Example notation: `2d20kh + 1d6 + 4`

**keep lowest (kl[x]):** Keeps *x* lowest dice

Example notation: `2d20kl + 10`

**drop lowest (dl):** Keeps only the lowest die

Example notation: `2d6kl`

**minimum roll (min[x]):** The roll will never result in a roll below *x*.

Example notation: `1d20min10`

**max roll (max[x]):** The roll will never result in a roll above *x*.

Example notation: `1d20max15`

**exploding dice (exp):** If any die gets its maximum value, the system will roll an additional die

Example notation: `5d10exp`

#### Subscribing to Dice Rolls

The API broadcasts dice rolls via socket.io. In order to recieve incoming dice roll events, it is recomended that you use the `socket.io-client` npm package in your project. Any time a user successfully rolls dice, you'll recieve an event on the `diceRoll `socket. This event will include the timestamp, sum, individual roll results, and the roll notation.

## Running the API locally

If you want to run the API locally, there are two steps.

**Set up a DynamoDB table**

Go to [AWS ](https://aws.amazon.com/)and create a DynamoDB table named `AccessTokens`. It must have the partition key of `token`

**Set up a .env file**

Add the following environmental variables to a .env located at the root of the project. The AWS profile you use must have access to your Dynamo table.

AWS_REGION='example'

AWS_ACCESS_KEY_ID='example'

AWS_SECRET_ACCESS_KEY='example'

## Testing the API

To see test coverage and run unit tests on the API, run the following command at the project root:

```
npm test
```
