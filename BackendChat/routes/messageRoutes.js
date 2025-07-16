const { sendMessage, getMessage, getLastMessage } = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

const router = require('express').Router()

router.get("/:id",auth, getMessage);
router.post("/send/:id",auth, sendMessage);
router.post("/lastMessage",auth, getLastMessage);

module.exports = router;
