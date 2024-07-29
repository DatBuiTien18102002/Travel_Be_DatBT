const express = require("express");
const router = express.Router();

const bookingController = require('../controllers/BookingController');
const { authUserMiddleware, authAdminMiddleware } = require("../middleware/authMiddeware");

router.post("/create", authUserMiddleware, bookingController.createBooking);
router.get('/bookings-user/:id', authUserMiddleware, bookingController.getAllBookingsByUserId);
router.get('/booking-detail/:id', bookingController.getBookingDetail);
router.get('/bookings-all', authUserMiddleware, bookingController.getAllBookings);
router.put('/update/:id', authUserMiddleware, bookingController.updateBooking);
router.delete('/delete/:id', bookingController.deleteBooking);

module.exports = router;