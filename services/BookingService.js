const dotenv = require('dotenv');
const Booking = require("../models/BookingModel");
const Tour = require('../models/TourModel');

dotenv.config();

const createBooking = (newBooking) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tourData = await Tour.findOneAndUpdate(
                {
                    _id: newBooking.tourId,
                    availableSeat: { $gte: newBooking.seat.totalSeat }
                },
                {
                    $inc: {
                        availableSeat: -newBooking.seat.totalSeat,
                        currentSeat: +newBooking.seat.totalSeat
                    }
                },
                { new: true }
            )

            if (!tourData) {
                resolve({
                    status: 'ERR',
                    message: `Tour khong du cho`
                })
            } else {
                const createdBooking = await Booking.create({ ...newBooking });
                if (createdBooking) {
                    resolve({
                        status: '200',
                        message: 'Create Booking success',
                        data: createdBooking
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createBooking
}