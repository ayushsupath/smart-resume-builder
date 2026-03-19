const express = require('express');
const router = express.Router();
const {
  getResumes, getResume, createResume, updateResume, deleteResume,
  aiImproveResume, getSuggestions, atsScoreCheck
} = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // All resume routes require auth

router.get('/', getResumes);
router.post('/', createResume);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/improve', aiImproveResume);
router.post('/:id/ats-score', atsScoreCheck);
router.get('/:id/suggestions', getSuggestions);

module.exports = router;
