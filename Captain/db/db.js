const mongoose = require('mongoose');
function connect() {
    if (!process.env.MONGO_URI) {
        console.log('MONGO_URI is not set. Skipping database connection.');
        return;
    }

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB', err);
        });
}
module.exports = connect;