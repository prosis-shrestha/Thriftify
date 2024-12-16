import React, { useEffect, useState, useContext, useRef } from 'react';
import { ThriftContext } from '../../context/Context';
import { getChatRoomsApi } from '../../utils/api';
import './chatList.css';
import socket from "../../utils/socket";
import ChatUser from "../../components/ChatUser/ChatUser";
import Navbar from "../../components/Navbar/Navbar"

const ChatList = () => {
    const { state: { user } } = useContext(ThriftContext);
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // const roomRef = useRef(null);
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        fetchChatRooms()

        socket.on("privateMessage", handleMessage);
        socket.on("newChatRoom", handleNewChatRoom);

        return () => {
            socket.off("privateMessage", handleMessage);
            socket.off("newChatRoom", handleNewChatRoom);
        };
    }, [user]); //messages

    useEffect(() => {
        scrollToBottom();
    }, [selectedRoom]); //messages

    const fetchChatRooms = async () => {
        try {
            const response = await getChatRoomsApi(user._id);
            setChatRooms(response.data);
        } catch (error) {
            console.error('Error fetching chat rooms', error);
        }
    };

    const handleMessage = (msg) => {
        // if (roomRef.current && msg?.room === roomRef.current.room) {
        //     setMessages((prevMessages) => [...prevMessages, msg]);
        // }
        setMessages(prevMessages => ({
            ...prevMessages,
            [msg.room]: [...(prevMessages[msg.room] || []), msg]
        }));

        setChatRooms(prevRooms =>
            prevRooms.map(room =>
                room.room === msg.room
                    ? { ...room, unreadCount: (room.unreadCount || 0) + 1 }
                    : room
            )
        );
    };

    const handleNewChatRoom = (newRoom) => {
        setChatRooms(prevRooms => [...prevRooms, newRoom]);
    };

    const handleUserClick = async (room) => {
        setSelectedRoom(room);


        // Reset unread count
        setChatRooms(prevRooms =>
            prevRooms.map(r =>
                r.room === room.room ? { ...r, unreadCount: 0 } : r
            )
        );

        if (!messages[room.room]) {
            try {
                const response = await getChatMessagesApi(room.room);
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [room.room]: response.data
                }));
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        }

        socket.emit("joinRoom", { userId: user._id, recipientId: room.users.find(u => u !== user._id) });

        // const roomId = room.room;
        // const selectedRoomMessages = chatRooms.find((r) => r.room === roomId)?.messages || [];
        // setMessages(selectedRoomMessages);

        // socket.emit("joinRoom", { userId: user._id, recipientId: room.users.find(u => u !== user._id) });
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

        // Optimistically add the message to the local state
        handleMessage(message);

    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    return (
        <>
            <Navbar />
            <div className="chat-container">
                <div className="chat-sidebar">
                    <h5>Chats</h5>
                    {chatRooms.map((room) => (
                        <ChatUser
                            key={room._id}
                            userName={(user.username == room.displayName1) ? room.displayName2 : room.displayName1}
                            onClick={() => handleUserClick(room)}
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
