# DocTalk-CalHacks-2024

**Doctor's Assistant AI** is a real-time assistant designed to automate and accelerate doctors’ daily administrative tasks. This project aims to simplify and speed up patient consultations by instantly summarizing doctor-patient interactions, generating prescriptions, scheduling follow-ups, and providing all necessary patient information in one place. The goal is to save doctors time and improve patient care, especially in high-demand healthcare systems.

---

## **Features**
- **Real-time Summarization**: Automatically transcribes and summarizes patient consultations.
- **Instant Prescriptions**: Generates prescriptions immediately after the consultation.
- **Appointment Scheduling**: Schedules follow-up appointments in real time.
- **Simplified Medical Information**: Converts complex medical jargon into patient-friendly language.
- **Centralized Patient Information**: All patient details are stored in one place for easy access by healthcare providers.

---

## **Project Structure**
The project is divided into two main parts:

- **Backend**: Handles data processing, AI-powered transcription, and data storage.
- **Frontend**: User interface for doctors to review summaries, manage patient information, and schedule appointments.

---

## **Tech Stack**
- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: MongoDB
- **AI Processing**: Machine Learning models (e.g., NLP for summarization)

---

## **Installation and Running the Application**

Follow these steps to get the application up and running:

### **1. Backend Setup**
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   The backend server should now be running at `http://localhost:4000`.

### **2. Frontend Setup**
1. In a new terminal window, navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm start
   ```
   The frontend should now be running at `http://localhost:3000`.

---

## **Usage**
1. **Start Consultation**: Doctors start a patient consultation, which is automatically recorded.
2. **Real-time Processing**: The AI processes the audio and generates a consultation summary, prescription, and appointment scheduling.
3. **Review**: Doctors can review, edit, and confirm the AI-generated information before sending it to the patient.

---

## **Contributing**
If you would like to contribute to this project, please fork the repository and submit a pull request. We welcome improvements, bug fixes, and suggestions!

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
