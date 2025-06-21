const messageModel = require('../models/messageModel.js');
const notificationModel = require('../models/notificationModel.js'); // Import the notification model

// Assuming socketIo is your socket.io instance and is exported from another module
const { io } = require('../index.js'); // Adjust the path according to your file structure

const createMessage = async (req, res) => {
    const { chatId, senderId, recipientId, text } = req.body;
    const message = new messageModel({ chatId, senderId, text });

    try {
        const savedMessage = await message.save();

        const notification = new notificationModel({
            senderId,
            recipientId,
            text: `New message: ${text}`,
            isRead: false
        });

        await notification.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        console.error("Error in createMessage:", error); // Log detailed error information
        res.status(500).json({ message: 'Error creating message and notification', error });
    }
}


// Fetch notifications for a specific user
const getNotifications = async (req, res) => {
    const { userId } = req.params; // Assume notifications are tied to a user ID

    try {
        const notifications = await notificationModel.find({ recipientId: userId }).sort({ date: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};


// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;

  try {
    // Find the notification by ID and update its read status
    const notification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // Return the updated document
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await messageModel.find({ chatId });
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching messages', error });
    }
}

module.exports = {
    createMessage,
    getMessages,
    getNotifications,
    markNotificationAsRead

};
