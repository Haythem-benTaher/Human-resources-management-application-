import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Nav, NavItem, NavLink, Badge, Popover, PopoverHeader, PopoverBody, ListGroup, ListGroupItem } from 'reactstrap';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import io from 'socket.io-client';

const NotificationsPage = () => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userNames, setUserNames] = useState({}); // Store user names by their IDs
    const navigate = useNavigate(); // Initialize navigate
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userId = storedUser._id; // Retrieve user ID from local storage
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:5000/messages/notif/${userId}`);
                    const notificationsData = response.data;
                    
                    // Filter for unread notifications
                    const unreadNotifications = notificationsData.filter(notif => !notif.isRead);
                    setNotifications(unreadNotifications);
                    
                    // Calculate unread count
                    setUnreadCount(unreadNotifications.length);

                    // Extract user IDs from notifications
                    const userIds = [...new Set(unreadNotifications.map(notif => notif.senderId))];

                    // Fetch user names
                    const userNamesData = await fetchUserNames(userIds);
                    setUserNames(userNamesData);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            }
        };

        fetchNotifications();

        // Set up WebSocket connection
        const socket = io('http://localhost:4000'); // Replace with your WebSocket server URL
        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            const handleNewNotification = (notification) => {
                // Update notifications state
                setNotifications(prevNotifications => [notification, ...prevNotifications]);
                setUnreadCount(prevCount => prevCount + 1);
            };

            socket.on('newNotification', handleNewNotification);

            return () => {
                socket.off('newNotification', handleNewNotification);
            };
        }
    }, [socket]);

    const togglePopover = () => setPopoverOpen(!popoverOpen); // Toggle popover visibility

    const handleNotificationClick = async (notification) => {
        try {
            // Mark the notification as read in the backend
            await axios.post(`http://localhost:5000/messages/markRead/${notification._id}`);

            // Update state to remove the notification from the list
            setNotifications(prevNotifications => {
                const updatedNotifications = prevNotifications.filter(notif => notif._id !== notification._id);
                setUnreadCount(updatedNotifications.length);
                return updatedNotifications;
            });

            // Navigate to ChatPage with conversation ID
            navigate(`/chat/${notification.recipientId}/${notification.senderId}`); // Adjust the route to match your app's routing setup
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Function to fetch user names by their IDs
    const fetchUserNames = async (userIds) => {
        try {
            const responses = await Promise.all(
                userIds.map(async (userId) => {
                    const response = await axios.post('http://localhost:5000/user/consulter', { UserID: userId });
                    return { userId, userData: response.data.response };
                })
            );

            // Map user IDs to names
            return responses.reduce((acc, { userId, userData }) => {
                if (userData && userData.name) {
                    acc[userId] = userData.name;
                }
                return acc;
            }, {});
        } catch (error) {
            console.error('Error fetching user names:', error);
            return {};
        }
    };

    return (
        <Navbar expand="md">
            <Nav className="ml-auto" navbar>
                <NavItem className="position-relative">
                    <NavLink id="notificationPopover" onClick={togglePopover}>
                        <FaBell size={24} className="text-dark" />
                        {unreadCount > 0 && (
                            <Badge color="danger" pill className="position-absolute top-0 start-100 translate-middle">
                                {unreadCount}
                            </Badge>
                        )}
                    </NavLink>
                    <Popover
                        placement="bottom"
                        isOpen={popoverOpen}
                        target="notificationPopover"
                        toggle={togglePopover}
                    >
                        <PopoverHeader>Notifications</PopoverHeader>
                        <PopoverBody>
                            <ListGroup flush>
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <ListGroupItem
                                            key={notif._id}
                                            className="d-flex justify-content-between align-items-center"
                                            onClick={() => handleNotificationClick(notif)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div>New message from {userNames[notif.senderId] || 'Unknown Sender'}</div>
                                            <div>{new Date(notif.date).toLocaleString()}</div>
                                        </ListGroupItem>
                                    ))
                                ) : (
                                    <ListGroupItem>No notifications</ListGroupItem>
                                )}
                            </ListGroup>
                        </PopoverBody>
                    </Popover>
                </NavItem>
            </Nav>
        </Navbar>
    );
};

export default NotificationsPage;