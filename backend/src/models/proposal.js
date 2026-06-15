const mongoose = require('mongoose');
const proposalSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: [true, 'Cover letter is required'],
        maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
    },
    bidAmount: {
        type: Number,
        required: [true, 'Bid amount is required'],
        min: [0, 'Bid amount cannot be negative'],
        max: [1000000, 'Bid amount cannot exceed 1,000,000']
    },
    deliveryDays : {
        type: Number,
        required: [true, 'Delivery days is required'],
        min: [1, 'Delivery days must be at least 1']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    attatchments: {
        type: [String]
    },

}, { timestamps: true });
// Ensure a freelancer can only submit one proposal per job
proposalSchema.index({ job: 1, freelancer: 1,status: 1 }, { unique: true });  
const Proposal = mongoose.model('Proposal', proposalSchema);
module.exports = Proposal;