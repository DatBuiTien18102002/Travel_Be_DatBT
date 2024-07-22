const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { generalAccessToken, generalRefreshToken } = require("./jwtService");
const Tour = require("../models/TourModel");

dotenv.config();

const createTour = (newTour) => {
    const { name } = newTour;
    return new Promise(async (resolve, reject) => {
        try {
            const checkTour = await Tour.findOne({
                name: name
            })
            let createTour;

            if (checkTour) {
                resolve({
                    status: '400',
                    message: 'The name tour is already exists'
                });
            } else {
                createTour = await Tour.create({
                    ...newTour
                })
            }

            if (createTour) {
                resolve({
                    status: '200',
                    message: 'Create tour success',
                    data: createTour
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailTour = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailTour = await Tour.findOne({ _id: id })

            resolve({
                status: '200',
                message: 'Get detail tour success',
                data: detailTour
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getTours = (limit = 0, page = 1, _sort = "", _order = "", filter = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (filter.name) {
                filter = {
                    ...filter,
                    name: { '$regex': `${filter.name}`, '$options': 'i' }
                }
            }

            const totalTour = (await Tour.find(filter)).length;
            const tourSkip = (page - 1) * limit;
            let totalPage = 1;
            if (limit) {
                totalPage = Math.ceil(totalTour / limit);
            }

            if (!_sort || !_order) {
                const allTour = await Tour.find(filter).limit(limit).skip(tourSkip);
                resolve({
                    status: "200",
                    message: "Get all tour success",
                    currentPage: +page,
                    totalTour: totalTour,
                    totalPage: totalPage,
                    data: allTour,
                })
            } else if (_sort || _order) {
                const allTour = await Tour.find(filter).limit(limit).skip(tourSkip).sort({
                    [_sort]: _order
                }).collation({ locale: 'vi', strength: 2 });
                resolve({
                    status: '200',
                    message: 'Get all tour success',
                    currentPage: +page,
                    totalTour: totalTour,
                    totalPage: totalPage,
                    data: allTour
                })
            } else {
                reject({
                    status: '400',
                    message: 'You need to provide both _sort and _order',
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateTour = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkTour = await Tour.findOne({ _id: id })
            if (!checkTour) {
                resolve({
                    status: '404',
                    message: 'The tour is not found'
                });
            }

            const updateTour = await Tour.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: '200',
                message: 'Success',
                data: updateTour
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteTour = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Tour.findOne({ _id: id })
            if (!checkProduct) {
                resolve({
                    status: '404',
                    message: "Tour's not founded"
                });
            }

            await Tour.findByIdAndDelete(id);

            resolve({
                status: '200',
                message: 'Delete tour success',
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getUniqueValuesByAttr = (value) => {
    return new Promise(async (resolve, reject) => {
        try {
            const uniqueValue = await Tour.distinct(value);
            resolve({
                status: '200',
                message: 'Get value unit success',
                data: uniqueValue,
            })


        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createTour,
    getDetailTour,
    getTours,
    updateTour,
    deleteTour,
    getUniqueValuesByAttr
}