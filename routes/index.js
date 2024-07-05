const UserRouter = require('./UserRouter');
// const ProductRouter = require('./ProductRouter');
// const OrderRouter = require('./OrderRouter');

const routes = (app) => {
    app.use('/api/user', UserRouter)
}

module.exports = routes