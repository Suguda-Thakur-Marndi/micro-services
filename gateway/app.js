const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const expressProxy = require('express-http-proxy');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const CAPTAIN_SERVICE_URL = process.env.CAPTAIN_SERVICE_URL || 'http://localhost:3002';
const RIDE_SERVICE_URL = process.env.RIDE_SERVICE_URL || 'http://localhost:3003';
const GATEWAY_PORT = process.env.GATEWAY_PORT || 3000;

const usersProxy = expressProxy(USER_SERVICE_URL);
const userProxy = expressProxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/users${req.url}`,
});

const captainsProxy = expressProxy(CAPTAIN_SERVICE_URL);
const captainProxy = expressProxy(CAPTAIN_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/captains${req.url}`,
});

const ridesProxy = expressProxy(RIDE_SERVICE_URL);
const rideProxy = expressProxy(RIDE_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/rides${req.url}`,
});

app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'gateway',
        status: 'ok',
        routes: {
            users: USER_SERVICE_URL,
            captains: CAPTAIN_SERVICE_URL,
            rides: RIDE_SERVICE_URL,
        },
    });
});

app.use('/user', userProxy);
app.use('/users', usersProxy);
app.use('/captain', captainProxy);
app.use('/captains', captainsProxy);
app.use('/ride', rideProxy);
app.use('/rides', ridesProxy);

app.use((req, res) => {
    res.status(404).json({ message: 'Gateway route not found' });
});

app.listen(GATEWAY_PORT, () => {
    console.log(`Gateway is running on port ${GATEWAY_PORT}`);
});