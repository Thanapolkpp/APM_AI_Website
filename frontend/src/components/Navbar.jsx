import React from 'react';
import { NavLink } from 'react-router-dom'; // 1. Import NavLink

const Navbar = () => {
  // สร้าง function เพื่อจัดการ class ปกติ และ class เมื่อหน้านั้น Active (อยู่หน้านั้น)
  const linkClasses = ({ isActive }) =>
    `px-6 py-2 text-sm font-semibold transition-colors ${isActive
      ? 'text-primary' // สีเมื่ออยู่หน้านั้น (Active)
      : 'hover:text-primary text-gray-600 dark:text-gray-300' // สีปกติ
    }`;

  return (
    <nav className="hidden md:flex items-center bg-white/50 dark:bg-white/5 backdrop-blur-md px-2 py-2 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">

      {/* 2. ใช้ NavLink และเปลี่ยน href เป็น to */}
      <NavLink to="/" className={linkClasses}>
        Home
      </NavLink>

      <NavLink to="/planner" className={linkClasses}>
        Planner
      </NavLink>

      <NavLink to="/settings" className={linkClasses}>
        Settings
      </NavLink>
      <NavLink to="/About" className={linkClasses}>
        About
      </NavLink>

    </nav>

  );
};

export default Navbar;