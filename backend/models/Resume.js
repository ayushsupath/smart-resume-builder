const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: 'My Resume',
  },
  // Personal Info
  fullName: { type: DataTypes.STRING(100), allowNull: true },
  email: { type: DataTypes.STRING(150), allowNull: true },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  location: { type: DataTypes.STRING(100), allowNull: true },
  linkedin: { type: DataTypes.STRING(200), allowNull: true },
  github: { type: DataTypes.STRING(200), allowNull: true },
  website: { type: DataTypes.STRING(200), allowNull: true },
  // Content (stored as JSON)
  summary: { type: DataTypes.TEXT, allowNull: true },
  experience: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  education: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  skills: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  projects: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  certifications: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  // Meta
  template: { type: DataTypes.STRING(50), defaultValue: 'modern' },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'resumes',
  timestamps: true,
});

module.exports = Resume;
