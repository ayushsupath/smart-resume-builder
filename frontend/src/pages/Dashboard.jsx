import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ resumes: 0, applications: 0, jobs: 0 });
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, appRes, jobRes] = await Promise.all([
          api.get('/resumes'),
          api.get('/jobs/applications/my'),
          api.get('/jobs?limit=3'),
        ]);
        setResumes(resumeRes.data.resumes?.slice(0, 3) || []);
        setApplications(appRes.data.applications?.slice(0, 3) || []);
        setStats({
          resumes: resumeRes.data.resumes?.length || 0,
          applications: appRes.data.applications?.length || 0,
          jobs: jobRes.data.total || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'My Resumes', value: stats.resumes, icon: '📄', color: '#6366f1', link: '/resumes' },
    { label: 'Applications', value: stats.applications, icon: '📋', color: '#10b981', link: '/applications' },
    { label: 'Jobs Available', value: stats.jobs, icon: '💼', color: '#f59e0b', link: '/jobs' },
    { label: 'AI Credits', value: '∞', icon: '🤖', color: '#8b5cf6', link: '#' },
  ];

  const statusColors = { applied: '#6366f1', reviewing: '#f59e0b', shortlisted: '#10b981', rejected: '#ef4444', hired: '#059669' };

  if (loading) return (
    <div className="flex-center" style={{ minHeight: 400 }}>
      <div className="spinner spinner-dark" style={{ width: 40, height: 40 }}></div>
    </div>
  );

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: 20, padding: '32px 36px', marginBottom: 32, color: 'white' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p style={{ marginTop: 8, opacity: 0.9, fontSize: 16 }}>Build your perfect resume and land your dream job.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <Link to="/resumes/new" className="btn" style={{ background: 'white', color: '#6366f1' }}>✨ New Resume</Link>
          <Link to="/jobs" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>💼 Browse Jobs</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {statCards.map(s => (
          <Link to={s.link} key={s.label} className="card card-hover" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{s.label}</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</p>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Resumes */}
        <div className="card">
          <div className="flex-between mb-16">
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>📄 Recent Resumes</h2>
            <Link to="/resumes" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          {resumes.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-state-icon">📄</div>
              <p style={{ color: '#6b7280' }}>No resumes yet</p>
              <Link to="/resumes/new" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Create Resume</Link>
            </div>
          ) : resumes.map(r => (
            <div key={r.id} style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{r.title}</p>
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{new Date(r.updatedAt).toLocaleDateString()}</p>
              </div>
              <Link to={`/resumes/${r.id}`} className="btn btn-secondary btn-sm">Edit</Link>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="flex-between mb-16">
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>📋 Recent Applications</h2>
            <Link to="/applications" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          {applications.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-state-icon">💼</div>
              <p style={{ color: '#6b7280' }}>No applications yet</p>
              <Link to="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Browse Jobs</Link>
            </div>
          ) : applications.map(a => (
            <div key={a.id} style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{a.job?.title}</p>
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{a.job?.company}</p>
              </div>
              <span className="badge" style={{ background: statusColors[a.status] + '20', color: statusColors[a.status] }}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>⚡ Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/resumes/new" className="btn btn-primary">📄 Build Resume</Link>
          <Link to="/jobs" className="btn btn-secondary">💼 Find Jobs</Link>
          <Link to="/applications" className="btn btn-secondary">📋 Track Applications</Link>
        </div>
      </div>
    </div>
  );
}
