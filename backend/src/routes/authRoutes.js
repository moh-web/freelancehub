const loginController = require("../controllers/authController").loginController;
const registerController = require("../controllers/authController").registerController;
const refreshTokenController = require("../controllers/authController").refreshTokenController;
const logoutController = require("../controllers/authController").logoutController;
const router = require("express").Router();
// Login route
router.post("/login", loginController);
// Register route
router.post("/register", registerController);
// Refresh token route
router.post("/refresh-token", refreshTokenController);
// Logout route
router.post("/logout", logoutController);
module.exports = router;