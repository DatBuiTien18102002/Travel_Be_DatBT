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

module.exports = {
    createUser,
    loginUser,
}