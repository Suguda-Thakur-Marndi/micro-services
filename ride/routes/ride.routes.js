const express = require('express');
const rideController = require('../controller/ride.controller');
const rideMiddleware = require('../middleware/middleware');

const router = express.Router();

router.get('/health', rideController.health);
router.post('/create', rideMiddleware.validateCreateRide, rideController.createRide);
router.get('/', rideController.getAllRides);
router.get('/:id', rideMiddleware.validateRideId, rideController.getRideById);
router.patch(
  '/:id/status',
  rideMiddleware.validateRideId,
  rideMiddleware.validateRideStatus,
  rideController.updateRideStatus
);
router.patch('/:id/cancel', rideMiddleware.validateRideId, rideController.cancelRide);

module.exports = router;
