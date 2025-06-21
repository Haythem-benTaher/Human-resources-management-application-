import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Card, InputGroup, Input, Button, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody } from 'reactstrap';
import DemoNavbar from 'components/Navbars/DemoNavbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const defaultAvatar = "path/to/default-avatar.png"; // Replace with the path to your default avatar image

const ChatPage = () => {
    const mainRef = useRef(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userNames, setUserNames] = useState({});
    const [userImages, setUserImages] = useState({});
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const messagesContainerRef = useRef(null);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser._id;
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const { firstId, secondId } = useParams();

    // Function to fetch messages
    const fetchMessages = async (chatId) => {
        try {
            const response = await axios.get(`http://localhost:5000/messages/${chatId}`);
            setMessages(response.data);

            const senderNamesTemp = { ...userNames };
            const userImagesTemp = { ...userImages };
            await Promise.all(
                response.data.map(async (msg) => {
                    if (!senderNamesTemp[msg.senderId]) {
                        const senderResponse = await axios.post('http://localhost:5000/user/consulter', {
                            UserID: msg.senderId
                        });
                        senderNamesTemp[msg.senderId] = senderResponse.data.response.name;
                        userImagesTemp[msg.senderId] = senderResponse.data.response.image || defaultAvatar;
                    }
                })
            );
            setUserNames(senderNamesTemp);
            setUserImages(userImagesTemp);
        } catch (error) {
            console.error("Error fetching messages or sender names:", error);
        }
    };

    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket && userId) {
            socket.emit("addNewUser", userId);
            socket.on("getOnlineUsers", (res) => {
                setOnlineUsers(res);
            });
        }
    }, [socket, userId]);

    useEffect(() => {
        if (socket && userId && newMessage.trim()) {
            const recipientId = selectedChat?.members.find(id => id !== userId);
            if (recipientId) {
               // socket.emit("sendMessage", { text: newMessage, chatId: selectedChat._id, senderId: userId, recipientId });
            }
        }
    }, [newMessage]);

    useEffect(() => {
        if (socket && userId) {
            const handleMessage = (res) => {
                if (selectedChat?._id !== res.chatId) return;
                setMessages((prev) => [...prev, res]);
            };

            const handleNotif = (res) => {
                const isChatOpen = selectedChat?.members.includes(res.senderId);
                if (isChatOpen) {
                    setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
                } else {
                    setNotifications((prev) => [...prev, { ...res, recipientId: selectedChat?.members.find(id => id !== userId) }]);
                }
            };
            socket.on("getMessage", handleMessage);
            socket.on("getNotification", handleNotif);
            return () => {
                socket.off("getMessage", handleMessage);
                socket.off("getNotification", handleNotif);
            };
        }
    }, [socket, selectedChat]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/chats/${userId}`);
                setChats(response.data);

                const userNamesTemp = {};
                const userImagesTemp = {};
                await Promise.all(
                    response.data.map(async (chat) => {
                        const secondUserId = chat.members.find(member => member !== userId);
                        if (!userNamesTemp[secondUserId]) {
                            const nameResponse = await axios.post('http://localhost:5000/user/consulter', {
                                UserID: secondUserId
                            });
                            userNamesTemp[secondUserId] = nameResponse.data.response.name;
                            userImagesTemp[secondUserId] = nameResponse.data.response.image || defaultAvatar;
                        }
                    })
                );
                setUserNames(userNamesTemp);
                setUserImages(userImagesTemp);

                if (firstId && secondId) {
                    const chat = response.data.find(chat => chat.members[0]==firstId && chat.members[1]==secondId);
                    if (chat) {
                        setSelectedChat(chat);
                        fetchMessages(chat._id); // Call fetchMessages for the selected chat
                    }
                }
            } catch (error) {
                console.error("Error fetching chats or user names:", error);
            }
        };
        fetchChats();
    }, [userId, firstId, secondId]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat._id); // Call fetchMessages for the selected chat
        }
    }, [selectedChat]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);
    

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            try {
                const recipientId = selectedChat?.members.find(id => id !== userId);
                if (recipientId) {
                    const response = await axios.post('http://localhost:5000/messages', {
                        chatId: selectedChat._id,
                        senderId: userId,
                        recipientId,
                        text: newMessage
                    });
                    setMessages([...messages, response.data]);
                    setNewMessage('');
                    socket.emit("sendMessage", { text: newMessage, chatId: selectedChat._id, senderId: userId, recipientId });
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const handleSearchClick = async () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            try {
                const response = await axios.get('http://localhost:5000/user');
                setSearchResults(response.data.response.filter(user => user._id !== userId));
            } catch (error) {
                console.error("Error fetching users for search:", error);
            }
        }
    };

    const handleUserSelect = async (selectedUser) => {
        try {
            const existingChat = chats.find(chat => chat.members.includes(selectedUser._id));
            if (existingChat) {
                setSelectedChat(existingChat);
            } else {
                const response = await axios.post('http://localhost:5000/chats', {
                    firstId: userId,
                    secondId: selectedUser._id
                });

                const newChat = response.data;
                setChats([...chats, newChat]);
                setSelectedChat(newChat);

                const nameResponse = await axios.post('http://localhost:5000/user/consulter', {
                    UserID: selectedUser._id
                });
                setUserNames((prev) => ({
                    ...prev,
                    [selectedUser._id]: nameResponse.data.response.name
                }));
                setUserImages((prev) => ({
                    ...prev,
                    [selectedUser._id]: nameResponse.data.response.image || defaultAvatar
                }));
            }
            setIsSearchOpen(false);
        } catch (error) {
            console.error("Error creating or selecting chat:", error);
        }
    };

    return (
        <>
            <DemoNavbar />
            <main className="profile-page" ref={mainRef}>
                <section className="section-profile-cover section-shaped my-0">
                    <div className="shape shape-style-1 shape-default alpha-4"></div>
                </section>
                <Container>
            <Card className="card-profile shadow custom-margin">
                <section className="section">
                    <Card body>
                        <div style={{ display: 'flex', height: '70vh', backgroundColor: '#f4f6f9' }}>
                            {/* User List and Search */}
                            <div style={{ flex: '1', overflowY: 'scroll', borderRight: '1px solid #dee2e6' }}>
                                <Button color="primary" onClick={handleSearchClick} style={{ marginBottom: '10px' }}>
                                    {isSearchOpen ? 'Close Search' : 'Search Users'}
                                </Button>
                                <Modal isOpen={isSearchOpen} toggle={() => setIsSearchOpen(false)} size="lg">
                                    <ModalHeader toggle={() => setIsSearchOpen(false)}>Search Users</ModalHeader>
                                    <ModalBody>
                                        <ListGroup>
                                            {searchResults.map(user => (
                                                <ListGroupItem
                                                    key={user._id}
                                                    action
                                                    onClick={() => handleUserSelect(user)}
                                                >
                                                    <img
                                                        src={userImages[user._id] || defaultAvatar}
                                                        alt="User"
                                                        className="avatar"
                                                        style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                                                    />
                                                    {user.name}
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    </ModalBody>
                                </Modal>
                                <ListGroup>
                                    {chats.map(chat => (
                                        <ListGroupItem
                                            key={chat._id}
                                            action
                                            onClick={() => setSelectedChat(chat)}
                                        >
                                            <img
                                                src={userImages[chat.members.find(id => id !== userId)] || defaultAvatar}
                                                alt="User"
                                                className="avatar"
                                                style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                                            />
                                            {userNames[chat.members.find(id => id !== userId)]}
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </div>

                            {/* Chat Display and Message Input */}
                            <div style={{ flex: '3', padding: '10px' }}>
                                {selectedChat ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div 
                                            ref={messagesContainerRef} 
                                            style={{ 
                                                overflowY: 'scroll', 
                                                flex: '1', 
                                                padding: '10px', 
                                                backgroundColor: '#fff', 
                                                border: '1px solid #e0e0e0', 
                                                borderRadius: '5px' 
                                            }}
                                        >
                                            {messages.map((msg, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        justifyContent: msg.senderId === userId ? 'flex-end' : 'flex-start',
                                                        marginBottom: '10px'
                                                    }}
                                                >
                                                    {msg.senderId !== userId && (
                                                        <img
                                                            src={userImages[msg.senderId] || defaultAvatar}
                                                            alt="User"
                                                            style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                                                        />
                                                    )}
                                                    <div style={{
                                                        maxWidth: '70%',
                                                        padding: '10px',
                                                        borderRadius: '10px',
                                                        backgroundColor: msg.senderId === userId ? '#007bff' : '#e0e0e0',
                                                        color: msg.senderId === userId ? '#fff' : '#000',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <InputGroup style={{ marginTop: '10px' }}>
                                            <Input
                                                    placeholder="Type your message..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') handleSendMessage();
                                                    }}
                                            />
                                            <Button
                                                onClick={handleSendMessage}
                                                style={{ backgroundColor: '#007bff', border: 'none', color: '#fff' }}
                                            >
                                                Send
                                            </Button>
                                        </InputGroup>
                                    </div>
                                ) : (
                                    <div>Select a chat to start messaging</div>
                                )}
                            </div>
                        </div>
                    </Card>
                </section>
            </Card>
        </Container>
            </main>
            <SimpleFooter />
        </>
    );
};

export default ChatPage;