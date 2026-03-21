const mongoose = require('mongoose');

function connectDB() {
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI is not set. Skipping database connection.');
    return;
  }

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Ride service connected to MongoDB');
    })
    .catch((error) => {
      console.error('Ride DB connection error:', error.message);
    });
}

module.exports = connectDB;
