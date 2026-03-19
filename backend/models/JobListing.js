const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobListing = sequelize.define('JobListing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING(200), allowNull: false },
  company: { type: DataTypes.STRING(150), allowNull: false },
  location: { type: DataTypes.STRING(100), allowNull: true },
  jobType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'internship', 'freelance', 'remote'),
    defaultValue: 'full-time',
  },
  experience: { type: DataTypes.STRING(50), allowNull: true },
  salary: { type: DataTypes.STRING(100), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  requirements: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  skills: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  applyLink: { type: DataTypes.STRING(500), allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  postedBy: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'job_listings',
  timestamps: true,
});

module.exports = JobListing;
