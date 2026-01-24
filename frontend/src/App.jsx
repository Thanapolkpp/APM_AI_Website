import React, { useState } from 'react';
import Home from './pages/Home'; // ตรวจสอบ path ให้ถูกต้องว่าไฟล์ Home อยู่ที่ไหน
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleBackToHome = () => {
    setSelectedMode(null);
  };

  return (
    <div className="App font-display">
      {!selectedMode ? (
        <Home onStartChat={handleModeSelect} />
      ) : (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
          <div className="p-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-pink-600 rounded-full hover:bg-pink-700 transition-colors shadow-md">
              Back to Home
            </button>
          </div>

          <ChatWindow mode={selectedMode} />
        </div>
      )}
    </div>
  );
}

export default App;