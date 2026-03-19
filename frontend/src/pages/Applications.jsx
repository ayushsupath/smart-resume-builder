import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  applied: { bg: '#e0e7ff', color: '#4338ca', label: '📤 Applied' },
  reviewing: { bg: '#fef3c7', color: '#92400e', label: '🔍 Reviewing' },
  shortlisted: { bg: '#d1fae5', color: '#065f46', label: '✅ Shortlisted' },
  rejected: { bg: '#fee2e2', color: '#991b1b', label: '❌ Rejected' },
  hired: { bg: '#d1fae5', color: '#065f46', label: '🎉 Hired!' },
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/jobs/applications/my')
      .then(res => setApplications(res.data.applications || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return (
    <div className="flex-center" style={{ minHeight: 400 }}>
      <div className="spinner spinner-dark" style={{ width: 40, height: 40 }}></div>
    </div>
  );

  return (
    <div>
      <div className="mb-24">
        <h1 className="section-title">📋 My Applications</h1>
        <p className="section-subtitle">Track all your job applications in one place</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total', value: applications.length, color: '#6366f1' },
          { label: 'Shortlisted', value: counts.shortlisted || 0, color: '#10b981' },
          { label: 'Reviewing', value: counts.reviewing || 0, color: '#f59e0b' },
          { label: 'Hired', value: counts.hired || 0, color: '#059669' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'applied', 'reviewing', 'shortlisted', 'hired', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
            style={{ background: filter === f ? '#6366f1' : 'white', color: filter === f ? 'white' : '#374151', border: '1px solid #e5e7eb', textTransform: 'capitalize' }}>
            {f === 'all' ? '🔎 All' : statusColors[f]?.label || f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No applications yet!</h3>
          <p>Apply to jobs and track your progress here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(app => {
            const st = statusColors[app.status] || statusColors.applied;
            return (
              <div key={app.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                <div style={{ width: 48, height: 48, background: '#e0e7ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏢</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{app.job?.title || 'Job'}</p>
                  <p style={{ fontSize: 13, color: '#6366f1', fontWeight: 600 }}>{app.job?.company}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                    📍 {app.job?.location} • Applied {new Date(app.appliedAt).toLocaleDateString()}
                    {app.matchScore && <span style={{ marginLeft: 8, color: '#10b981', fontWeight: 600 }}>🎯 {app.matchScore}% match</span>}
                  </p>
                </div>
                <span style={{ padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
