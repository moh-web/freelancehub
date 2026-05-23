const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: [2000, 'Message content cannot exceed 2000 characters']
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });
// Index for efficient retrieval of messages in a conversation
messageSchema.index({ conversation: 1, createdAt: 1 }); // Index for efficient retrieval of messages in a conversation

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;