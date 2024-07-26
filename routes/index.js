const UserRouter = require('./UserRouter');
const TourRouter = require('./TourRouter');
const BookingRouter = require('./BookingRouter');
const ReviewRouter = require('./ReviewRouter');

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use("/api/tour", TourRouter);
    app.use("/api/booking", BookingRouter)
    app.use("/api/review", ReviewRouter)
}

module.exports = routes