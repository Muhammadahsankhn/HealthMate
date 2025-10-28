import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// 🧠 Initialize Gemini Client
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeReport(fileContent, fileType) {
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


        //  Create model instance first
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        //  Generate content using the model instance
        const response = await model.generateContent(prompt);

        //  Extract plain text output
        const textOutput = await response.response.text();
        // console.log("🧠 Gemini output:", textOutput);

        return {
            summary: extractSection(textOutput, "Summary"),
            romanUrdu: ensureSafetyNote(
                extractSection(textOutput, "Roman Urdu Explanation")
            ),
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

// 🧩 Extract sections
function extractSection(text, sectionTitle) {
    const regex = new RegExp(
        `\\*\\*${sectionTitle}[^*]*\\*\\*:?\\s*(.*?)(?=\\n\\n|$)`,
        "is"
    );
    const match = text.match(regex);
    return match ? match[1].trim() : "Not available.";
}

//  Add safety note
function ensureSafetyNote(text) {
    const note =
        "Ye report Gemini ne analyze ki hai, lekin final tasdeeq ke liye apne doctor se zaroor mashwara karein.";
    if (!text.toLowerCase().includes("gemini ne analyze")) {
        return `${text}\n\n${note}`;
    }
    return text;
}