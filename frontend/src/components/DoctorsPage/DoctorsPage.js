import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "../Card/Card.js";
import { Button } from "../Button/Button.js";

const DoctorsPage = () => {
  const doctors = [
    { id: 1, name: "Dr. John Doe", specialty: "Cardiologist" },
    { id: 2, name: "Dr. Jane Smith", specialty: "Dermatologist" },
    { id: 3, name: "Dr. Mike Johnson", specialty: "Pediatrician" },
  ];

  return (
    <Layout userType="patient">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-700">
          Choose a Doctor
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardHeader>
                <CardTitle>{doctor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{doctor.specialty}</p>
                <Button>
                  <Link to={`/patient/calendar`}>Book Appointment</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorsPage;
