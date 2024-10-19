import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../Button/Button.js";
import { Search, User } from "lucide-react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-red-700 text-white py-1 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <span>Transforming Healthcare, One Consultation at a Time</span>
          <span>About Us | Contact</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-red-700">
            HealthAssist
          </Link>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-full w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-red-700"
            >
              <User className="mr-2 h-5 w-5" />
              My Account
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-red-700"
            >
              <Link to="/calendar">Calendar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p>
              Dedicated to improving healthcare efficiency and patient care
              through innovative, AI-driven solutions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p>
              Have questions? Reach out at support@healthassist.com or call us
              at (123) 456-7890.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Privacy Policy</h3>
            <p>
              We prioritize patient confidentiality and adhere to the highest
              standards in data security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
