const BookingService = require("../services/BookingService");

const createBooking = async (req, res) => {
    try {
        const {
            userId, tourId, seat, price, dateStart
        } = req.body;

        if (!userId || !tourId || !seat || !price || !dateStart) {
            res.status(400).json({
                status: "ERR",
                message: "The information provided is not enough"
            })
        }

        const response = await BookingService.createBooking(req.body);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            err: error.message
        })
    }
}

module.exports = {
    createBooking
}