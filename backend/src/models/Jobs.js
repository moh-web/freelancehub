const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength: [120, 'Job title cannot exceed 120 characters']
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
       
        maxlength: [3000, 'Job description cannot exceed 3000 characters']
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Client is required']
    },
    category: {
        type: String,
        required: [true, 'Job category is required'],
        enum: ['Web Development', 'Graphic Design', 'Content Writing', 'Digital Marketing', 'Other']
    },
    skillsRequired: {
        type: [String],
        required: [true, 'At least one skill is required']
    },
    budget: {
        embeded: {type: "fixed" | "hourly", min: [0, 'Budget cannot be negative'], max: [1000000, 'Budget cannot exceed 1 million']},
        type: Number,
        required: [true, 'Job budget is required']
    },
    deadline: {
        type: Date,
        required: [true, 'Job deadline is required'],
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'completed', 'cancelled'],
        default: 'open'
    },
    attatchments: {
        type: [String]
    },
    proposals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
    }],
    salary: {
        type: Number,
        required: [true, 'Job salary is required'],
    }
});
//compound index for filtering and sorting
jobSchema.index({
  status: 1,
  category: 1,
  createdAt: -1,
skillsRequired: 1
});
//text index for search
jobSchema.index({
  title: 'text',
  description: 'text'
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;