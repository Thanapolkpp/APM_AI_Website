// pages/ChatPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
    // useParams จะดึงค่าจาก /chat/bro มาให้ โดย mode จะเท่ากับ 'bro'
    const { mode } = useParams();

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            {/* ส่ง mode ที่ได้จาก URL ไปให้ ChatWindow */}
            <ChatWindow mode={mode} />
        </div>
    );
};

export default Chat;