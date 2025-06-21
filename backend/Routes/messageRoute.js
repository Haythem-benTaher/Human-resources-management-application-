
const express = require('express');
const msg = require('../controllers/messageContr');



const router = express.Router();

router.post('/', msg.createMessage);
router.get('/:chatId',msg.getMessages);
router.get('/notif/:userId', msg.getNotifications);
router.post('/markRead/:id', msg.markNotificationAsRead);

module.exports = router;