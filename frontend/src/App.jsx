import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resumes from './pages/Resumes';
import ResumeBuilder from './pages/ResumeBuilder';
import UploadResume from './pages/UploadResume';
import About from './pages/About';
import Footer from './components/Footer';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: 12, fontFamily: 'Inter, sans-serif', fontSize: 14 },
          }}
        />
        <div className="page-wrapper">
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/resumes" element={<ProtectedRoute><Resumes /></ProtectedRoute>} />
              <Route path="/resumes/new" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
              <Route path="/resumes/:id" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
              <Route path="/upload" element={<UploadResume />} />
              <Route path="/about" element={<About />} />

              {/* Redirect root */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
