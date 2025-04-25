import React, { useEffect, useState, useContext, useRef } from 'react';
import { ThriftContext } from '../../context/Context';
import { getChatRoomsApi } from '../../utils/api';
import './chatList.css';
import socket from "../../utils/socket";
import ChatUser from "../../components/ChatUser/ChatUser";
import Navbar from "../../components/Navbar/Navbar"

const ChatList = () => {
    const { state: { user }, dispatch } = useContext(ThriftContext);
    // const { state: { user, notifications }, dispatch } = useContext(ThriftContext);
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const roomRef = useRef(null);
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);

    // console.log(notifications);

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await getChatRoomsApi(user._id);
                setChatRooms(response.data);

            } catch (error) {
                console.error('Error fetching chat rooms', error);
            }
        };

        if (user) {
            fetchChatRooms();
        }

        socket.on("privateMessage", handleMessage);

        return () => {
            socket.off("privateMessage", handleMessage);
        };
    }, [user, chatRooms]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessage = (msg) => {

        setChatRooms((prevChatRooms) => {
            return prevChatRooms.map((room) => {
                if (room.room === msg.room) {
                    return {
                        ...room,
                        messages: [...room.messages, msg]
                    };
                }
                return room;
            });
        });

        // dispatch({ type: 'ADD_NOTIFICATION', payload: { room: msg.room, mainUser: msg.userId } });

        if (roomRef.current && msg?.room === roomRef.current.room) {
            setMessages((prevMessages) => [...prevMessages, msg]);
        }

    };

    const handleUserClick = async (room) => {
        setSelectedRoom(room);
        roomRef.current = room;

        const roomId = room.room;
        const selectedRoomMessages = chatRooms.find((r) => r.room === roomId)?.messages || [];
        setMessages(selectedRoomMessages);

        socket.emit("joinRoom", { userId: user._id, recipientId: room.users.find(u => u !== user._id) });

        // dispatch({ type: 'CURRENT_NOTIFICATION', payload: { room: roomId, mainUser: room.users.find(u => u !== user._id) } });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (!selectedRoom) return;

        const message = { userId: user._id, recipientId: selectedRoom.users.find(u => u !== user._id), message: input, room: selectedRoom.room };
        socket.emit("privateMessage", message);
        setInput("");
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    const sortedChatRooms = [...chatRooms].sort((a, b) => {
        const lastMessageA = a.messages[a.messages.length - 1];
        const lastMessageB = b.messages[b.messages.length - 1];
        return new Date(lastMessageB?.timestamp) - new Date(lastMessageA?.timestamp);
    });

    return (
        <>
            <Navbar />
            <div className="chat-container">
                <div className="chat-sidebar">
                    <h5>Chats</h5>
                    {sortedChatRooms.map((room) => (
                        <ChatUser
                            key={room._id}
                            userName={(user.username == room.displayName1) ? room.displayName2 : room.displayName1}
                            onClick={() => handleUserClick(room)}
                            isSelected={selectedRoom && selectedRoom.room === room.room}
                        // hasNotification={notifications[room.room]}
                        />
                    ))}
                </div>
                <div className="chat-main">
                    {selectedRoom ? (
                        <>
                            <h6>{(user.username == selectedRoom.displayName1) ? selectedRoom.displayName2 : selectedRoom.displayName1}</h6>

                            <div className="chat-messages" ref={chatMessagesRef}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`chat-message ${msg.userId === user._id ? 'user' : 'other'}`}>
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
                        </>
                    ) : (
                        <div className="chat-placeholder">
                            <h4>Select a chat to start messaging</h4>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatList;



