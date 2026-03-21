const mongoose = require('mongoose');

const allowedStatuses = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'];

module.exports.validateCreateRide = (req, res, next) => {
  const { pickup, destination, fare } = req.body;

  if (!pickup || !destination) {
    return res.status(400).json({ message: 'pickup and destination are required' });
  }

  if (fare !== undefined && (typeof fare !== 'number' || Number.isNaN(fare) || fare < 0)) {
    return res.status(400).json({ message: 'fare must be a non-negative number' });
  }

  return next();
};

module.exports.validateRideId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ride id' });
  }

  return next();
};

module.exports.validateRideStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'status is required' });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
    });
  }

  return next();
};
