const dotenv = require("dotenv");
const Review = require("../models/ReviewModel");
const Tour = require("../models/TourModel");

dotenv.config();

const createReview = (newReview) => {
    return new Promise(async (resolve, reject) => {
        try {
            const review = await Review.create({
                ...newReview
            })

            if (review) {
                return resolve({
                    status: '200',
                    message: 'Tạo đánh giấ thành công!',
                    data: review
                })
            } else {
                return resolve({
                    status: '400',
                    message: 'Tạo đánh giá thất bại!',
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createReview
}