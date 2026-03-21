const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
