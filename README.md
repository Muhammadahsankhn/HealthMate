# HealthMate

HealthMate is a MERN Stack application designed to solve the chaos of managing physical medical records. It provides a secure, digital home for medical reports and uses Google's Gemini AI to make them easy to understand for everyone.

## Problem Statement

In almost every household, there is at least one patient who requires regular medical care. Traditionally, families manage these records by keeping physical files, which leads to several issues. When it is time to visit a doctor, families often scramble to find specific reports hidden in thick, disorganized bundles. Critical reports can get lost, misplaced, or forgotten at home, leaving the doctor without the patient's full history. Furthermore, even when the reports are available, understanding the complex medical terminology within them is often difficult for the average person.

## The Solution

HealthMate replaces the physical file bundle with a secure, intelligent web platform that addresses these challenges:

- **Digital & Secure:** Users can upload their reports to the web, making them accessible instantly from anywhere. This eliminates the need to carry heavy files or worry about losing papers.
- **AI Analyzer:** The application uses Google Gemini AI to read uploaded reports and generate a simple English summary. This ensures patients understand their condition before meeting the doctor.
- **Doctor Assistance:** The AI automatically generates a list of relevant questions for the patient to ask their doctor, ensuring they get the most out of their appointment.
- **Vitals History:** A dedicated feature allows users to log and track daily vitals such as blood pressure, sugar levels, and heart rate, creating a permanent, searchable history of health trends.

## Key Features

- **Smart Report Analysis:** Users can upload a PDF or image, and the system extracts the text to summarize findings using AI.
- **Instant Clarity:** The system translates complex medical jargon into plain, simple language for better understanding.
- **Daily Vitals Log:** Users can record weight, blood pressure, and sugar levels to maintain a digital history log for their doctor.
- **Secure Profile:** A user-specific dashboard ensures that private medical data is only accessible to the account owner.
- **Cloud Storage:** All reports are stored safely on Cloudinary, ensuring they are never lost.

## Tech Stack

**Frontend**
- React.js (Vite)
- Tailwind CSS (Styling)
- Framer Motion (Smooth Animations)
- Axios (API Integration)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- JWT (Secure Authentication)

**AI & Cloud Services**
- **Google Gemini API:** Used for medical text analysis and simplification.
- **Cloudinary:** Used for secure cloud storage of medical documents.
- **pdf-parse:** Used to extract text from digital PDF reports for analysis.

## Environment Variables

To run this project locally, you will need to create a .env file in the server directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/healthMate
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_google_gemini_key





Clone the repository:
git clone [https://github.com/muhammadahsankhn/healthmate.git]
cd healthmate


Setup the Backend:
cd server
npm install
npm start



Setup the Frontend:
cd client
npm install
npm run dev
