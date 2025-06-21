// routes/entretien_router.js
const express = require('express');
const chat = require('../controllers/chatContr');



const router = express.Router();

router.post('/', chat.createChat);
router.get('/find/:firstId/:secondId', chat.findChat);
router.get('/:userId',chat.findUserChats);

module.exports = router;