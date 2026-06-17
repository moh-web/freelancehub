const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config({path: "../.env"})

const protectedRoute = (req, res, next) => {
    try{
          const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header is required"
        });
    }
        const token = authHeader.split(' ')[1];
        console.log(`token: ${token}`)
        if(!token) return res.status(401).json({message: 'Unauthorized'}

        )
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log(decoded)
        req.user = decoded
        next()
    }catch(err){next(err)}
}
const authorizedRoute = (req, res, next) => {
    const roles = ['client', 'freelancer', 'admin'];

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };

module.exports = { protectedRoute, authorizedRoute }