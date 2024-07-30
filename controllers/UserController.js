const UserService = require('../services/UserService');

const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Cần cung cấp đầy đủ thông tin!'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không đúng cấu trúc!'
            })
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu và xác nhận mật khẩu không trùng nhau!'
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
                message: "Cần cung cấp đầy đủ thông tin!"
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: "ERR",
                message: "Email cung cấp không khả dụng!"
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
            message: "Đăng xuất thành công!"
        })
    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        const { newPassword, confirmNewPassword } = data;

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "Cần cung cấp UserId!"
            })
        }

        if (newPassword && newPassword !== confirmNewPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "Mật khẩu và xác nhận mật khẩu không trùng nhau!"
            })
        }

        const response = await UserService.updateUser(userId, data);

        return res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        return res.status(404).json({
            err: e.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Cần cung cấp UserId!'
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
                message: 'Cần cung cấp UserId!'
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
                message: "Cần cung cấp Refresh token!"
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