
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
        required: true
       
    },
     category:    { type: String, required: true,
                 enum: ['web-development','mobile','design',
                        'writing','marketing','data-science','other'] },
    
   budget: {
    type: {
        type: String,
        enum: ["fixed", "hourly"],
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000
    }
},

    deadline: {
        type: Date
       
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'completed', 'cancelled'],
        default: 'open'
    },
    attachments: {
        type: [String]
    },
    proposals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
    }],
    skillsRequired: {
        type: [String],
        default: []
    },

    
}, { timestamps: true });
//compound index for filtering and sorting
jobSchema.index({
  status: 1,
  category: 1,
  createdAt: -1,
skillsRequired: 1
});

jobSchema.index({
    title: "text",
    description: "text",
    skillsRequired: "text"
})

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;