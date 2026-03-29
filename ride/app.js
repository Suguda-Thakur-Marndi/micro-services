const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const connectDB = require('./db/db');
const rideRoutes = require('./routes/ride.routes');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).json({
		service: 'ride',
		status: 'ok',
		message: 'Ride service is running',
	});
});

app.use('/rides', rideRoutes);

app.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
