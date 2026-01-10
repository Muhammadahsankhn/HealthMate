const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

// 🧠 Initialize Gemini Client
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a consistent model version
const MODEL_NAME = "gemini-2.5-flash"; 

// ===================================================================
// 🩺 1. Analyze uploaded medical reports (PDF/Image/Text)
// ===================================================================
async function analyzeReport(fileContent, fileType) {
  try {
    let prompt = `
You are a smart medical assistant. Analyze the following medical report carefully:
${fileContent}

Please return your answer in this exact structure:
1️⃣ **Summary (in English):** A short summary of the report.
2️⃣ **Roman Urdu Explanation:** Explain the report in easy Roman Urdu (not Urdu script, use English letters).
   Example: "Ye report Gemini ne analyze ki hai. Isme blood sugar thodi zyada hai aur vitamin D kam hai."
   Always end with this note:
   "Ye report Gemini ne analyze ki hai, lekin final tasdeeq ke liye apne doctor se zaroor mashwara karein."
3️⃣ **Doctor Questions:** Suggest 3 questions that a patient should ask their doctor based on this report.
`;

    if (fileType?.includes("pdf")) {
      prompt = `This is a medical report (PDF). ${prompt}`;
    } else if (fileType?.includes("image")) {
      prompt = `This is a medical image or prescription. ${prompt}`;
    } else {
      prompt = `This is a general health document. ${prompt}`;
    }

    const model = ai.getGenerativeModel({ model: MODEL_NAME });
    const response = await model.generateContent(prompt);
    const textOutput = response.response.text();

    return {
      summary: extractSection(textOutput, "Summary (in English)"), // Match prompt label exactly
      romanUrdu: ensureSafetyNote(extractSection(textOutput, "Roman Urdu Explanation")),
      doctorQuestions: extractSection(textOutput, "Doctor Questions"),
      fullResponse: textOutput,
    };
  } catch (error) {
    console.error("Gemini AI error:", error);
    return {
      summary: "AI analysis failed.",
      romanUrdu: "AI report ka tajziya karne mein masla aya hai.",
      doctorQuestions: "No doctor questions available.",
    };
  }
}

// ===================================================================
// 🩸 2. Analyze Vitals
// ===================================================================
async function analyzeVitals(vitals) {
  try {
    const { bloodPressure, bloodSugar, weight, heartRate } = vitals;

    const prompt = `
You are a friendly AI health assistant.

User's latest vitals:
- Blood Pressure: ${bloodPressure}
- Blood Sugar: ${bloodSugar}
- Weight: ${weight} kg
- Heart Rate: ${heartRate} bpm

Please provide a short report in this exact structure:
1️⃣ **Summary (English):** Explain what these vitals mean.
2️⃣ **Roman Urdu Suggestion:** Give friendly health tips in Roman Urdu.
3️⃣ **Doctor Advice:** Suggest when the user should consult a doctor.
`;

    const model = ai.getGenerativeModel({ model: MODEL_NAME });
    const response = await model.generateContent(prompt);
    const textOutput = response.response.text();

    return {
      summary: extractSection(textOutput, "Summary (English)"),
      romanUrdu: ensureSafetyNote(extractSection(textOutput, "Roman Urdu Suggestion")),
      doctorAdvice: extractSection(textOutput, "Doctor Advice"),
      fullResponse: textOutput,
    };
  } catch (error) {
    console.error("Gemini AI (Vitals) error:", error);
    return {
      summary: "AI analysis failed.",
      romanUrdu: "AI report ka tajziya karne mein masla aya hai.",
      doctorAdvice: "No advice available.",
    };
  }
}

// ===================================================================
// 💬 3. Chat with AI (based on report + user question)
// ===================================================================
async function chatWithAI(dbRecord, userMessage) {
  try {
    // FIX: Convert DB Object to String. 
    // If we pass the object directly, it becomes "[object Object]"
    let contextString = "";

    if (dbRecord) {
        // Try to prioritize the AI's previous analysis if it exists
        const analysis = dbRecord.aiSummary || dbRecord.summary || dbRecord.romanUrdu || dbRecord.aiRomanUrdu;
        
        if (analysis) {
             // Combine previous analysis with raw data
             contextString = `Previous Analysis:\n${analysis}\n\nRaw Data:\n${JSON.stringify(dbRecord, null, 2)}`;
        } else {
             // If no analysis exists, just dump the raw data (e.g. Vitals numbers)
             contextString = JSON.stringify(dbRecord, null, 2);
        }
    } else {
        contextString = "No previous medical data available.";
    }

    // Truncate if too long (Basic safety)
    if (contextString.length > 5000) contextString = contextString.substring(0, 5000) + "...";

    const model = ai.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
You are a helpful AI medical assistant named 'Health Mate'.

Patient's Health Record / Context:
${contextString}

User Question:
"${userMessage}"

Instructions:
1. Answer clearly using the Context provided above.
2. Mix simple English & Roman Urdu in your tone.
3. If the user asks about something NOT in the context, give a general medical answer but mention you don't see it in their report.
4. Always end with: "Final confirm doctor se zaroor karain."
`;

    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Mujhe abhi jawab generate karne mein masla horaha hai. Thori dair baad try karein.";
  }
}

// ===================================================================
// 🧩 Utility functions
// ===================================================================
function extractSection(text, sectionTitle) {
  // Regex looks for **Title** ... content ... until double newline
  // Removed strict colon expectation to make it more flexible
  const regex = new RegExp(
    `\\*\\*${sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?\\*\\*:?\\s*(.*?)(?=\\n\\n|$)`,
    "is"
  );
  const match = text.match(regex);
  return match ? match[1].trim() : "Not available.";
}

function ensureSafetyNote(text) {
  const note =
    "Ye report Gemini ne analyze ki hai, lekin final tasdeeq ke liye apne doctor se zaroor mashwara karein.";
  if (text && !text.toLowerCase().includes("gemini ne analyze")) {
    return `${text}\n\n${note}`;
  }
  return text || "Not available.";
}

module.exports = {
  analyzeReport,
  analyzeVitals,
  chatWithAI,
};