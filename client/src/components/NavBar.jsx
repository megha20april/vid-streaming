import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkStyles = ({ isActive }) =>
    isActive
      ? "text-red-500 border-b-2 border-red-500 pb-1" // Active styles
      : "hover:text-red-500 transition duration-200"; // Default styles

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl text-red-500">
              UTube
            </NavLink>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4">
            <NavLink to="/" className={linkStyles}>
              Home
            </NavLink>
            <NavLink to="/upload" className={linkStyles}>
              Upload
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <NavLink to="/" className={linkStyles}>
              Home
            </NavLink>
            <NavLink to="/upload" className={linkStyles}>
              Upload
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
