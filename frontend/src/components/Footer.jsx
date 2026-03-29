import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const footerStyle = {
    background: '#0f172a',
    color: '#f8fafc',
    padding: '48px 24px 24px',
    width: '100%',
    marginTop: 'auto'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    marginBottom: '48px'
  };

  const headingStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '20px'
  };

  const linkStyle = {
    color: '#94a3b8',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '12px',
    transition: 'color 0.2s ease',
    fontSize: '15px'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* Column 1 - Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '16px' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>R</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#ffffff' }}>Smart<span style={{ color: '#6366f1' }}>Resume</span></span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>Build ATS-friendly resumes with AI</p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 style={headingStyle}>Quick Links</h3>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/resumes" style={linkStyle}>My Resumes</Link>
          <Link to="/upload" style={linkStyle}>Upload Resume</Link>
          <Link to="/about" style={linkStyle}>About Us</Link>
        </div>

        {/* Column 3 - Contact/Social */}
        <div>
          <h3 style={headingStyle}>Connect</h3>
          <a href="mailto:[ayushsupath1829@gmail.com]" style={linkStyle}>Email Us</a>
          <a href="https://github.com/ayushsupath" target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub</a>
          <a href="https://www.linkedin.com/in/ayushsupath" target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid #1e293b',
        paddingTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        color: '#64748b',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>© 2026 SmartResume Builder. Made by Ayush Supath</p>
        <p style={{ margin: 0 }}>All rights reserved.</p>
      </div>
    </footer>
  );
}
