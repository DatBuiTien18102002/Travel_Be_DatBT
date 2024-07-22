const UserRouter = require('./UserRouter');
const TourRouter = require('./TourRouter');
// const OrderRouter = require('./OrderRouter');

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use("/api/tour", TourRouter);
}

module.exports = routes