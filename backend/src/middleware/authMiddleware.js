const protectedRoute = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(!token) return res.status(401).json({message: 'Unauthorized'}

        )
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
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