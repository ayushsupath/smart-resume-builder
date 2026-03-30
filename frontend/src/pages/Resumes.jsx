import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import SkeletonCard from '../components/SkeletonCard';

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data.resumes || []);
    } catch (err) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success('Resume deleted!');
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return (
    <div className="grid-3">
      <SkeletonCard variant="card" />
      <SkeletonCard variant="card" />
      <SkeletonCard variant="card" />
    </div>
  );

  return (
    <div>
      <div className="flex-between mb-24">
        <div>
          <h1 className="section-title">📄 My Resumes</h1>
          <p className="section-subtitle">Create and manage your professional resumes</p>
        </div>
        <Link to="/resumes/new" className="btn btn-primary">✨ Create New Resume</Link>
      </div>

      {resumes.length === 0 ? (
        <div className="card empty-state" style={{ padding: 60 }}>
          <div className="empty-state-icon" style={{fontSize: 64}}>📄</div>
          <h3>No resumes yet!</h3>
          <p>Create your first resume and land your dream job</p>
          <Link to="/resumes/new" className="btn btn-primary">Create My First Resume →</Link>
        </div>
      ) : (
        <div className="grid-3">
          {resumes.map(r => (
            <div key={r.id} className="card card-hover" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📄</div>
                <span className="badge badge-primary">{r.template || 'modern'}</span>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{r.title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280' }}>{r.fullName || 'Name not set'}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Updated {new Date(r.updatedAt).toLocaleDateString()}</p>
              <div className="mobile-stack" style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Link to={`/resumes/${r.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>✏️ Edit</Link>
                <button onClick={() => handleDelete(r.id)} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
