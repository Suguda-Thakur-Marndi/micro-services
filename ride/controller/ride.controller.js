const Ride = require('../model/ride.model');
const { publishMessage } = require('../rabbit');

module.exports.health = async (req, res) => {
  return res.status(200).json({
    service: 'ride',
    status: 'ok',
    message: 'Ride controller is working',
  });
};

module.exports.createRide = async (req, res) => {
  try {
    const { pickup, destination, fare } = req.body;

    const ride = await Ride.create({
      pickup,
      destination,
      fare: fare ?? 0,
    });

    // Emit event for downstream services (captain matching, notifications, etc.).
    await publishMessage('new-ride', {
      rideId: ride._id,
      pickup: ride.pickup,
      destination: ride.destination,
      fare: ride.fare,
      status: ride.status,
      createdAt: ride.createdAt,
    });

    return res.status(201).json({
      message: 'Ride created successfully',
      ride,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    return res.status(200).json({ rides });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    return res.status(200).json({ ride });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    return res.status(200).json({
      message: 'Ride status updated successfully',
      ride,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true, runValidators: true }
    );

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    return res.status(200).json({
      message: 'Ride cancelled successfully',
      ride,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
