**HealthMate:** Your Digital Medical Record & AI Assistant
HealthMate is a MERN Stack application designed to solve the chaos of managing physical medical records. It provides a secure, digital home for medical reports and uses Google's Gemini AI to make them easy to understand for everyone.


**The Real-World Problem:**
In almost every household, there is at least one patient who needs regular medical care.
The Struggle: When it's time to visit the doctor, families scramble to find specific reports hidden in thick, disorganized bundles of physical files.
Lost Information: Critical reports often get lost, misplaced, or forgotten at home, meaning the doctor doesn't have the full history.
Confusion: Even when found, understanding the complex medical terms in lab reports is difficult for the average person.


**Our Solution**
HealthMate replaces the physical file bundle with a secure, intelligent web platform:
Digital & Secure: Users upload their reports to the web. No more carrying heavy files or losing papers; everything is accessible instantly from anywhere.
AI Analyzer: We use Google Gemini AI to read the report and generate a Simple English Summary, so patients understand their condition before meeting the doctor.
Doctor Assistance: The AI automatically generates a list of Questions to Ask the Doctor, ensuring patients get the most out of their appointment.
Vitals History: A dedicated feature to log and track daily vitals (Blood Pressure, Sugar, Heart Rate), creating a permanent, searchable history of the patient's health trends.



**Tech Stack**

**Frontend:**
React.js (Vite)
Tailwind CSS (Styling)
Framer Motion (Smooth Animations)
Axios (API Integration)

**Backend:**
Node.js & Express.js
MongoDB & Mongoose (Database)
JWT (Secure Authentication)


**AI & Cloud Services:**
Google Gemini API: For medical text analysis and simplification.
Cloudinary: Secure cloud storage for medical documents.
pdf-parse: To extract text from digital PDF reports for analysis.




**Key Features**
Smart Report Analysis: Upload a PDF or Image. The system extracts the text and uses AI to summarize findings.
Instant Clarity: Translates medical jargon into plain, simple language.
Daily Vitals Log: Record weight, BP, and sugar levels to maintain a digital history log for the doctor.
Secure Profile: User-specific dashboard ensuring private medical data is only accessible to the account owner.
Cloud Storage: Reports are stored safely on Cloudinary, so they are never lost.
