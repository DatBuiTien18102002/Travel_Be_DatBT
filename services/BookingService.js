const dotenv = require('dotenv');
const Booking = require("../models/BookingModel");
const Tour = require('../models/TourModel');
const User = require('../models/UserModel');

dotenv.config();

const createBooking = (newBooking) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tourData = await Tour.findOneAndUpdate(
                {
                    _id: newBooking.tourInfo,
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
                return resolve({
                    status: 'ERR',
                    message: `Tour khong du cho`
                })
            }
            const createdBooking = await Booking.create({ ...newBooking });
            if (!createdBooking) {
                return resolve({
                    status: '400',
                    message: 'Create Booking failed',
                })
            }

            resolve({
                status: '200',
                message: 'Create Booking success',
                data: createdBooking
            })

        } catch (e) {
            console.log("error", e);
            reject(e)
        }


    })
}

const getAllBookingsByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const bookings = await Booking.find({ userInfo: id }).populate({
                path: "tourInfo",
                model: Tour,
                select: "name price discount _id "
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (bookings === null) {
                return resolve({
                    status: 'Err',
                    message: 'Can not find the booking in db',
                })
            }

            return resolve({
                status: '200',
                message: 'Success',
                data: bookings
            })
        } catch (error) {
            reject(error);
        }
    })
}

const getAllBookings = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const bookings = await Booking.find().populate([{
                path: "tourInfo",
                model: Tour,
                select: "name"
            }, {
                path: "userInfo",
                model: User,
                select: "email phone"
            }]).sort({ createdAt: -1, updatedAt: -1 })
            if (bookings === null) {
                return resolve({
                    status: 'Err',
                    message: 'Can not find the booking in db',
                })
            }

            return resolve({
                status: '200',
                message: 'Success',
                data: bookings
            })
        } catch (error) {
            reject(error);
        }
    })
}

const getBookingDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const booking = await Booking.findById({ _id: id })
            if (booking === null) {
                resolve({
                    status: 'Err',
                    message: 'Can not find the booking in db',
                })
            }

            resolve({
                status: '200',
                message: 'Success',
                data: booking
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateBooking = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBooking = await Booking.findOne({ _id: id })
            if (!checkBooking) {
                return resolve({
                    status: '404',
                    message: 'The booking is not found'
                });
            }

            const updateBooking = await Booking.findByIdAndUpdate(id, data, { new: true });

            return resolve({
                status: '200',
                message: 'Success',
                data: updateBooking
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBooking = await Booking.findOne({ _id: id })
            if (!checkBooking) {
                return resolve({
                    status: '404',
                    message: "Booking's not founded"
                });
            }

            const tourData = await Tour.findOneAndUpdate(
                {
                    _id: checkBooking.tourInfo.toString(),
                    currentSeat: { $gte: checkBooking.seat.totalSeat }
                },
                {
                    $inc: {
                        availableSeat: +checkBooking.seat.totalSeat,
                        currentSeat: -checkBooking.seat.totalSeat
                    }
                },
                { new: true }
            )

            if (!tourData) {
                return resolve({
                    status: 'ERR',
                    message: 'Can not cancel booking tour'
                })
            }

            let bookingDelete = await Booking.findByIdAndDelete(id);

            if (bookingDelete === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Can not find and cancel booking tour'
                })
            }

            return resolve({
                status: '200',
                message: 'Cancel booking tour success',
            })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createBooking,
    getAllBookingsByUserId,
    getBookingDetail,
    getAllBookings,
    updateBooking,
    deleteBooking,
}