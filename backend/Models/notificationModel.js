const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String,  },
    isRead: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
