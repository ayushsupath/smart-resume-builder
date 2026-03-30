import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Please enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email";
    
    if (!form.password) newErrors.password = "Please enter your password";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message;
      
      if (message === 'Invalid email or password.') {
        toast.error('Wrong email or password. Please try again!');
        setErrors({ 
          email: 'Check your email', 
          password: 'Check your password' 
        });
        setShake(true);
        setTimeout(() => setShake(false), 400);
      } else if (message === 'Email already registered.') {
        toast.error('This email is already registered!');
      } else if (!navigator.onLine) {
        toast.error('No internet connection!');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: 'white', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <span style={{ fontSize: 28 }}>📄</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800 }}>Smart Resume Builder</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>Login to your account</p>
        </div>

        <div className="card auth-card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                style={{ borderColor: errors.email ? 'red' : '' }}
                onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({}); }}
                required
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                style={{ borderColor: errors.password ? 'red' : '' }}
                onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({}); }}
                required
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <button type="submit" className={`btn btn-primary ${shake ? 'shake' : ''}`} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
              {loading ? <><span className="spinner"></span> Please wait...</> : '🚀 Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
