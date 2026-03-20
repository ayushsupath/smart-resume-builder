const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callGroq(prompt) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2048,
  });
  return completion.choices[0]?.message?.content || '';
}

// Resume ko improve karo AI se
const improveResume = async (resumeData) => {
  const prompt = `
You are an expert resume writer and career coach. Analyze this resume and provide specific, actionable improvements.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Please provide:
1. **Overall Score** (out of 100) with brief reasoning
2. **Summary Improvement** - Rewrite a better professional summary
3. **Key Weaknesses** - Top 3 issues to fix
4. **Specific Suggestions** - For each section (Experience, Skills, Education)
5. **Missing Keywords** - Important keywords to add
6. **Action Items** - Top 5 things to do immediately

Be specific, practical, and encouraging. Format your response in clear sections.
  `;

  return await callGroq(prompt);
};

// Job ke saath resume ka match score nikalo
const getJobMatchScore = async (resumeData, jobData) => {
  const prompt = `
You are an ATS (Applicant Tracking System) expert. Analyze how well this resume matches the job description.

RESUME:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
Title: ${jobData.title}
Company: ${jobData.company}
Description: ${jobData.description}
Required Skills: ${JSON.stringify(jobData.skills)}
Requirements: ${JSON.stringify(jobData.requirements)}

Provide a JSON response with this EXACT format (no markdown, just JSON):
{
  "matchScore": 75,
  "scoreBreakdown": {
    "skills": 80,
    "experience": 70,
    "education": 75,
    "keywords": 65
  },
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "recommendation": "Your recommendation message here"
}
  `;

  const text = await callGroq(prompt);

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // If JSON parse fails, return structured response
  }

  return {
    matchScore: 50,
    scoreBreakdown: { skills: 50, experience: 50, education: 50, keywords: 50 },
    matchingSkills: [],
    missingSkills: [],
    strengths: ['Profile reviewed'],
    improvements: ['Please review manually'],
    recommendation: text,
  };
};

// Cover letter generate karo
const generateCoverLetter = async (resumeData, jobData) => {
  const prompt = `
Write a professional, personalized cover letter for this job application.

APPLICANT RESUME:
Name: ${resumeData.fullName}
Skills: ${JSON.stringify(resumeData.skills)}
Experience: ${JSON.stringify(resumeData.experience)}
Summary: ${resumeData.summary}

JOB:
Title: ${jobData.title}
Company: ${jobData.company}
Description: ${jobData.description}

Write a compelling cover letter that:
- Opens with a strong hook (not "I am applying for...")
- Highlights 2-3 most relevant achievements
- Shows knowledge of the company/role
- Ends with a confident call-to-action
- Is 3-4 paragraphs, professional tone
- Is tailored specifically to this job

Write ONLY the cover letter, no explanations.
  `;

  return await callGroq(prompt);
};

// Skills gap analysis
const analyzeSkillsGap = async (resumeData, jobData) => {
  const prompt = `
Analyze the skills gap between this candidate and job requirements.

CANDIDATE SKILLS: ${JSON.stringify(resumeData.skills)}
CANDIDATE EXPERIENCE: ${JSON.stringify(resumeData.experience)}

JOB REQUIREMENTS:
Title: ${jobData.title}
Required Skills: ${JSON.stringify(jobData.skills)}
Requirements: ${JSON.stringify(jobData.requirements)}

Provide a JSON response with this EXACT format (no markdown):
{
  "hasSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "partialSkills": ["skill5"],
  "learningPlan": [
    {"skill": "skill3", "resources": ["resource1"], "timeToLearn": "2 weeks"},
    {"skill": "skill4", "resources": ["resource2"], "timeToLearn": "1 month"}
  ],
  "priorityOrder": ["Most important skill first"]
}
  `;

  const text = await callGroq(prompt);

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {}

  return { hasSkills: [], missingSkills: [], partialSkills: [], learningPlan: [], priorityOrder: [] };
};

// ATS Score Generator
const checkATSScore = async (resumeData) => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) parser and resume reviewer. Analyze this resume data.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Provide a JSON response with this EXACT format covering the resume's ATS-friendliness and quality (no markdown, just JSON):
{
  "overallScore": 78,
  "sections": {
    "formatting": 85,
    "keywords": 70,
    "experience": 80,
    "education": 75,
    "skills": 72
  },
  "passedChecks": ["Clear section headings", "Contact info present"],
  "failedChecks": ["Missing quantified achievements", "No action verbs"],
  "improvements": ["Add numbers to achievements", "Use stronger action verbs"],
  "verdict": "Good - Likely to pass most ATS systems"
}
  `;

  const text = await callGroq(prompt);

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {}

  return {
    overallScore: 50,
    sections: { formatting: 50, keywords: 50, experience: 50, education: 50, skills: 50 },
    passedChecks: [], failedChecks: ["Could not parse response"], improvements: [], verdict: "Error processing resume ATS score"
  };
};

module.exports = { improveResume, getJobMatchScore, generateCoverLetter, analyzeSkillsGap, checkATSScore };
