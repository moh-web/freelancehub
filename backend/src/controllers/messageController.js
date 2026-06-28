const Conversation = require("../models/conversation");
const Message = require("../models/message");
exports.createOrgetConversation = async (req, res, next)=>{
    const {recipientId} = req.body;
    try{
        const participants  = [req.user.id, recipientId].sort();

        let conv= await Conversation.findOne({participants: {$all: participants}}).populate('participants', 'name avatar').populate('lastMessage');
        if(!conv){
           conv = await Conversation.create({
    participants
});

conv = await conv.populate(
    "participants",
    "name avatar"
);
        }
        res.json({success: true, data: conv})
    }catch(err){
        next(err)
    }
};  



exports.getConversations = async (req, res, next)=>{
    try{
        //get my conversation contain recipiant and laxtmessage
        const conv = await Conversation.find({participants: req.user.id}).populate('participants', 'name, avatar').populate('lastMessage').sort({lastMessageAt: -1});
        res.json({success: true, data: conv})
    }catch(err){
        next(err)
    }
};
exports.getMessages = async (req, res, next)=>{
    try{
        const { conversationId } = req.params;
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 30;
  const conv  = await Conversation.findOne({ _id: conversationId, participants: req.user.id });
  if (!conv) return res.status(403).json({ success: false, message: 'Not a participant' });
  const total    = await Message.countDocuments({ conversation: conversationId });
  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'name avatar')
    .sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit);
  res.json({ success: true, total, page, pages: Math.ceil(total/limit), data: messages.reverse() });

    }catch(err){
        next(err)
    }
};
exports.markAsRead = async (req, res, next) => {
    try {
        const updatedMessages =
            await Message.updateMany(
                {
                    conversation: req.params.id,
                    readBy: {
                        $ne: req.user.id
                    }
                },
                {
                    $addToSet: {
                        readBy: req.user.id
                    }
                }
            );

        res.json({
            success: true,
        
        });

    } catch (err) {
        next(err);
    }
};
