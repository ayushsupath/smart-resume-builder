import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'var(--navbar-bg)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>R</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>Smart<span style={{ color: '#6366f1' }}>Resume</span></span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { to: '/dashboard', label: '📊 Dashboard' },
              { to: '/resumes', label: '📄 Resumes' },
              { to: '/jobs', label: '💼 Jobs' },
              { to: '/applications', label: '📋 Applications' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive(link.to) ? '#6366f1' : 'var(--text-muted)',
                  background: isActive(link.to) ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >{link.label}</Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setIsDark(!isDark)} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', outline: 'none' }} title="Toggle Theme">
            {isDark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{user.name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
