
const JWT = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No token provided", success: false });
    }
    try{
        const decoded = await JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                throw new Error("Invalid token");
            }
            return decoded;
        });
        req.user=decoded,
        
        next();
    }catch(err){
        return res.status(401).json({ message: "Invalid token", success: false });
    }
}
module.exports = authMiddleware;