const { extractTextFromPDF } = require('../services/pdfService');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const truncateText = (text, maxChars = 3000) => {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + '...';
};

async function analyzeWithAi(prompt) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-8b-instant',
    max_tokens: 2048,
  });
  return completion.choices[0]?.message?.content || '';
}

const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const extractedText = await extractTextFromPDF(req.file.buffer);
    
    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Could not extract text from PDF' });
    }

    const prompt = `Analyze this resume text and provide:
1. ATS Score (out of 100)
2. Key Strengths (3-5 points)
3. Major Weaknesses (3-5 points)
4. Specific Improvements (5-7 actionable points)
5. Missing Keywords for modern jobs
6. Overall Verdict

Format response strictly as a JSON object (no markdown, just valid JSON) with the following exact keys:
{
  "score": 85,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "improvements": ["...", "..."],
  "missingKeywords": ["...", "..."],
  "verdict": "Your overall verdict..."
}

Resume Text:
${truncateText(extractedText, 3000)}`;

    const text = await analyzeWithAi(prompt);
    let aiResponse;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiResponse = JSON.parse(jsonMatch[0]);
      else throw new Error("Could not parse JSON");
    } catch (e) {
      // Fallback object structure if structure varies
      aiResponse = {
        score: 0,
        strengths: ["Failed to parse AI response structure"],
        weaknesses: [],
        improvements: [],
        missingKeywords: [],
        verdict: "Error in analysis parsing",
        rawText: text
      };
    }

    res.json({ success: true, text: extractedText, analysis: aiResponse });
  } catch (err) {
    console.error('File upload/analyze error:', err);
    res.status(500).json({ success: false, message: err.message || 'Error processing resume' });
  }
};

const uploadAndImprove = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const extractedText = await extractTextFromPDF(req.file.buffer);

    const prompt = `You are an expert resume writer. Rewrite and improve this resume to make it more professional, ATS-friendly, and impactful. Keep all the same information but:
- Use strong action verbs
- Add quantified achievements where possible
- Improve professional summary
- Better skills presentation
- Clear and concise language

Original Resume:
${truncateText(extractedText, 3000)}

Provide ONLY the improved version in a clean text format. Do not add introductory or concluding conversational text.`;

    const aiResponse = await analyzeWithAi(prompt);

    res.json({ success: true, improvedResume: aiResponse });
  } catch (err) {
    console.error('File improve error:', err);
    res.status(500).json({ success: false, message: err.message || 'Error improving resume' });
  }
};

module.exports = { uploadAndAnalyze, uploadAndImprove };
