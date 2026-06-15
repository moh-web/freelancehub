const {z} = require('zod');

const jobSchema = z.object({
    title: z.string().trim().max(120),
    description: z.string().trim().max(3000),
    client: z.string().uuid(),
    category: z.enum(['web-development', 'mobile', 'design', 'writing', 'marketing', 'data-science', 'other']),
    budget: z.object({
        embeded: z.enum(['fixed', 'hourly']),
        type: z.number(),
        min: z.number().min(0),
        max: z.number().max(1000000)
    }),
    deadline: z.date().optional(),
    status: z.enum(['open', 'in progress', 'completed', 'cancelled']).default('open'),
    attatchments: z.array(z.string()).optional(),
    proposals: z.array(z.string().uuid()).optional(),
    skillsRequired: z.array(z.string()).optional()
});
const validateJob = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors.map(err => err.message) });
    }
    req.body = result.data;
    next();
}
module.exports = { jobSchema, validateJob }