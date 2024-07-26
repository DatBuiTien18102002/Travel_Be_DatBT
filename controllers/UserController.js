const UserService = require('../services/UserService');
const User = require("../models/UserModel");
// const { generalAccessToken, generalRefreshToken } = require("../services/jwtService");

const createUser = async (req, res) => {
    try {
        console.log(req.body);
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

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("refresh_token");
        return res.status(200).json({
            status: "200",
            message: "Logout successfully"
        })
    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        console.log("Update");
        const userId = req.params.id;
        const data = req.body;
        const { newPassword, confirmNewPassword } = data;

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            })
        }

        if (newPassword && newPassword !== confirmNewPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "The new password must equal confirm new password"
            })
        }

        const response = await UserService.updateUser(userId, data);

        return res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            err: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const response = await UserService.getAllUsers();
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailUser(userId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.headers?.token.split(" ")[1];

        if (!token) {
            return res.status(400).json({
                status: "ERR",
                message: "The refresh token is required"
            })
        }

        const response = await UserService.refreshToken(token);

        return res.status(200).json(response)
    } catch (error) {
        return res.status(200).json({
            err: error.message
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getDetailUser,
    refreshToken,
}