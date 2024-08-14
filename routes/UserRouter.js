const express = require("express");
const router = express.Router();

const userController = require('../controllers/UserController');
const { authUserMiddleware, authAdminMiddleware, authFirebaseMiddleware } = require("../middleware/authMiddeware");

router.post('/sign-up', userController.createUser);
router.post("/sign-in", userController.loginUser);
router.get("/gg-login", authFirebaseMiddleware, userController.loginGGUser);
router.get("/fb-login", authFirebaseMiddleware, userController.loginFBUser);
router.post("/logout", userController.logoutUser);
router.put("/update/:id", authUserMiddleware, userController.updateUser);
router.delete("/delete/:id", authAdminMiddleware, userController.deleteUser);
router.get("/get-all", authAdminMiddleware, userController.getAllUsers);
router.get('/get-detail/:id', authUserMiddleware, userController.getDetailUser);
router.get("/refresh-token", userController.refreshToken);

module.exports = router;