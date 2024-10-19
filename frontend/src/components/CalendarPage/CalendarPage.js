import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "../Card/Card.js";
import Layout from "../Layout/Layout.js";
import "react-day-picker/dist/style.css";

const CalendarPage = () => {
  const location = useLocation();
  const isDoctor = location.pathname.includes("/doctor");
  const userType = isDoctor ? "doctor" : "patient";

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Pre-defined appointments for different dates
  const allAppointments = {
    "2024-10-19": [
      { id: 1, time: "09:00 AM", patient: "John Doe", doctor: "Dr. Smith" },
      { id: 2, time: "11:30 AM", patient: "Jane Smith", doctor: "Dr. Smith" },
    ],
    "2024-10-20": [
      { id: 3, time: "02:00 PM", patient: "Bob Johnson", doctor: "Dr. Smith" },
      { id: 4, time: "04:30 PM", patient: "Alice Brown", doctor: "Dr. Smith" },
    ],
    "2024-10-21": [
      {
        id: 5,
        time: "10:00 AM",
        patient: "Charlie Davis",
        doctor: "Dr. Smith",
      },
    ],
  };

  const [prescriptionsAndDiagnosis] = useState([
    {
      id: 1,
      type: "Prescription",
      description: "Amoxicillin 500mg, 3 times daily for 7 days",
      date: "2024-10-18",
    },
    {
      id: 2,
      type: "Diagnosis",
      description: "Acute sinusitis",
      date: "2024-10-18",
    },
    {
      id: 3,
      type: "Prescription",
      description: "Ibuprofen 400mg, as needed for pain",
      date: "2024-10-19",
    },
  ]);

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return allAppointments[dateString] || [];
  };

  return (
    <Layout userType={userType}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-700">
          {isDoctor ? "Doctor's Schedule" : "Patient's Calendar"}
        </h1>
        <div className="flex gap-8">
          <div className="w-2/3">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="mx-auto"
                  classNames={{
                    months: "flex flex-col",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-xl font-bold",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-10 w-10 bg-transparent p-2 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-500 w-14 font-normal text-lg",
                    row: "flex w-full mt-2",
                    cell: "text-center text-lg p-0 relative [&:has([aria-selected])]:bg-red-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100",
                    day_selected:
                      "bg-red-700 text-white hover:bg-red-800 hover:text-white focus:bg-red-700 focus:text-white",
                    day_today: "bg-gray-200 text-gray-900",
                    day_outside: "text-gray-400 opacity-50",
                    day_disabled: "text-gray-400 opacity-50",
                    day_range_middle:
                      "aria-selected:bg-red-100 aria-selected:text-gray-900",
                    day_hidden: "invisible",
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="w-1/3 space-y-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold mb-4">
                  {isDoctor ? "Appointments" : "Upcoming Appointments"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {getAppointmentsForDate(selectedDate).map((appointment) => (
                    <li
                      key={appointment.id}
                      className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Link
                        to={`/${userType}/video-chat`}
                        className="text-blue-600 hover:text-blue-800 block"
                      >
                        <span className="font-semibold">
                          {appointment.time}
                        </span>{" "}
                        - {isDoctor ? appointment.patient : appointment.doctor}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold mb-4">
                  {isDoctor ? "Pending Reviews" : "Prescriptions and Diagnosis"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {isDoctor
                    ? prescriptionsAndDiagnosis.map((item) => (
                        <li
                          key={item.id}
                          className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Link
                            to={`/doctor/review-pdf`}
                            className="text-blue-600 hover:text-blue-800 block"
                          >
                            <span className="font-semibold">{item.type}</span> -{" "}
                            {item.date}
                          </Link>
                        </li>
                      ))
                    : prescriptionsAndDiagnosis.map((item) => (
                        <li
                          key={item.id}
                          className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Link
                            to={`/patient/review-pdf`}
                            className="text-blue-600 hover:text-blue-800 block"
                          >
                            <span className="font-semibold">{item.type}</span> -{" "}
                            {item.date}
                          </Link>
                        </li>
                      ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
