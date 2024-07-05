const express = require("express");
const router = express.Router();

const userController = require('../controllers/UserController');

router.post('/sign-up', userController.createUser)

module.exports = router;