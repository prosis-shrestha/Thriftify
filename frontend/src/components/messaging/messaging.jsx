import { ThriftContext } from "../../context/Context";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext, useRef } from "react";
import socket from "../../utils/socket";
import { createChatRoomApi, getChatRoomsApi } from "../../utils/api";
import "./messaging.css";
import { FaTimes } from 'react-icons/fa'

const Chat = ({ userData }) => {
    const { state: { user } } = useContext(ThriftContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(user ? user._id : null);
    const [recipientId] = useState(userData._id);
    const [displayName1] = useState(user ? user.username : null)
    const [displayName2] = useState(userData.username)
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [roomIdentifier, setRoomIdentifier] = useState('');
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUserId(user._id);
        } else {
            setUserId(null);
        }
    }, [user]);

    // Set up room identifier when user or recipient changes
    useEffect(() => {
        if (userId && recipientId) {
            setRoomIdentifier([userId, recipientId].sort().join('_'));
        }
    }, [userId, recipientId]);

    // Handle socket events when the chat is open
    useEffect(() => {
        if (isOpen && userId && recipientId && roomIdentifier) {
            // Join the room when opening the chat
            socket.emit("joinRoom", { userId, recipientId });

            // Set up event listener for private messages
            const handleMessage = (msg) => {
                if (msg.room === roomIdentifier) {
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }
            };

            // Add event listener
            socket.on("privateMessage", handleMessage);

            // Clean up function to remove event listener when component unmounts or chat closes
            return () => {
                socket.off("privateMessage", handleMessage);
                socket.emit("leaveRoom", { room: roomIdentifier });
            };
        }
    }, [isOpen, userId, recipientId, roomIdentifier]);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() === '') return;

        const message = { userId, recipientId, message: input, room: roomIdentifier };
        socket.emit("privateMessage", message);
        setInput("");
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
            setShowScrollButton(false);
        }
    };

    const handleScroll = () => {
        if (chatMessagesRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
            if (scrollHeight - scrollTop === clientHeight) {
                setShowScrollButton(false);
            } else {
                setShowScrollButton(true);
            }
        }
    };

    const toggleChat = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        // If we're opening the chat
        if (!isOpen) {
            try {
                const response = await getChatRoomsApi(userId);
                const existingRoom = response.data.find((r) => r.room === roomIdentifier);

                if (existingRoom) {
                    setMessages(existingRoom.messages);
                } else {
                    await createChatRoomApi({ userId, recipientId, displayName1, displayName2 });
                    setMessages([]);
                }

                setIsOpen(true);
                setTimeout(scrollToBottom, 0);

            } catch (error) {
                console.error('Error checking or creating chat room', error);
            }
        } else {
            // Close the chat
            setIsOpen(false);
        }
    };

    return (
        <>
            <div className="chat-icon" onClick={toggleChat}>
                Chat now
            </div>
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h4>{userData.username}</h4>
                        <button onClick={toggleChat}><FaTimes /></button>
                    </div>
                    <div className="chat-messages" ref={chatMessagesRef} onScroll={handleScroll}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.userId === userId ? 'user' : 'other'}`}>
                                {msg.message}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                    {showScrollButton && (
                        <button className="scroll-to-bottom" onClick={scrollToBottom}>⬇️</button>
                    )}
                </div>
            )}
        </>
    );
};

export default Chat;