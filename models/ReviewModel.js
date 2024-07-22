const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        reviewId: {
            type: mongoose.Types.ObjectId,
            ref: "TourModel",
        },
        username: {
            type: String,
            required: true,
        },
        reviewText: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
            default: 0,
        },
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
