const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { generalAccessToken, generalRefreshToken } = require("./jwtService");

dotenv.config();

const createUser = (newUser) => {
    const { email, password } = newUser;
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser) {
                return resolve({
                    status: '400',
                    message: 'Email đã tồn tại!'
                });
            }

            const hash = bcrypt.hashSync(password, 10);
            const createUser = await User.create({
                ...newUser, password: hash
            })

            if (createUser) {
                return resolve({
                    status: '200',
                    message: 'Tạo tài khoản thành công!',
                    data: createUser
                })
            }
        } catch (e) {
            console.log("error", e);
            reject(e)
        }
    })
}

const loginUser = (user) => {
    const { email, password } = user;

    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                email: email
            })

            if (!checkUser) {
                return resolve({
                    status: '404',
                    message: "User không tìm thấy!"
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);

            if (!comparePassword) {
                return resolve({
                    status: "404",
                    message: "Mật khẩu không đúng!"
                })
            }

            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            return resolve({
                status: '200',
                message: 'Đăng nhập thành công!',
                data: {
                    access_token,
                    refresh_token
                }
            })
        } catch (error) {
            reject(error)
        }
    })


}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkedUser = await User.findOne({ _id: id });
            if (!checkedUser) {
                return resolve({
                    status: "404",
                    message: "User không tìm thấy!"
                })
            }

            const checkEmail = await User.findOne({ email: data?.email })
            if (checkEmail?._id.toString() !== id && data?.email) {
                return resolve({
                    status: "404",
                    message: "Email đã tồn tại!"
                })
            }

            if (data.newPassword) {
                const comparePassword = bcrypt.compareSync(data.oldPassword, checkedUser.password);
                if (comparePassword) {
                    const hash = bcrypt.hashSync(data?.newPassword, 10);
                    await User.findByIdAndUpdate(id, { password: hash }, { new: true });

                    return resolve({
                        status: "200",
                        message: "Cập nhật mật khẩu thành công!",
                    })
                } else {
                    return resolve({
                        status: "404",
                        message: "Mật khẩu cũ không đúng!"
                    })
                }
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true });

            return resolve({
                status: "200",
                message: "Cập nhật user thành công!",
                data: updateUser
            })
        } catch (error) {
            reject(error)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id })
            if (!checkUser) {
                return resolve({
                    status: '404',
                    message: 'Email không đúng!'
                });
            }

            await User.findByIdAndDelete(id);

            return resolve({
                status: '200',
                message: 'Xóa user thành công!',
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find({})


            return resolve({
                status: '200',
                message: 'Lấy tất cả user thành công!',
                data: allUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailUser = await User.findOne({ _id: id })
            return resolve({
                status: '200',
                message: 'Lấy chi tiết user thành công!',
                data: detailUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const refreshToken = (token) => {
    return new Promise(async (resolve, reject) => {
        jwt.verify(token, process.env.JWT_PASS_REFRESH, async function (err, user) {
            if (err) {
                return reject(err);
            }

            let newAccess_Token = "";

            if (user) {
                const { payload } = user;

                newAccess_Token = await generalAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin,
                })
            }

            return resolve({
                data: {
                    status: "200",
                    message: "success",
                    newAccess_Token
                }
            })
        })
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getDetailUser,
    refreshToken,
}