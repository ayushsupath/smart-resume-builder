# 🚀 Smart Resume Builder + Job Matcher

AI-powered resume builder with job matching, cover letter generator, and application tracker. **100% FREE** using Google Gemini API.

---

## ✨ Features
- 📄 **Resume Builder** – Build resumes with live preview + PDF download
- 🤖 **AI Resume Improver** – Get AI feedback on your resume (Gemini)
- 💼 **Job Listings** – Browse and search jobs
- 🎯 **AI Job Matcher** – Get match score % between your resume & job
- ✉️ **AI Cover Letter** – Auto-generate personalized cover letters
- 📋 **Application Tracker** – Track all your job applications
- 🔐 **Auth System** – JWT-based login/register

---

## 🛠️ Tech Stack
- **Frontend:** React + Vite, React Router, Axios, react-to-print
- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.0 + Sequelize ORM
- **AI:** Google Gemini 1.5 Flash (FREE)
- **Auth:** JWT + bcryptjs

---

## ⚡ Setup Guide

### Step 1 – MySQL Setup
```sql
CREATE DATABASE smart_resume_db;
```

### Step 2 – Get FREE Gemini API Key
1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Create a new key → Copy it

### Step 3 – Email Notifications (Gmail App Password)
1. Go to Google Account > Security > 2-Step Verification > App Passwords
2. Generate an App Password for "Mail"
3. Add this password to `.env` as `EMAIL_PASS`
4. Add your Gmail to `.env` as `EMAIL_USER`

### Step 4 – Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env → add DB credentials + Gemini API key + Email credentials
npm run dev
```

### Step 5 – Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Step 6 – Open Browser
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api/health
```

---

## 📁 Project Structure
```
smart-resume-builder/
├── backend/
│   ├── config/         # DB + Gemini config
│   ├── controllers/    # Auth, Resume, Job logic
│   ├── middleware/     # JWT auth, Admin check
│   ├── models/         # Sequelize DB models
│   ├── routes/         # API routes
│   ├── services/       # Gemini AI service
│   └── server.js       # Entry point
│
└── frontend/
    └── src/
        ├── components/ # Navbar, ResumePreview, ProtectedRoute
        ├── context/    # AuthContext
        ├── pages/      # Login, Register, Dashboard, etc.
        └── services/   # Axios API instance
```

---

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/resumes | Get my resumes |
| POST | /api/resumes | Create resume |
| PUT | /api/resumes/:id | Update resume |
| POST | /api/resumes/:id/improve | AI improve |
| GET | /api/jobs | Browse jobs |
| POST | /api/jobs/:id/match | AI job match |
| POST | /api/jobs/:id/cover-letter | AI cover letter |
| POST | /api/jobs/:id/apply | Apply to job |
| GET | /api/jobs/applications/my | My applications |

---

## 🎯 Add Sample Jobs (Run in MySQL)
```sql
INSERT INTO job_listings (title, company, location, jobType, salary, description, skills, requirements, isActive, createdAt, updatedAt)
VALUES 
('Frontend Developer', 'TechCorp India', 'Bengaluru', 'full-time', '6-10 LPA', 'We are looking for a skilled React developer...', '["React", "JavaScript", "CSS", "Git"]', '["2+ years experience", "React proficiency"]', 1, NOW(), NOW()),
('Backend Developer', 'StartupXYZ', 'Remote', 'remote', '8-14 LPA', 'Join our fast-growing startup as a Node.js developer...', '["Node.js", "Express", "MySQL", "REST API"]', '["1+ years experience", "Node.js knowledge"]', 1, NOW(), NOW()),
('Full Stack Intern', 'InnovateTech', 'Indore', 'internship', '15-20K/month', 'Exciting internship opportunity for freshers...', '["React", "Node.js", "HTML", "CSS"]', '["Final year student", "Basic web knowledge"]', 1, NOW(), NOW());
```

---
