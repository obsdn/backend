const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const MessageController = require('../controllers/messages');

// router.post('/', checkAuth, MessageController.messages_get_all);

module.exports = router;
