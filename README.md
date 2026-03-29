# 🚀 Smart Resume Builder + AI Analyzer

> Build ATS-friendly resumes, get AI feedback, and land 
> your dream job — 100% FREE!

![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Groq AI](https://img.shields.io/badge/Groq-AI-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌐 Live Demo
- **Frontend:** [your-app.vercel.app](https://your-app.vercel.app)
- **Backend API:** [your-api.onrender.com](https://your-api.onrender.com)

---

## ✨ Features

- 📄 **Resume Builder** — Build professional resumes with live preview
- 🤖 **AI Resume Improver** — Get AI suggestions powered by Groq
- 🎯 **ATS Score Checker** — Check how well your resume passes ATS
- 📤 **Upload & Analyze** — Upload existing PDF resume for AI analysis
- ✉️ **AI Cover Letter** — Auto-generate personalized cover letters  
- 🎨 **Multiple Templates** — Modern, Classic, Minimal designs
- 🏆 **Certifications** — Add certificates to your resume
- 🌙 **Dark Mode** — Easy on the eyes
- 📱 **Fully Responsive** — Works on mobile, tablet, desktop
- 🔐 **Secure Auth** — JWT based login/register
- 📧 **Email Notifications** — Get notified on important actions
- ⬇️ **PDF Download** — Download your resume as PDF

---

## 🛠️ Tech Stack

### Frontend
- React.js 18 + Vite
- React Router v6
- Axios
- React Hot Toast
- React To Print

### Backend
- Node.js + Express.js
- MySQL 8.0 + Sequelize ORM
- JWT Authentication
- Multer (file upload)
- Nodemailer (emails)

### AI
- Groq API (FREE) — llama-3.3-70b-versatile
- Features: Resume improve, ATS score, Cover letter, Skills gap

---

## ⚡ Local Setup

### Prerequisites
- Node.js v18+
- MySQL 8.0
- Groq API Key (free from groq.com)

### Step 1 — Clone the repo
git clone https://github.com/YOUR_USERNAME/smart-resume-builder.git
cd smart-resume-builder

### Step 2 — MySQL Database
CREATE DATABASE smart_resume_db;

### Step 3 — Backend Setup
cd backend
npm install
cp .env.example .env

Fill in .env:
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_resume_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173

npm run dev

### Step 4 — Frontend Setup
cd frontend
npm install
npm run dev

### Step 5 — Open Browser
http://localhost:5173

---

## 🚀 Deployment

| Service | Platform | Cost |
|---------|----------|------|
| Frontend | Vercel | Free |
| Backend | Render | Free |
| Database | Railway | Free |

---

## 📁 Project Structure

smart-resume-builder/
├── backend/
│   ├── config/         # DB + AI config
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # AI + PDF services
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/ # Navbar, Footer, ResumePreview
        ├── context/    # Auth context
        ├── pages/      # All pages
        └── services/   # API calls

---

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register | No |
| POST | /api/auth/login | Login | No |
| GET | /api/resumes | Get my resumes | Yes |
| POST | /api/resumes | Create resume | Yes |
| PUT | /api/resumes/:id | Update resume | Yes |
| DELETE | /api/resumes/:id | Delete resume | Yes |
| POST | /api/resumes/:id/improve | AI improve | Yes |
| POST | /api/resumes/:id/ats-score | ATS score | Yes |
| POST | /api/upload/analyze | Upload & analyze PDF | No |
| POST | /api/upload/improve | Upload & improve PDF | No |

---

## 🤝 Contributing

1. Fork the repo
2. Create branch: git checkout -b feature/amazing-feature
3. Commit: git commit -m 'Add amazing feature'
4. Push: git push origin feature/amazing-feature
5. Open Pull Request

---

## 📄 License
MIT License — feel free to use this project!

---

## 👨💻 Made By
**Ayush Supath** — MCA Student at SGSITS, Indore
- GitHub: github.com/ayushsupath
- Email: ayushsupath13326@gmail.com

---

⭐ **If this project helped you, please give it a star!** ⭐
