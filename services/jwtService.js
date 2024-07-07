const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generalAccessToken = async (payload) => {
    return accessToken = await jwt.sign({
        payload
    }, process.env.JWT_PASS_ACCESS, { expiresIn: "30m" });

}

const generalRefreshToken = async (payload) => {
    return refreshToken = await jwt.sign({
        payload
    }, process.env.JWT_PASS_REFRESH, { expiresIn: "30m" });

}

module.exports = { generalAccessToken, generalRefreshToken }