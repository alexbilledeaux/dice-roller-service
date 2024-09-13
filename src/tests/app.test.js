const request = require('supertest');
const server = require('../server');
const dynamoDB = require('../db/dynamoClient');

jest.mock('../db/dynamoClient', () => ({
    storeToken: jest.fn(),
    getToken: jest.fn()
}));

describe('POST /api/access-token', () => {
    it('should create a new access token', async() => {

        dynamoDB.storeToken.mockResolvedValue();

        const response = await request(server).post('/api/access-token/');
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
    });
});

describe('GET /api/dice-rolls/:notation with expired token', () => {
    // Using faked timers to fast forward time in this test
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('should not let you roll if the token has expired', async() => {
        const token = 'test-token';
        const expirationTime = Date.now() + 3 * 60 * 1000;

        dynamoDB.getToken.mockResolvedValue({
            token: token,
            expirationTime: expirationTime,
            valid: true
        });
        // Jumping 4 minutes
        jest.advanceTimersByTime(4 * 60 * 1000);

        const expiredResponse = await request(server)
            .get('/api/dice-rolls/1d20')
            .query({ accessToken: token });

        expect(expiredResponse.statusCode).toBe(401);
    });
})

afterAll(() => {
    server.close();
});