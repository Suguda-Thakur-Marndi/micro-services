const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db/db');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
connectDB();
const express = require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const captainRoutes = require('./routes/Captain.routes');

app.get('/', (req, res) => {
	res.status(200).json({ service: 'captain', status: 'ok' });
});

app.use('/captains', captainRoutes);

app.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

module.exports = app;