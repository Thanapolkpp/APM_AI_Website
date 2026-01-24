import React, { useState } from 'react';
import { sendMessageToAI } from '../services/aiService'; // ดึงฟังก์ชันที่เราทำไว้มาใช้

const ChatWindow = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { text: "สวัสดีครับ! มีอะไรให้ผมช่วยเรื่อง AI Gen Z ไหม?", sender: "ai" }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. เพิ่มข้อความเราลงในจอทันที
        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput(''); // เคลียร์ช่องพิมพ์
        setIsLoading(true);

        try {
            // 2. ส่งไปหา AI (ผ่าน Service ที่เราทำไว้)
            const aiReplyText = await sendMessageToAI(input);

            // 3. เอาคำตอบ AI มาแปะในจอ
            const aiMessage = { text: aiReplyText, sender: "ai" };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            setMessages((prev) => [...prev, { text: "Error: คุยกับ AI ไม่ได้ครับ", sender: "ai" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.messagesArea}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.messageBubble,
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f0f0',
                            color: msg.sender === 'user' ? 'white' : 'black',
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                {isLoading && <div style={{ ...styles.messageBubble, alignSelf: 'flex-start', background: '#eee' }}>กำลังพิมพ์...</div>}
            </div>

            <div style={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="พิมพ์อะไรสักอย่าง..."
                    style={styles.input}
                />
                <button onClick={handleSend} style={styles.button} disabled={isLoading}>
                    ส่ง
                </button>
            </div>
        </div>
    );
};

// CSS แบบเขียนในไฟล์นี้เลย (ง่ายต่อการก๊อปปี้)
const styles = {
    chatContainer: {
        maxWidth: '500px',
        margin: '20px auto',
        border: '1px solid #ccc',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        fontFamily: 'Arial, sans-serif'
    },
    messagesArea: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    messageBubble: {
        padding: '10px 15px',
        borderRadius: '20px',
        maxWidth: '70%',
        lineHeight: '1.4',
    },
    inputArea: {
        padding: '10px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '10px'
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        outline: 'none'
    },
    button: {
        padding: '10px 20px',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default ChatWindow;