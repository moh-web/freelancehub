const {loginSchema, registerSchema} = require("../validators/authValidator");
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ success: false, errors: result.error.issues.map(issue => {return { path: issue.path, message: issue.message };}) });
        }
        next();
    };
};
module.exports = {
    validateLogin: validate(loginSchema),
    validateRegister: validate(registerSchema)
}