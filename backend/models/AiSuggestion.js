const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AiSuggestion = sequelize.define('AiSuggestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  resumeId: { type: DataTypes.INTEGER, allowNull: true },
  jobId: { type: DataTypes.INTEGER, allowNull: true },
  type: {
    type: DataTypes.ENUM('resume_improve', 'job_match', 'cover_letter', 'skills_gap'),
    allowNull: false,
  },
  inputData: { type: DataTypes.TEXT, allowNull: true },
  suggestion: { type: DataTypes.TEXT, allowNull: false },
  score: { type: DataTypes.FLOAT, allowNull: true },
}, {
  tableName: 'ai_suggestions',
  timestamps: true,
});

module.exports = AiSuggestion;
