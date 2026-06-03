const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';
const accessTokenGenerator = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, accessTokenSecret, { expiresIn: accessTokenExpiry });
};
const refreshTokenGenerator = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
};
const sendRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token,{
        httpOnly: true,
        // Set to true in production to ensure the cookie is only sent over HTTPS
        // In development, you can set it to false to allow testing over HTTP
        secure: process.env.NODE_ENV === 'production',
        // Prevents the cookie from being sent in cross-site requests, mitigating CSRF attacks
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
};
module.exports = {
    accessTokenGenerator,
    refreshTokenGenerator,
    sendRefreshTokenCookie,
};