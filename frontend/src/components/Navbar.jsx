import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PiAtomBold, PiBackspaceBold } from "react-icons/pi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // ฟังก์ชันจัดการ Class สำหรับ NavLink (Active / Normal)
  const linkClasses = ({ isActive }) =>
    `px-6 py-2 text-sm font-semibold transition-all duration-200 block md:inline-block ${isActive
      ? 'text-primary bg-primary/5 md:bg-transparent rounded-xl' // สไตล์เมื่ออยู่ที่หน้านี้
      : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5 md:hover:bg-transparent rounded-xl' // สไตล์ปกติ
    }`;

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <div className="relative">
      {/* --- เมนูสำหรับ Desktop (จอใหญ่) --- */}
      <nav className="hidden md:flex items-center bg-white/50 dark:bg-white/5 backdrop-blur-md px-2 py-2 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClasses}>
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* --- ปุ่ม Hamburger สำหรับ Mobile (จอเล็ก) --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600 dark:text-gray-300 focus:outline-none transition-transform active:scale-90"
        aria-label="Toggle menu"
      >
        {isOpen ? <PiBackspaceBold size={28} /> : <PiAtomBold size={28} />}
      </button>

      {/* --- Mobile Dropdown Menu (แสดงเมื่อคลิกปุ่ม) --- */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* กล่องเมนู Dropdown */}
          <div className="absolute top-16 right-0 w-56 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl md:hidden z-50 
  before:content-[''] before:absolute before:-top-2 before:right-4 before:w-4 before:h-4 before:bg-white dark:before:bg-gray-900 before:rotate-45 before:border-l before:border-t before:border-gray-100 dark:before:border-gray-800">
            <div className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClasses}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;