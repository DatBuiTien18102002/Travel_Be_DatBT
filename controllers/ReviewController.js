const ReviewService = require("../services/ReviewService");

const createReview = async (req, res) => {
    try {
        const response = await ReviewService.createReview(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        return res.status(404).json({
            err: e.message
        })
    }
}

module.exports = {
    createReview
}