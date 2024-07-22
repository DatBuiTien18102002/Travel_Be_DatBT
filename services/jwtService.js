const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generalAccessToken = async (payload) => {
    return accessToken = await jwt.sign({
        payload
    }, process.env.JWT_PASS_ACCESS, { expiresIn: "1h" });

}

const generalRefreshToken = async (payload) => {
    return refreshToken = await jwt.sign({
        payload
    }, process.env.JWT_PASS_REFRESH, { expiresIn: "1w" });

}

module.exports = { generalAccessToken, generalRefreshToken }