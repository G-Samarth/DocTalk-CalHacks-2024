import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../Card/Card.js";
import { Button } from "../Button/Button.js";
import { Link } from "react-router-dom";

import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  Clock,
  Smartphone,
  Database,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
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
          <div className="text-3xl font-bold text-red-700">HealthAssist</div>
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

      {/* Main navigation */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-red-700"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-red-700"
            >
              How It Works
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-red-700"
            >
              Pricing
            </Button>
          </div>
          <Button className="bg-red-700 hover:bg-red-800 text-white">
            <MapPin className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto flex items-center">
          <div className="w-1/2 pr-8">
            <h1 className="text-4xl font-bold mb-4 text-red-700">
              Transforming Healthcare, One Consultation at a Time
            </h1>
            <p className="text-xl mb-8">
              Real-time doctor's assistant that automates consultations,
              diagnoses, prescriptions, and appointments—saving time for doctors
              and improving patient care.
            </p>
            <Button
              size="lg"
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Get Started in Minutes
            </Button>
          </div>
          <div className="w-1/2">
            <img
              src="/resources/landing-pic.jpg"
              alt="Medical consultation"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Why This Application Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why This Application?
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-6 w-6 text-red-700" /> Save Time for
                  Doctors
                </CardTitle>
              </CardHeader>
              <CardContent>
                Current methods of documenting doctor-patient interactions take
                hours, sometimes a full day, due to offshore transcriptions. Our
                real-time AI assistant cuts that time down to minutes, freeing
                up doctors to focus on patient care instead of paperwork.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-6 w-6 text-red-700" /> Improve
                  Patient Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                With more time to spend with patients, doctors can see more
                individuals, especially in emergency cases where delays are
                common. Faster treatment, better care, and quicker access to
                prescriptions all lead to an improved patient experience.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-6 w-6 text-red-700" /> Centralized
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                All patient details, including histories, notes, and
                prescriptions, are stored in one place for easy access. No more
                hunting for files or waiting for summaries—everything is at your
                fingertips in real-time.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            How to Use This Application?
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Start the Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                Simply begin the patient consultation. Our platform records the
                interaction and captures key medical details automatically.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. Automatic Summarization</CardTitle>
              </CardHeader>
              <CardContent>
                Once the meeting concludes, the AI instantly generates a summary
                of the conversation, along with prescriptions and follow-up
                details. No manual intervention required.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>3. Review and Confirm</CardTitle>
              </CardHeader>
              <CardContent>
                The doctor quickly reviews the AI-generated details for
                accuracy, then approves or makes minor edits. The final report
                is sent to the patient instantly.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Pricing</h2>
          <div className="grid grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4 text-red-700">
                  $49/month
                </p>
                <p className="mb-4">
                  Best for solo practitioners and small clinics. Includes:
                </p>
                <ul className="list-disc list-inside">
                  <li>Real-time summaries</li>
                  <li>Basic appointment scheduling</li>
                  <li>Secure data storage</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pro Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4 text-red-700">
                  $99/month
                </p>
                <p className="mb-4">
                  Perfect for mid-sized practices. Includes:
                </p>
                <ul className="list-disc list-inside">
                  <li>All Basic features</li>
                  <li>Multi-doctor support</li>
                  <li>Advanced analytics & patient management</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4 text-red-700">
                  Custom Pricing
                </p>
                <p className="mb-4">
                  Ideal for hospitals and large organizations. Includes:
                </p>
                <ul className="list-disc list-inside">
                  <li>Unlimited usage and features</li>
                  <li>Custom integrations with your existing systems</li>
                  <li>Priority support & enhanced security features</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-red-700">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl mb-8 text-white">
            Join the healthcare revolution and streamline your consultations
            today.
          </p>
          <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100">
            Get Started Now
          </Button>
        </div>
      </section>

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

export default LandingPage;
