import React, { useState, useEffect, useRef } from 'react';
import './Chatbox.css';

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const chatboxRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener("keyup", handleKeyUp);
        }
        return () => {
            if (inputRef.current) {
                inputRef.current.removeEventListener("keyup", handleKeyUp);
            }
        };
    }, []);

    const toggleState = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyUp = (event) => {
        if (event.key === "Enter") {
            onSendButton();
        }
    };

    const onSendButton = () => {
        if (inputValue.trim() === "") {
            return;
        }

        const newUserMessage = { name: "User", message: inputValue };
        setMessages(prevMessages => [...prevMessages, newUserMessage]);

        fetch(`${import.meta.env.VITE_CHAT_URL}/predict`, {
            method: 'POST',
            body: JSON.stringify({ message: inputValue }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                const newBotMessage = { name: "Sam", message: r.answer };
                setMessages(prevMessages => [...prevMessages, newBotMessage]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        setInputValue('');
    };

    return (
        <div className="chatbox">
            {/* <div className="chatbox__button" onClick={toggleState}> */}
            <button className="chatbox__button" onClick={toggleState}><img src="/images/ai_star.png" className="chat_img" /></button>
            {/* </div> */}
            {isOpen && (
                <div className="chatbox__support" ref={chatboxRef}>
                    <div className="chatbox__messages" >
                        {messages.length > 0 ?
                            (messages.slice().reverse().map((item, index) => (
                                <div key={index} className={`messages__item messages__item--${item.name === "Sam" ? "visitor" : "operator"}`}>
                                    {item.message}
                                </div>
                            ))) :
                            <p>Ask anything you like.</p>}
                    </div>
                    <div className="chatbox__footer">
                        <input
                            type="text"
                            placeholder="Write a message..."
                            value={inputValue}
                            onKeyUp={handleKeyUp}
                            onChange={(e) => setInputValue(e.target.value)}
                            ref={inputRef}
                        />
                        <button className="send__button" onClick={onSendButton}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;