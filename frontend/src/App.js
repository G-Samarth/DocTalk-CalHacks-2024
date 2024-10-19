import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import CalendarPage from "./components/CalendarPage/CalendarPage";
import PatientCalendarPage from "./components/PatientCalendarPage/PatientCalendarPage";
import VideoChat from "./components/VideoChat/VideoChat";
import ReviewPDF from "./components/ReviewPDF/ReviewPDF";
import DoctorsPage from "./components/DoctorsPage/DoctorsPage";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/patient" replace />} />
        <Route path="/:userType" element={<LandingPage />} />
        <Route path="/doctor/calendar" element={<CalendarPage />} />
        <Route path="/patient/doctors" element={<DoctorsPage />} />
        <Route path="/patient/calendar" element={<PatientCalendarPage />} />
        <Route path="/doctor/video-chat" element={<VideoChat />} />
        <Route path="/patient/video-chat" element={<VideoChat />} />
        <Route path="/doctor/review-pdf" element={<ReviewPDF />} />
        <Route path="/patient/review-pdf" element={<ReviewPDF />} />
      </Routes>
    </Router>
  );
};

export default App;
