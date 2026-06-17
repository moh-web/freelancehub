const {z} = require('zod');

const jobSchema = z.object({
    title: z.string().trim().max(120),
    description: z.string().trim().max(3000),
    client: z.string().optional(),
    category: z.enum(['web-development', 'mobile', 'design', 'writing', 'marketing', 'data-science', 'other']),
    budget: z.object(
        {
            type: z.enum(["fixed", "hourly"]),
            value: z.number().min(0).max(1000000)
        }
    
),
    deadline: z.coerce.date().optional(),
    status: z.enum(['open', 'in progress', 'completed', 'cancelled']).default('open'),
    attatchments: z.array(z.string()).optional(),
    proposals: z.array(z.string()).optional(),
    skillsRequired: z.array(z.string()).optional()
});
const validateJob = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.issues.map(err => err.message) });
    }
    req.body = result.data;
    next();
}
module.exports = { jobSchema, validateJob }