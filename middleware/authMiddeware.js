const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authAdminMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1];
    jwt.verify(token, process.env.JWT_PASS_ACCESS, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: err,
                status: 'Error'
            })
        }
        const { payload } = user;
        if (payload?.isAdmin) {
            next()
        } else {
            return res.status(403).json({
                message: 'You do not have this authority',
                status: 'Error'
            })
        }
    });
}

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1];
    const userId = req.params.id;
    const userBodyId = req.body?.userInfo;

    jwt.verify(token, process.env.JWT_PASS_ACCESS, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: err,
                status: 'Error'
            })
        }
        const { payload } = user;
        console.log(user);
        console.log("userId", userId);
        console.log("token", payload?.id);
        console.log("userBodyId", req.body);
        if (payload?.isAdmin || payload?.id === userId || payload?.id === userBodyId) {
            next()
        } else {
            return res.status(403).json({
                message: 'You do not have this authority',
                status: 'Error'
            })
        }
    });
}

module.exports = {
    authAdminMiddleware,
    authUserMiddleware
}
