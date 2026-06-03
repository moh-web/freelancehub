const {z} = require("zod");

const loginSchema = z.object({
    
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});
const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(50, { message: "Name cannot exceed 50 characters" }),
    email: z.string().email({ message: "Invalid email address" }).regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, { message: "Please enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    role: z.enum(["client", "freelancer"], { message: "Role must be either client or freelancer" }),
});
module.exports = {
    loginSchema,
    registerSchema
}