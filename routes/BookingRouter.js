const express = require("express");
const router = express.Router();

const bookingController = require('../controllers/BookingController');
const { authUserMiddleware, authAdminMiddleware } = require("../middleware/authMiddeware");

router.post("/create/:id", authUserMiddleware, bookingController.createBooking);

module.exports = router;