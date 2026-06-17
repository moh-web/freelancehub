const { text } = require('express');
const mongoose = require('mongoose');
const { number } = require('zod');

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
        ref: 'User'
       
    },
     category:    { type: String, required: true,
                 enum: ['web-development','mobile','design',
                        'writing','marketing','data-science','other'] },
    
    budget: {
    type: {
        type: String,
        enum: ['fixed', 'hourly'],
        required: [true, 'Budget type is required']
    },
   value:{
    type: number,
    min: [0, "min value should be greater than 0"],
    max: [1000000, "max value is 1000,000"]

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
    attatchments: {
        type: [String]
    },
    proposals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
    }],
    skillsRequired: {
        type: [String]},

    
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