const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

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

module.exports = {
    createUser,
}