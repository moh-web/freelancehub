const router = require('express').Router();
const { createOrgetConversation, getConversations, getMessages, markAsRead} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const {protectedRoute} = require("../middleware/authMiddleware")
router.use(protectedRoute);

router.use(protect);
router.post('/conversation',         createOrgetConversation);
router.get('/conversations',         getConversations);
router.get('/:conversationId',       getMessages);
router.post('/:conversationId/read', markAsRead);

module.exports = router;