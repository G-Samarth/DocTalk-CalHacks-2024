import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "../Card/Card.js";
import { Button } from "../Button/Button.js";

const PatientCalendarPage = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, date: "2024-10-21", time: "10:00 AM", doctor: "Dr. John Doe" },
  ]);
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, name: "Prescription 1", date: "2024-10-18" },
    { id: 2, name: "Prescription 2", date: "2024-10-19" },
  ]);
  const [upcomingTests, setUpcomingTests] = useState([
    { id: 1, name: "Blood Test", date: "2024-10-25" },
    { id: 2, name: "X-Ray", date: "2024-10-27" },
  ]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const [availableSlots, setAvailableSlots] = useState({});

  useEffect(() => {
    const newAvailableSlots = {};
    weekDays.forEach((day) => {
      const availableSlotsForDay = timeSlots
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1); // 1 to 3 slots per day
      newAvailableSlots[day] = availableSlotsForDay;
    });
    setAvailableSlots(newAvailableSlots);
  }, []);

  const handleSlotSelection = (day, time) => {
    setUpcomingAppointments([
      ...upcomingAppointments,
      {
        id: Date.now(),
        date: `2024-10-${20 + weekDays.indexOf(day)}`,
        time,
        doctor: "Dr. John Doe",
      },
    ]);
  };

  const launchVideoCall = () => {
    try {
      window.open("https://doc-talk.daily.co/doc-talk", "_blank");
    } catch (error) {}
  };

  return (
    <Layout userType="patient">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-700">
          Book an Appointment
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Weekly Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center">
                  <div className="font-bold mb-2">{day}</div>
                  <div className="grid grid-rows-5 gap-2">
                    {[...Array(5)].map((_, index) => {
                      const time =
                        availableSlots[day] && availableSlots[day][index];
                      return time ? (
                        <Button
                          key={`${day}-${time}`}
                          onClick={() => handleSlotSelection(day, time)}
                          className="w-full bg-green-700 hover:bg-green-800 text-white p-2 transition-all duration-200 ease-in-out group"
                        >
                          <span className="block group-hover:hidden">
                            {time}
                          </span>
                          <span className="hidden group-hover:block">Book</span>
                        </Button>
                      ) : (
                        <div
                          key={`${day}-empty-${index}`}
                          className="w-full h-10"
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {upcomingAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="bg-gray-100 p-3 rounded-md"
                  >
                    <Link
                      onClick={launchVideoCall}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {appointment.date} - {appointment.time} with{" "}
                      {appointment.doctor}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Your Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {prescriptions.map((prescription) => (
                  <li
                    key={prescription.id}
                    className="bg-gray-100 p-3 rounded-md"
                  >
                    <Link
                      to="/patient/review-pdf"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {prescription.name} - {prescription.date}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Upcoming Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {upcomingTests.map((test) => (
                  <li key={test.id} className="bg-gray-100 p-3 rounded-md">
                    {test.name} - {test.date}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientCalendarPage;
