const express = require('express');
const router = express.Router();
const {
  getJobs, getJob, createJob, updateJob, deleteJob,
  matchJob, getCoverLetter, applyJob, getMyApplications, skillsGap,
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getJobs);
router.get('/applications/my', authMiddleware, getMyApplications);
router.get('/:id', getJob);

// Auth required
router.post('/:id/match', authMiddleware, matchJob);
router.post('/:id/cover-letter', authMiddleware, getCoverLetter);
router.post('/:id/apply', authMiddleware, applyJob);
router.post('/:id/skills-gap', authMiddleware, skillsGap);

// Admin only
router.post('/', authMiddleware, adminMiddleware, createJob);
router.put('/:id', authMiddleware, adminMiddleware, updateJob);
router.delete('/:id', authMiddleware, adminMiddleware, deleteJob);

module.exports = router;
