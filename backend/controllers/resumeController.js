const Resume = require('../models/Resume');
const AiSuggestion = require('../models/AiSuggestion');
const { improveResume, checkATSScore } = require('../services/geminiService');

// GET /api/resumes - Get all resumes of logged in user
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']],
    });
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/resumes/:id
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/resumes - Create new resume
const createResume = async (req, res) => {
  try {
    const {
      title, fullName, email, phone, location, linkedin, github, website,
      summary, experience, education, skills, projects, certifications, template,
    } = req.body;

    const resume = await Resume.create({
      userId: req.user.id,
      title: title || 'My Resume',
      fullName, email, phone, location, linkedin, github, website,
      summary, experience, education, skills, projects, certifications,
      template: template || 'modern',
    });

    res.status(201).json({ success: true, message: 'Resume created!', resume });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/resumes/:id - Update resume
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    await resume.update(req.body);
    res.json({ success: true, message: 'Resume updated!', resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    await resume.destroy();
    res.json({ success: true, message: 'Resume deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/resumes/:id/improve - AI improve resume
const aiImproveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const suggestion = await improveResume(resume.toJSON());

    // Save suggestion to DB
    await AiSuggestion.create({
      userId: req.user.id,
      resumeId: resume.id,
      type: 'resume_improve',
      suggestion,
    });

    res.json({ success: true, suggestion });
  } catch (error) {
    console.error('AI improve error:', error);
    res.status(500).json({ success: false, message: 'AI service error. Check your API key.' });
  }
};

// GET /api/resumes/:id/suggestions - Get past AI suggestions
const getSuggestions = async (req, res) => {
  try {
    const suggestions = await AiSuggestion.findAll({
      where: { resumeId: req.params.id, userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/resumes/:id/ats-score - AI ATS Score check
const atsScoreCheck = async (req, res) => {
  try {
    const resume = await Resume.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const scoreData = await checkATSScore(resume.toJSON());
    res.json({ success: true, scoreData });
  } catch (error) {
    console.error('ATS Score error:', error);
    res.status(500).json({ success: false, message: 'AI service error. Check your API key.' });
  }
};

module.exports = { getResumes, getResume, createResume, updateResume, deleteResume, aiImproveResume, getSuggestions, atsScoreCheck };
