const express = require('express');
const cors = require('cors');
const db = require('./Config/db');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const http = require('http'); // Import http module for server
const socketIo = require('socket.io'); // Import socket.io
const path = require('path'); 

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const UserRoute = require('./routes/Userroute');
const tachesRoute = require('./routes/taches.route');
const offrerouter = require('./routes/OffreRoute');
const candidaturerouter = require('./routes/CandidatureRouter');
const entretienRouter = require('./routes/entretien_router');
const chatRouter = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');

app.use('/offres', offrerouter);
app.use('/candidatures', candidaturerouter);
app.use('/user', UserRoute);
app.use('/entretiens', entretienRouter);
app.use('/taches', tachesRoute);
app.use('/chats', chatRouter);
app.use('/messages', messageRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create an HTTP server
const server = http.createServer(app);

// Attach socket.io to the HTTP server
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log("New connection:", socket.id);

  socket.on("addNewUser", (userId) => {
    console.log("User added:", userId);
    if (userId && !onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }
    console.log("Updated onlineUsers:", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers); // Emit updated users list immediately
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    console.log("User disconnected, updated onlineUsers:", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on('sendMessage', (message) => {
    const user = onlineUsers.find(user => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);

      const notification = {
        senderId: message.senderId,
        recipientId: message.recipientId,
        text: `New message from ${message.senderId}: ${message.text}`,
        isRead: false,
        date: new Date()
      };
      io.to(user.socketId).emit("getNotification", notification);
    }
  });
});
module.exports = { io };
// Start the server on port 5000
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
