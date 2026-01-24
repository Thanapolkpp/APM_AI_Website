import React from 'react';
import ChatWindow from './components/ChatWindow'; // เรียกใช้หน้าแชท
import './styles/App.css'; // เรียกใช้ CSS

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', marginTop: '20px', color: 'white' }}>
        AI for Gen Z Chatbot 🤖
      </h1>
      <ChatWindow />
    </div>
  );
}

export default App;