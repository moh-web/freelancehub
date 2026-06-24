const {z} = require('zod');
const createProposalSchema = z.object({
    job: z.string(),
    freelancer: z.string(),
    coverLetter: z.string().trim().max(1000),
    bidAmount: z.number().min(0),
    deliveryDays: z.number().min(1),
    status: z.enum(['pending', 'accepted', 'rejected', 'withdrawn']).default('pending'),
    attachments: z.array(z.string()).optional()
});
const validateProposal = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors.map(err => err.message) });
    }
    req.body = result.data;
    next();
};
module.exports = { createProposalSchema, validateProposal };
