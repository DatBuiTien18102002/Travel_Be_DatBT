const BookingService = require("../services/BookingService");

const createBooking = async (req, res) => {
    try {
        const {
            userInfo, tourInfo, seat, price, dateStart
        } = req.body;

        if (!userInfo || !tourInfo || !seat || !price || !dateStart) {
            return res.status(400).json({
                status: "ERR",
                message: "Thông tin cung cấp không đủ!"
            })
        }

        const response = await BookingService.createBooking(req.body);

        return res.status(200).json(response);
    } catch (error) {
        console.log("error", error.message);
        return res.status(404).json({
            err: error.message
        })
    }
}

const getAllBookingsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Cần cung cấp UserId!'
            })
        }
        const response = await BookingService.getAllBookingsByUserId(userId);
        return res.status(200).json(response);

    } catch (e) {
        console.log(e.message);
        return res.status(404).json({
            err: e.message
        })
    }
}

const getAllBookings = async (req, res) => {
    try {
        const response = await BookingService.getAllBookings();
        return res.status(200).json(response);

    } catch (e) {
        console.log(e.message);
        return res.status(404).json({
            err: e.message
        })
    }
}

const getBookingDetail = async (req, res) => {
    try {
        const bookingId = req.params.id;
        if (!bookingId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Cần cung cấp Id Booking!'
            })
        }
        const response = await BookingService.getBookingDetail(bookingId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const data = req.body;

        if (!bookingId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Cần cung cấp Id Booking!'
            })
        }

        const response = await BookingService.updateBooking(bookingId, data);
        return res.status(200).json(response);

    } catch (e) {
        console.log(e.message);
        return res.status(404).json({
            err: e.message
        })
    }
}

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        if (!bookingId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Cần cung cấp Id Booking!'
            })
        }

        const response = await BookingService.deleteBooking(bookingId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

module.exports = {
    createBooking,
    getAllBookingsByUserId,
    getBookingDetail,
    getAllBookings,
    updateBooking,
    deleteBooking,
}