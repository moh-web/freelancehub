const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const portfolioItemSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  fileUrl:     { type: String },
}, { _id: false, timestamps: true });
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']

    },
    role: {
        type: String,
        enum: ['client', 'freelancer', 'admin'],
        default: 'freelancer',
        required: [true, 'Role is required']
    },
    avatar: {
        type: [String],
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    skills: {
        type: [String]
        
    },
    hourlyRate: {
        type: Number,
        min: [0, 'Hourly rate cannot be negative'],
           },
    portofolio: [portfolioItemSchema],
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },

    refreshToken: {
        type: String,
        default: null,
        select: false


    },
    isActive: {
        type: Boolean,
        default: true
    }
 


}, { timestamps: true });
userSchema.index({ email: 1 , refreshToken: 1 , role: 1 });
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return ;
    
 this.password = await bcrypt.hash(this.password, 10);
 
      
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', userSchema);
module.exports = User;