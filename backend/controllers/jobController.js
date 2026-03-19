const JobListing = require('../models/JobListing');
const JobApplication = require('../models/JobApplication');
const Resume = require('../models/Resume');
const AiSuggestion = require('../models/AiSuggestion');
const { getJobMatchScore, generateCoverLetter, analyzeSkillsGap } = require('../services/geminiService');
const { sendApplicationEmail } = require('../services/emailService');
const { Op } = require('sequelize');

// GET /api/jobs - Get all active jobs (with search/filter)
const getJobs = async (req, res) => {
  try {
    const { search, jobType, location, page = 1, limit = 10 } = req.query;
    const where = { isActive: true };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (jobType) where.jobType = jobType;
    if (location) where.location = { [Op.like]: `%${location}%` };

    const offset = (page - 1) * limit;
    const { count, rows: jobs } = await JobListing.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      jobs,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/jobs/:id
const getJob = async (req, res) => {
  try {
    const job = await JobListing.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/jobs - Admin create job
const createJob = async (req, res) => {
  try {
    const job = await JobListing.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json({ success: true, message: 'Job posted!', job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/jobs/:id - Admin update job
const updateJob = async (req, res) => {
  try {
    const job = await JobListing.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    await job.update(req.body);
    res.json({ success: true, message: 'Job updated!', job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/jobs/:id - Admin delete job
const deleteJob = async (req, res) => {
  try {
    const job = await JobListing.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    await job.destroy();
    res.json({ success: true, message: 'Job deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/jobs/:id/match - AI Job Match with resume
const matchJob = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const job = await JobListing.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const resume = await Resume.findOne({ where: { id: resumeId, userId: req.user.id } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const matchResult = await getJobMatchScore(resume.toJSON(), job.toJSON());

    await AiSuggestion.create({
      userId: req.user.id,
      resumeId: resume.id,
      jobId: job.id,
      type: 'job_match',
      score: matchResult.matchScore,
      suggestion: JSON.stringify(matchResult),
    });

    res.json({ success: true, matchResult });
  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ success: false, message: 'AI service error.' });
  }
};

// POST /api/jobs/:id/cover-letter - Generate cover letter
const getCoverLetter = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const job = await JobListing.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const resume = await Resume.findOne({ where: { id: resumeId, userId: req.user.id } });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const coverLetter = await generateCoverLetter(resume.toJSON(), job.toJSON());

    await AiSuggestion.create({
      userId: req.user.id,
      resumeId: resume.id,
      jobId: job.id,
      type: 'cover_letter',
      suggestion: coverLetter,
    });

    res.json({ success: true, coverLetter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI service error.' });
  }
};

// POST /api/jobs/:id/apply - Apply to a job
const applyJob = async (req, res) => {
  try {
    const { resumeId, coverLetter } = req.body;

    const existing = await JobApplication.findOne({
      where: { userId: req.user.id, jobId: req.params.id },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already applied to this job.' });
    }

    const application = await JobApplication.create({
      userId: req.user.id,
      jobId: req.params.id,
      resumeId,
      coverLetter,
    });

    try {
      const job = await JobListing.findByPk(req.params.id);
      const resume = await Resume.findByPk(resumeId);
      if (job && resume && resume.email) {
        sendApplicationEmail(resume.email, job.title, job.company);
      }
    } catch (ignoreErr) {}

    res.status(201).json({ success: true, message: 'Application submitted!', application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/jobs/applications/my - Get my applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { userId: req.user.id },
      include: [{ model: JobListing, as: 'job' }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/jobs/:id/skills-gap - Skills gap analysis
const skillsGap = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const job = await JobListing.findByPk(req.params.id);
    const resume = await Resume.findOne({ where: { id: resumeId, userId: req.user.id } });

    if (!job || !resume) {
      return res.status(404).json({ success: false, message: 'Job or resume not found.' });
    }

    const analysis = await analyzeSkillsGap(resume.toJSON(), job.toJSON());
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI service error.' });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob, matchJob, getCoverLetter, applyJob, getMyApplications, skillsGap };
