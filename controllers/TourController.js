const TourService = require("../services/TourService");

const createTour = async (req, res) => {
    try {
        const { name, price, maxSeat, dateStart, depart, destination, timeTravel } = req.body;

        if (!name || !price || !maxSeat || !dateStart || !depart || !destination || !timeTravel) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await TourService.createTour(req.body);
        return res.status(200).json(response);

    } catch (e) {
        console.log("error", e.message);
        return res.status(400).json({
            err: e.message
        })
    }
}

const getDetailTour = async (req, res) => {
    try {
        const tourId = req.params.id;
        if (!tourId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The tourId is required'
            })
        }
        const response = await TourService.getDetailTour(tourId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getTours = async (req, res) => {
    try {
        const { limit, page, _sort, _order, ...filter } = req.query;
        const response = await TourService.getTours(limit, page, _sort, _order, filter);
        return res.status(200).json(response)

    } catch (error) {
        return res.status(404).json({
            error: error.message
        })
    }
}

const updateTour = async (req, res) => {
    try {
        const tourId = req.params.id;
        const data = req.body;

        if (!tourId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The tourId is required'
            })
        }

        const response = await TourService.updateTour(tourId, data);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const deleteTour = async (req, res) => {
    try {
        const tourId = req.params.id;
        if (!tourId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The tourId is required'
            })
        }

        const response = await TourService.deleteTour(tourId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getUniqueValuesByAttr = async (req, res) => {
    try {
        const attr = req.params.attr;
        const response = await TourService.getUniqueValuesByAttr(attr);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

module.exports = {
    createTour,
    getDetailTour,
    getTours,
    updateTour,
    deleteTour,
    getUniqueValuesByAttr
}
