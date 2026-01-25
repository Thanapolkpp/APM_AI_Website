import React from 'react';
import Navbar from '../components/Navbar';
import ModeCard from '../components/ModeCard'; // Import เข้ามา
import Footer from '../components/footer';
import Login from '../pages/Login';
import { useNavigate } from "react-router-dom";

import { AiOutlineCodepenCircle } from "react-icons/ai";   // Import เข้ามา

const Home = ({ onStartChat }) => {
  const navigate = useNavigate();

  // ข้อมูล Config ของแต่ละโหมด (แยกออกมาให้โค้ด HTML สะอาด)
  const modes = [
    {
      id: 'bro',
      title: 'Bro Mode',
      icon: '🧢',
      description: "Chill vibes only. Let's tackle that assignment without the stress. We got this, man.",
      buttonIcon: 'arrow_forward',
      colors: {
        bg: 'bg-bro-blue dark:bg-blue-900/20',
        hoverBorder: 'hover:border-blue-200',
        shadow: 'shadow-soft-blue',
        iconBg: 'bg-white/80 dark:bg-blue-800/40',
        text: 'text-blue-700/80 dark:text-blue-300',
        button: 'bg-white dark:bg-blue-600 dark:text-white text-blue-600 group-hover:bg-blue-50'
      }
    },
    {
      id: 'girl',
      title: 'Cute Girl Mode',
      icon: '🎀',
      description: "Hey! ✨ Ready to smash those goals together? You're doing amazing! Let's get to work.",
      buttonIcon: 'favorite',
      colors: {
        bg: 'bg-girl-pink dark:bg-pink-900/20',
        hoverBorder: 'hover:border-pink-200',
        shadow: 'shadow-soft-pink',
        iconBg: 'bg-white/80 dark:bg-pink-800/40',
        text: 'text-pink-700/80 dark:text-pink-300',
        button: 'bg-white dark:bg-pink-600 dark:text-white text-pink-600 group-hover:bg-pink-50'
      }
    },
    {
      id: 'nerd',
      title: 'Nerd Mode',
      icon: '🧪',
      description: "Let's dive deep into the data. Optimization is the primary key to academic excellence.",
      buttonIcon: 'calculate',
      colors: {
        bg: 'bg-nerd-purple dark:bg-purple-900/20',
        hoverBorder: 'hover:border-purple-200',
        shadow: 'shadow-soft-purple',
        iconBg: 'bg-white/80 dark:bg-purple-800/40',
        text: 'text-purple-700/80 dark:text-purple-300',
        button: 'bg-white dark:bg-purple-600 dark:text-white text-purple-600 group-hover:bg-purple-50'
      }
    }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#333333] dark:text-gray-100 transition-colors duration-300 font-display">
      <div className="layout-container flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-50 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-2xl"><AiOutlineCodepenCircle /></span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-none">Uni AI</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Student Companion</p>
            </div>
          </div>

          <Navbar />

          <div className="flex items-center gap-4">
            <button className="size-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="size-10 rounded-full bg-cover bg-center border-2 border-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-80 transition-opacity"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde")',
              }}
              title="Go to Login"
              aria-label="Go to login"
            ></button>

          </div>

        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center px-6 py-12 max-w-7xl mx-auto w-full">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Your AI friend for uni life <span className="text-primary">✨</span>
            </h2>
            <p className="text-lg md:text-xl font-medium text-gray-500 dark:text-gray-400">How can I help you today, Bestie?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-24">
            {modes.map((mode) => (
              <ModeCard
                key={mode.id}
                title={mode.title}
                icon={mode.icon}
                description={mode.description}
                buttonIcon={mode.buttonIcon}
                colors={mode.colors}
                onClick={() => navigate(`/chat/${mode.id}`)}
              />
            ))}
          </div>
          <Footer />

        </main>
      </div>
    </div>
  );
};

export default Home;