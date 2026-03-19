const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  jobId: { type: DataTypes.INTEGER, allowNull: false },
  resumeId: { type: DataTypes.INTEGER, allowNull: true },
  status: {
    type: DataTypes.ENUM('applied', 'reviewing', 'shortlisted', 'rejected', 'hired'),
    defaultValue: 'applied',
  },
  matchScore: { type: DataTypes.FLOAT, allowNull: true },
  coverLetter: { type: DataTypes.TEXT, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  appliedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'job_applications',
  timestamps: true,
});

module.exports = JobApplication;
