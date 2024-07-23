const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        photo: { type: String },
        price: { type: Number, require: true },
        discount: { type: Number, default: 0 },
        depart: { type: String, require: true },
        destination: { type: String, require: true },
        maxSeat: {
            type: Number,
        },
        dateStart: { type: [String] },

        transport: {
            type: String,
        },
        timeTravel: {
            type: String,
        },
        desc: {
            introduce: {
                type: String,
            },
            overview: {
                type: String,
            },
            topic: {
                type: String,
            }
        },
        schedule: [
            {
                title: { type: String },
                desc: [
                    { timeOfDate: { type: String }, detail: { type: String } }
                ]
            }
        ],
        rating: { type: Number, default: 0 },
        numRate: { type: Number, default: 0 },
        currentSeat: {
            type: Number,
            default: 0
        },
        availableSeat: {
            type: Number,
        },
        reviews: [
            {
                type: mongoose.Types.ObjectId,
                ref: "ReviewModel",
            },
        ],

    },
    {
        timestamps: true
    }
);

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;