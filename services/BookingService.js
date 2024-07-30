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
                    message: `Tour không đủ chỗ!`
                })
            }
            const createdBooking = await Booking.create({ ...newBooking });
            if (!createdBooking) {
                return resolve({
                    status: '400',
                    message: 'Tạo Booking thất bại!',
                })
            }

            resolve({
                status: '200',
                message: 'Tạo Booking thành công!',
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
                    message: 'Không thể tìm thấy đơn đặt trước trong db!',
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
                    message: 'Không thể tìm thấy đơn đặt trước trong db!',
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
                    message: 'Không thể tìm thấy đơn đặt trước trong db!'
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
                    message: 'Không thể tìm thấy đơn đặt trước trong db!'
                });
            }

            const updateBooking = await Booking.findByIdAndUpdate(id, data, { new: true });

            return resolve({
                status: '200',
                message: 'Cập nhật thành công!',
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
                    message: "Không thể tìm thấy đơn đặt trước trong db!"
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
                    message: 'Không thể xóa tour đã đặt!'
                })
            }

            let bookingDelete = await Booking.findByIdAndDelete(id);

            if (bookingDelete === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Không thể tìm thấy và xóa đơn đặt trước trong db!'
                })
            }

            return resolve({
                status: '200',
                message: 'Xóa đơn đặt trước thành công!',
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