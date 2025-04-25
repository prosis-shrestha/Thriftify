import React from 'react';
import './ChatUser.css';

const ChatUser = ({ userName, onClick, isSelected, hasNotification }) => {
    return (
        <div className={`chat-user ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <span className="user-name">{userName}</span>
        </div>
    );
};

export default ChatUser;
