const dotenv = require('dotenv');
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
                return resolve({
                    status: '400',
                    message: 'Tên tour đã tồn tại!'
                });
            } else {
                createTour = await Tour.create({
                    ...newTour
                })
            }

            if (createTour) {
                return resolve({
                    status: '200',
                    message: 'Tạo tour thành công!',
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
            const detailTour = await Tour.findOne({ _id: id }).populate('reviews')

            return resolve({
                status: '200',
                message: 'Lấy chi tiết tour thành công!',
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
                const allTour = await Tour.find(filter).limit(limit).skip(tourSkip).populate('reviews');
                return resolve({
                    status: "200",
                    message: "Lấy tất cả tour thành công!",
                    currentPage: +page,
                    totalTour: totalTour,
                    totalPage: totalPage,
                    data: allTour,
                })
            } else if (_sort || _order) {
                const allTour = await Tour.find(filter).limit(limit).skip(tourSkip).populate('reviews').sort({
                    [_sort]: _order
                }).collation({ locale: 'vi', strength: 2 });
                return resolve({
                    status: '200',
                    message: 'Lấy tất cả tour thành công!',
                    currentPage: +page,
                    totalTour: totalTour,
                    totalPage: totalPage,
                    data: allTour
                })
            } else {
                return reject({
                    status: '400',
                    message: 'Bạn cần cung cấp _sort và _order!',
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
                return resolve({
                    status: '404',
                    message: 'Tour không tìm thấy!'
                });
            }

            const updateTour = await Tour.findByIdAndUpdate(id, data, { new: true });

            return resolve({
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
                return resolve({
                    status: '404',
                    message: "Tour không tìm thấy!"
                });
            }

            await Tour.findByIdAndDelete(id);

            return resolve({
                status: '200',
                message: 'Xóa tour thành công!',
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
            return resolve({
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