import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Button } from "../Button/Button.js";

const DoctorsPage = () => {
  const doctors = [
    { id: 1, name: "Dr. John Doe", specialty: "Cardiologist", price: "$150" },
    {
      id: 2,
      name: "Dr. Jane Smith",
      specialty: "Dermatologist",
      price: "$130",
    },
    {
      id: 3,
      name: "Dr. Mike Johnson",
      specialty: "Pediatrician",
      price: "$120",
    },
    { id: 4, name: "Dr. Sarah Lee", specialty: "Neurologist", price: "$160" },
    {
      id: 5,
      name: "Dr. Robert Brown",
      specialty: "Orthopedist",
      price: "$140",
    },
  ];

  return (
    <Layout userType="patient">
      <div className="container mx-auto py-8 mb-20">
        <h1 className="text-3xl font-bold mb-8 text-red-700">
          Choose a Doctor
        </h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{doctor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button className="bg-green-700 hover:bg-green-800 text-white p-4">
                      <Link to="/patient/calendar">Book Now</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorsPage;
