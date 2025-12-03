const express = require('express');
const router = express.Router();
const masterAdminController = require('../controllers/masterAdminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all routes with Auth and MasterAdmin role
router.use(authMiddleware, roleMiddleware(['MasterAdmin']));

router.get('/spas', masterAdminController.getAllSpas);
router.post('/spas', masterAdminController.createSpa);
router.get('/bookings', masterAdminController.getAllBookings);
router.get('/sales', masterAdminController.getAllSales);

module.exports = router;
