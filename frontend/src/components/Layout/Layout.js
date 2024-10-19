import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../Button/Button.js";
import {
  Search,
  User,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  Globe,
} from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();
  const isDoctor = location.pathname.includes("/doctor");
  const logoLink = isDoctor ? "/doctor" : "/patient";

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
          <Link to={logoLink} className="text-3xl font-bold text-red-700">
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
              <Link to={`${logoLink}/calendar`}>Calendar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">HealthAssist</h3>
              <p className="mb-4">
                Transforming Healthcare, One Consultation at a Time
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Globe size={20} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={logoLink}
                    className="text-gray-400 hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={`${logoLink}/about`}
                    className="text-gray-400 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to={`${logoLink}/services`}
                    className="text-gray-400 hover:text-white"
                  >
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link
                    to={`${logoLink}/contact`}
                    className="text-gray-400 hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            {/* ... rest of the footer content ... */}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthAssist. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
