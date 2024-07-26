const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        userInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tourInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tour",
            required: true,
        },
        seat:
        {
            adultSeat: { type: Number },
            childSeat: { type: Number },
            babySeat: { type: Number },
            totalSeat: { type: Number },
        },
        price: {
            type: Number
        },
        dateStart: {
            type: String,
        },
        isRating: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: "waiting_confirm"
        },
        paidAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
