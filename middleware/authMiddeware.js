const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const admin = require("../firebase");

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

const authFirebaseMiddleware = async (req, res, next) => {
    const idToken = req.headers.token.split(' ')[1];

    if (!idToken) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {

        console.log("error", error.message);
        return res.status(401).send("Unauthorized");
    }
}

module.exports = {
    authAdminMiddleware,
    authUserMiddleware,
    authFirebaseMiddleware,
}
