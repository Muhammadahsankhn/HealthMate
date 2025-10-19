// AI client for Gemini (configurable provider). This file implements two exported
// functions: analyzeFile(fileUrl) -> bilingual summary object, and
// chatWithAi({ message, context }) -> { text, raw }.
//
// Configuration via env:
// - GEMINI_API_PROVIDER: 'google' (example) or 'stub' (default)
// - GEMINI_API_KEY: API key / bearer token
// - GEMINI_MODEL: model id (e.g., 'gemini-2.5-flash`')

const axios = require('axios');
const pdfParse = require('pdf-parse');
const path = require('path');

const PROVIDER = (process.env.GEMINI_API_PROVIDER || process.env.GOOGLE_GEMINI_PROVIDER || 'stub').toString().trim().toLowerCase();
const API_KEY = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_KEY || '').toString().trim();
const MODEL = ('gemini-2.5-flash').toString().trim();

// Provider helper: Google Generative Language REST API
async function callGoogleRest(prompt, opts = {}) {
  if (!API_KEY) throw new Error('GOOGLE_GEMINI_KEY (or GEMINI_API_KEY) not set');
  // v1beta2 generateText endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/${MODEL}:generateText`;
  const payload = {
    prompt: { text: prompt },
    temperature: opts.temperature || 0.2,
    maxOutputTokens: opts.maxTokens || 512,
  };
  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    timeout: opts.timeout || 60000,
  });
  // Try to extract text from common response fields used by Generative Language API
  const d = res.data || {};
  // Log non-OK HTTP metadata for debugging
  if (res.status && res.status >= 400) {
    console.warn('callGoogleRest: non-200 status', res.status, res.statusText, d);
  }
  // 1) candidates (may contain an object with 'content' or 'output')
  if (d.candidates && d.candidates.length) {
    const c = d.candidates[0];
    if (typeof c.output === 'string') return c.output;
    if (typeof c.content === 'string') return c.content;
    if (Array.isArray(c.content) && c.content.length) {
      const parts = c.content.map(p => p.text || p.content || JSON.stringify(p)).filter(Boolean);
      if (parts.length) return parts.join('\n');
    }
  }
  // 2) output array
  if (d.output && Array.isArray(d.output) && d.output.length) {
    const o = d.output[0];
    if (typeof o.content === 'string') return o.content;
    if (Array.isArray(o.content)) {
      const parts = o.content.map(p => p.text || JSON.stringify(p)).filter(Boolean);
      if (parts.length) return parts.join('\n');
    }
  }
  // 3) fallback to any text-like field
  if (typeof d.text === 'string') return d.text;
  // 4) last resort - stringify the whole response
  return JSON.stringify(d);
}

async function providerGenerate(prompt, opts = {}) {
  if (PROVIDER === 'google') {
    return await callGoogleRest(prompt, opts);
  }
  // stub fallback
  return `MOCK: ${prompt.slice(0, 200)}`;
}

// Public: analyzeFile(fileUrl)
// Sends a structured instruction to the model to produce bilingual summaries
// and structured arrays (doctorQuestions, dietTips, homeRemedies).
const analyzeFile = async (fileUrl) => {
  // If the file is a PDF, download and extract text first. Otherwise (image), we fall back to stub or ask the model
  let extractedText = null;
  try {
    const lower = String(fileUrl || '').toLowerCase();
    if (lower.endsWith('.pdf')) {
      const resp = await axios.get(fileUrl, { responseType: 'arraybuffer', timeout: 60000 });
      const data = await pdfParse(resp.data);
      extractedText = data && data.text ? String(data.text).trim() : null;
    }
  } catch (e) {
    console.warn('analyzeFile: could not download/parse PDF, falling back to model prompt', e && e.message ? e.message : e);
  }

  const instruction = `You are HealthMate, a bilingual medical assistant. ${extractedText ? 'Here is the extracted report text:\n' + extractedText : 'Read the following file URL and'} produce a VALID JSON object ONLY (no extra commentary) with these keys:
  - englishSummary (concise English summary ~100-150 words)
  - romanUrduSummary (short Roman Urdu summary 1-2 short paragraphs)
  - fullAnswerEnglish (a full detailed answer in English, 3-6 short paragraphs)
  - fullAnswerRoman (a full detailed answer in Roman Urdu, 3-6 short paragraphs)
  - summary (a very short 1-2 sentence summary suitable for quick viewing)
  - highlights (array of 3-6 short highlights of abnormal findings, e.g., "WBC high")
  - doctorQuestions (array of short questions to ask the doctor)
  - dietTips (array)
  - homeRemedies (array)
  - disclaimer (a single short sentence reminding to consult a doctor)
  Make sure the output is valid JSON with these keys only. File URL: ${fileUrl}`;

  if (PROVIDER === 'stub' || !API_KEY) {
    // richer mock response to be useful in UI while real provider isn't configured
    return {
      englishSummary: `This is a mock summary generated for the file at ${fileUrl}. The results indicate some elevated markers that may need follow-up with a clinician. Key recommendations: repeat the test in 1-2 weeks, monitor symptoms, and share any changes with your doctor.`,
      romanUrduSummary: `Yeh mock khulasa hai jo ${fileUrl} ke liye banaya gaya hai. Kuch neshan barhawa nazar aatay hain, doctor se mushwara zaroor karain. Test do haftay mein dobara karwayen aur symptoms dekhtay rahain.`,
      fullAnswerEnglish: `Full English analysis: This report shows some abnormal markers. Detailed breakdown: ... (longer paragraphs). Recommendations and next steps are to consult a clinician, consider repeating specific tests, and review medications.`,
      fullAnswerRoman: `Full Roman Urdu analysis: Ye report kuch ghair mamooli nishanian dikhati hai. Tafseeli taur par: ... (lambi paragraphs). Agla qadam doctor say mashwara karna chahiye aur zaroori tests dohrana.`,
      summary: `Mock short summary: possible abnormalities detected. Consult doctor.`,
      highlights: ['WBC elevated', 'Hemoglobin low'],
      doctorQuestions: ['When did these symptoms start?', 'Any recent medications or illnesses?'],
      dietTips: ['Reduce salt and processed food', 'Increase water and fresh vegetables'],
      homeRemedies: ['Rest well, stay hydrated', 'Avoid strenuous activity until cleared'],
      disclaimer: 'Always consult your doctor before making any decision.'
    };
  }

  try {
    const raw = await providerGenerate(instruction, { maxTokens: 800 });
    // Try to parse JSON from model output if possible
    let parsed = null;
    try {
      // model may return JSON directly
      parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {
      // fallback: attempt to extract JSON substring
      const jsonMatch = String(raw).match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    }

    if (parsed) {
      return {
        englishSummary: parsed.englishSummary || parsed.english_summary || parsed.summary || String(raw).slice(0, 300),
        romanUrduSummary: parsed.romanUrduSummary || parsed.roman_urdu_summary || parsed.roman || '',
        fullAnswerEnglish: parsed.fullAnswerEnglish || parsed.full_answer_english || parsed.full_english || '',
        fullAnswerRoman: parsed.fullAnswerRoman || parsed.full_answer_roman || parsed.full_roman || '',
        summary: parsed.summary || parsed.shortSummary || parsed.short_summary || '',
        highlights: parsed.highlights || parsed.highlights || [],
        doctorQuestions: parsed.doctorQuestions || parsed.doctor_questions || parsed.questions || [],
        dietTips: parsed.dietTips || parsed.diet_tips || parsed.diet || [],
        homeRemedies: parsed.homeRemedies || parsed.home_remedies || parsed.remedies || [],
        disclaimer: parsed.disclaimer || parsed.note || 'Always consult your doctor before making any decision.'
      };
    }

    // Fallback: return raw text in englishSummary
    return {
      englishSummary: String(raw).slice(0, 1000),
      romanUrduSummary: '',
      doctorQuestions: [],
      dietTips: [],
      homeRemedies: [],
    };
  } catch (err) {
    console.error('analyzeFile error', err && err.message ? err.message : err);
    // Return a helpful mock fallback so the UI still receives useful bilingual summaries
    const fallback = {
      englishSummary: `This is a fallback summary for ${fileUrl}. The AI service failed to produce a summary: ${process.env.NODE_ENV !== 'production' ? (err && err.message ? err.message : String(err)) : 'AI service error'}`,
      romanUrduSummary: `Yeh aik fallback khulasa hai. AI service say jawab nahin mila, barah-e-karam doctor say mashwara karain.`,
      fullAnswerEnglish: `Fallback full English analysis: The AI provider could not be reached. Summary: possible abnormalities found.`,
      fullAnswerRoman: `Fallback full Roman Urdu analysis: AI provider unavailable, mumkin kharabi paayi gayi.`,
      summary: `Fallback short summary: possible abnormalities detected. Consult doctor.`,
      highlights: ['Possible abnormal values present'],
      doctorQuestions: ['When did these symptoms start?', 'Any recent medication changes?', 'Do you have any allergies?'],
      dietTips: ['Maintain hydration', 'Eat balanced meals, avoid high salt'],
      homeRemedies: ['Rest and monitor symptoms', 'Use OTC pain relief if advised'],
      disclaimer: 'Always consult your doctor before making any decision.'
    };
    return fallback;
  }
};

// Public: chatWithAi
const chatWithAi = async ({ message, context }) => {
  const prompt = `You are HealthMate, a friendly bilingual medical assistant. Answer the user politely in one short paragraph in English, then provide a Roman Urdu translation. User message: ${message}`;

  if (PROVIDER === 'stub' || !API_KEY) {
    // produce a friendly bilingual mock reply
    const english = `I received your message: "${message}". Based on that, I suggest checking your recent vitals and, if symptoms persist, consult a doctor. Would you like specific advice for diet, medication interactions, or red-flag symptoms?`;
    const roman = `Main nay aapka paigham liya: "${message}". Is kay madde nazar, apnay aakhri vitals check karain aur agar symptoms barqarar rahain to doctor se raabta karain. Kya aap khanay, dawaon ya khatarnaak alamat kay baray mein wazeh mashwara chahain gay?`;
    return { text: `${english}\n\nRoman Urdu:\n${roman}`, english, roman };
  }

  try {
    const raw = await providerGenerate(prompt, { maxTokens: 400 });
    // raw may be a string or object; normalize
    const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
    return { text, raw };
  } catch (err) {
    console.error('chatWithAi error', err && err.message ? err.message : err);
    // Fallback to a friendly bilingual mock reply so chat remains usable in dev
    const english = `(Fallback) I received your message: "${message}". I suggest checking your recent vitals and, if symptoms persist, consult a doctor.`;
    const roman = `(Fallback) Main nay aapka paigham liya: "${message}". Apnay vitals check karain aur agar masla barqarar rahay to doctor se mashwara karain.`;
    return { text: `${english}\n\nRoman Urdu:\n${roman}`, english, roman, raw: null };
  }
};

module.exports = { analyzeFile, chatWithAi };
