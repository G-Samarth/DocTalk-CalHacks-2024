import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage.js";
import CalendarPage from "./components/CalendarPage/CalendarPage.js";
import VideoChat from "./components/VideoChat/VideoChat.js";
import ReviewPDF from "./components/ReviewPDF/ReviewPDF.js";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/video-chat/:id" element={<VideoChat />} />
        <Route path="/review-pdf/:id" element={<ReviewPDF />} />
      </Routes>
    </Router>
  );
};

export default App;
