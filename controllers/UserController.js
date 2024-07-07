const UserService = require('../services/UserService');
const User = require("../models/UserModel");
// const { generalAccessToken, generalRefreshToken } = require("../services/jwtService");

const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The email is invalid'
            })
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The password must equal confirm password'
            })
        }

        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            return res.status(400).json({
                status: "ERR",
                message: "The input isRequired"
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: "ERR",
                message: "The email is invalid"
            })
        }

        const response = await UserService.loginUser(req.body);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(409).json({ err: error.message })
    }
}

module.exports = {
    createUser,
    loginUser
}