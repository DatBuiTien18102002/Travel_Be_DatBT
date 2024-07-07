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
                resolve({
                    status: '400',
                    message: 'The email is already exists'
                });
            }

            const hash = bcrypt.hashSync(password, 10);
            const createUser = await User.create({
                ...newUser, password: hash
            })

            if (createUser) {
                resolve({
                    status: '200',
                    message: 'Create account success',
                    data: createUser
                })
            }
        } catch (e) {
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
                resolve({
                    status: '404',
                    message: "The email is incorrect"
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);

            if (!comparePassword) {
                resolve({
                    status: "404",
                    message: "The password is incorrect"
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

            resolve({
                status: '200',
                message: 'Login Success',
                access_token,
                refresh_token
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
                resolve({
                    status: "404",
                    message: "The email is incorrect"
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: "200",
                message: "Success",
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
                resolve({
                    status: '404',
                    message: 'The email is incorrect'
                });
            }

            await User.findByIdAndDelete(id);

            resolve({
                status: '200',
                message: 'Delete user success',
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find({})


            resolve({
                status: '200',
                message: 'Get all user success',
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

            resolve({
                status: '200',
                message: 'Get detail user success',
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
                reject(err);
            }

            let newAccess_Token = "";

            if (user) {
                const { payload } = user;

                newAccess_Token = await generalAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin,
                })
            }

            resolve({
                status: "200",
                message: "success",
                newAccess_Token
            })
        })
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
}