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
                />
              </CardContent>
            </Card>
          </div>
          <div className="w-1/3 space-y-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {appointments.map((appointment) => (
                    <li key={appointment.id}>
                      <Link
                        to={`/video-chat/${appointment.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {appointment.time} - {appointment.patient}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Pending Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pendingReviews.map((review) => (
                    <li key={review.id}>
                      <Link
                        to={`/review-pdf/${review.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {review.patient} - {review.date}
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
