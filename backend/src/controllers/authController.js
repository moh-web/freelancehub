
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken, sendRefreshTokenCookie } = require("../services/tokenService");
const maxLoginAttempts = 5;
const lockTime = 30 * 1000; // 30 seconds for testing
const loginController = async (req, res, next) => {
    const { email, password } = req.body;

    try{
       
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", success: false });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select('+password +refreshToken');
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }
         if(user.lockUntil && user.lockUntil > Date.now()){
            // Account is locked
            const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
            return res.status(403).json({ message: `Account locked. Try again in ${remainingTime} seconds`, success: false });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            user.loginAttempts += 1;
            return res.status(400).json({ message: "Invalid credentials", success: false })};
        if (user.loginAttempts >= maxLoginAttempts) {
                user.lockUntil = new Date(Date.now() + lockTime);
                user.loginAttempts = 0; // reset attempts after locking
            }
          
            // Save refresh token in DB
            const refreshToken = generateRefreshToken(user);
            const accessToken = generateAccessToken(user);
             user.refreshToken = refreshToken;
            await user.save();
            
        res.status(200).json({ accessToken, success: true, message: "Logged in successfully"    });
        sendRefreshTokenCookie(res, refreshToken);
         
        }
        // Generate tokens
        
    


    catch(error){
        next(error);
    }} 

const registerController = async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const validRoles = ["freelancer", "client"];
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }
    const lowerCaseRole = role.toLowerCase().trim();
    if (!validRoles.includes(lowerCaseRole)) {
        return res.status(400).json({ message: "Invalid role", success: false });
    }
    
    try {
            const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use", success: false });
        }
        const user = new User({ name, email: normalizedEmail, password, role });
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        const accessToken = generateAccessToken(user);
        await user.save();
        sendRefreshTokenCookie(res, refreshToken);
        res.status(201).json({ accessToken,user: { name: user.name, email: user.email, role: user.role }, success: true, message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
}
const logoutController = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(400).json({ message: "No refresh token provided", success: false });
    }
    try {
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token", success: false });
        }
        user.refreshToken = undefined;
        await user.save();
      res.clearCookie("refreshToken", {
   httpOnly: true,
   secure: true,
   sameSite: "strict"
   

});
        res.json({ message: "Logged out successfully", success: true });
    } catch (error) {
        next(error);
    }
}
const refreshTokenController = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(400).json({ message: "No refresh token provided", success: false });
    }
    try {
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token", success: false });
        }
        const accessToken = generateAccessToken(user);
        res.json({ accessToken, success: true });
        
    } catch (error) {
        next(error);
    }
}
module.exports = {
    loginController,
    registerController,
    logoutController,
    refreshTokenController
};