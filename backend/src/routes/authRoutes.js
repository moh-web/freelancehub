const router = require("express").Router();
const loginController = require("../controllers/authController").loginController;
const registerController = require("../controllers/authController").registerController;
const refreshTokenController = require("../controllers/authController").refreshTokenController;
const logoutController = require("../controllers/authController").logoutController;
const {validateLogin, validateRegister} = require("../middleware/validateMiddleware");
// Login route
router.post("/login", validateLogin, loginController);
// Register route
router.post("/register", validateRegister, registerController);
// Refresh token route
router.post("/refresh-token", refreshTokenController);
// Logout route
router.post("/logout", logoutController);
module.exports = router;