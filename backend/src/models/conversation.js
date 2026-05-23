const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        
    },
    lastMessageAt: {
        type: Date,
       
    }
}, { timestamps: true });
//participants index for efficient querying of conversations for a user exactly 2 participants
//compound unique index to prevent duplicate conversations between the same participants
conversationSchema.index({
  participants: 1,
});

// Inbox sorting
conversationSchema.index({
  lastMessageAt: -1,
});



conversationSchema.index(
  {
    participants: 1,
  },
  {
    unique: true,
  }
);

conversation.path('participants').validate(function (participants) {
    return participants.length === 2;
}, 'A conversation must have exactly 2 participants');
const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;