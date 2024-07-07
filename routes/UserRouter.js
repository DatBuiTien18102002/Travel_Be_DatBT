const express = require("express");
const router = express.Router();

const userController = require('../controllers/UserController');
const { authUserMiddleware, authAdminMiddleware } = require("../middleware/authMiddeware");

router.post('/sign-up', userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.put("/update/:id", authUserMiddleware, userController.updateUser);
router.delete("/delete/:id", authAdminMiddleware, userController.deleteUser);
router.get("/get-all", authAdminMiddleware, userController.getAllUser);
router.get('/get-detail/:id', authUserMiddleware, userController.getDetailUser);
router.get("/refresh-token", userController.refreshToken);

module.exports = router;