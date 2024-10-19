import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "../Card/Card.js";
import Layout from "../Layout/Layout.js";
import "react-day-picker/dist/style.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [appointments] = useState([
    { id: 1, time: "09:00 AM", patient: "John Doe" },
    { id: 2, time: "11:30 AM", patient: "Jane Smith" },
    { id: 3, time: "02:00 PM", patient: "Bob Johnson" },
  ]);
  const [pendingReviews] = useState([
    { id: 1, patient: "Alice Brown", date: "2023-10-18" },
    { id: 2, patient: "Charlie Davis", date: "2023-10-19" },
  ]);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-700">
          Doctor's Schedule
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
                  selected={date}
                  onSelect={setDate}
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
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {appointments.map((appointment) => (
                    <li
                      key={appointment.id}
                      className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Link
                        to={`/video-chat/${appointment.id}`}
                        className="text-blue-600 hover:text-blue-800 block"
                      >
                        <span className="font-semibold">
                          {appointment.time}
                        </span>{" "}
                        - {appointment.patient}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold mb-4">
                  Pending Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pendingReviews.map((review) => (
                    <li
                      key={review.id}
                      className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Link
                        to={`/review-pdf/${review.id}`}
                        className="text-blue-600 hover:text-blue-800 block"
                      >
                        <span className="font-semibold">{review.patient}</span>{" "}
                        - {review.date}
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
