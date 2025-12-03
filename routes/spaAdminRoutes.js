const express = require('express');
const router = express.Router();
const spaAdminController = require('../controllers/spaAdminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all routes with Auth and Admin role
router.use(authMiddleware, roleMiddleware(['Admin', 'SpaOwner']));

router.get('/dashboard', spaAdminController.getDashboardStats);
router.get('/bookings', spaAdminController.getBookings);
router.put('/bookings/:id/status', spaAdminController.updateBookingStatus);
router.delete('/bookings/:id', spaAdminController.deleteBooking);
router.get('/services', spaAdminController.getServices);
router.post('/services', spaAdminController.createService);
router.get('/sales', spaAdminController.getSales);

module.exports = router;

