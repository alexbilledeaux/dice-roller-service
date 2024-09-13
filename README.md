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
