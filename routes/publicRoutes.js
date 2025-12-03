const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/services', publicController.getServices);
router.get('/services/:slug', publicController.getServicesBySlug);
router.post('/bookings', publicController.createBooking);

module.exports = router;
