import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedResume, setSelectedResume] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [aiLoading, setAiLoading] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9, ...(search && { search }), ...(jobType && { jobType }) });
      const res = await api.get(`/jobs?${params}`);
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.pages || 1);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [page, jobType]);
  useEffect(() => {
    api.get('/resumes').then(r => setResumes(r.data.resumes || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchJobs(); };

  const handleMatch = async (jobId) => {
    if (!selectedResume) return toast.error('Select a resume first!');
    setAiLoading('match');
    setMatchResult(null);
    setCoverLetter('');
    try {
      const res = await api.post(`/jobs/${jobId}/match`, { resumeId: selectedResume });
      setMatchResult(res.data.matchResult);
      toast.success('Match analysis done! 🎯');
    } catch { toast.error('AI error. Check API key.'); }
    finally { setAiLoading(''); }
  };

  const handleCoverLetter = async (jobId) => {
    if (!selectedResume) return toast.error('Select a resume first!');
    setAiLoading('cover');
    setCoverLetter('');
    try {
      const res = await api.post(`/jobs/${jobId}/cover-letter`, { resumeId: selectedResume });
      setCoverLetter(res.data.coverLetter);
      toast.success('Cover letter generated! ✉️');
    } catch { toast.error('AI error.'); }
    finally { setAiLoading(''); }
  };

  const handleApply = async (jobId) => {
    if (!selectedResume) return toast.error('Select a resume to apply!');
    try {
      await api.post(`/jobs/${jobId}/apply`, { resumeId: selectedResume, coverLetter });
      toast.success('Application submitted! 🎉');
      setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  const scoreClass = (score) => score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low';
  const jobTypeColors = { 'full-time': '#6366f1', 'internship': '#10b981', 'remote': '#f59e0b', 'part-time': '#8b5cf6', 'freelance': '#ef4444' };

  return (
    <div>
      <div className="flex-between mb-24">
        <div>
          <h1 className="section-title">💼 Job Listings</h1>
          <p className="section-subtitle">Find and match jobs with your resume using AI</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input className="form-input" placeholder="🔍 Search jobs, companies..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        <select className="form-input form-select" value={jobType} onChange={e => { setJobType(e.target.value); setPage(1); }} style={{ width: 160 }}>
          <option value="">All Types</option>
          {['full-time', 'part-time', 'internship', 'freelance', 'remote'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="flex-center" style={{ minHeight: 300 }}><div className="spinner spinner-dark" style={{ width: 40, height: 40 }}></div></div>
      ) : jobs.length === 0 ? (
        <div className="card empty-state"><div className="empty-state-icon">💼</div><h3>No jobs found</h3><p>Try different keywords</p></div>
      ) : (
        <>
          <div className="grid-3">
            {jobs.map(job => (
              <div key={job.id} className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => { setSelectedJob(job); setMatchResult(null); setCoverLetter(''); }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, background: '#e0e7ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏢</div>
                  <span className="badge" style={{ background: (jobTypeColors[job.jobType] || '#6366f1') + '20', color: jobTypeColors[job.jobType] || '#6366f1' }}>{job.jobType}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{job.title}</h3>
                <p style={{ fontSize: 13, color: '#6366f1', fontWeight: 600 }}>{job.company}</p>
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>📍 {job.location} {job.salary && `• ${job.salary}`}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                  {(job.skills || []).slice(0, 3).map((s, i) => <span key={i} className="badge badge-gray">{s}</span>)}
                </div>
                <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>View Details</button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className="btn btn-sm" style={{ background: page === p ? '#6366f1' : 'white', color: page === p ? 'white' : '#374151', border: '1px solid #e5e7eb' }}>{p}</button>
            ))}
          </div>
        </>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelectedJob(null)}>
          <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflow: 'auto', padding: 32 }} onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-16">
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>{selectedJob.title}</h2>
                <p style={{ color: '#6366f1', fontWeight: 600, marginTop: 4 }}>{selectedJob.company} • {selectedJob.location}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span className="badge badge-primary">{selectedJob.jobType}</span>
              {selectedJob.experience && <span className="badge badge-gray">{selectedJob.experience}</span>}
              {selectedJob.salary && <span className="badge badge-success">{selectedJob.salary}</span>}
            </div>

            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 16 }}>{selectedJob.description}</p>

            {(selectedJob.skills || []).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 700, marginBottom: 8 }}>Required Skills:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedJob.skills.map((s, i) => <span key={i} className="badge badge-primary">{s}</span>)}
                </div>
              </div>
            )}

            {/* Resume selector */}
            <div className="card" style={{ background: '#f8faff', border: '1px solid #e0e7ff', padding: 16, marginBottom: 16 }}>
              <p style={{ fontWeight: 700, marginBottom: 10 }}>🤖 AI Actions — Select Resume:</p>
              <select className="form-input form-select" value={selectedResume} onChange={e => setSelectedResume(e.target.value)} style={{ marginBottom: 10 }}>
                <option value="">-- Choose your resume --</option>
                {resumes.map(r => <option key={r.id} value={r.id}>{r.title} ({r.fullName})</option>)}
              </select>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }} onClick={() => handleMatch(selectedJob.id)} disabled={aiLoading === 'match'}>
                  {aiLoading === 'match' ? <><span className="spinner"></span> Analyzing...</> : '🎯 Match Score'}
                </button>
                <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }} onClick={() => handleCoverLetter(selectedJob.id)} disabled={aiLoading === 'cover'}>
                  {aiLoading === 'cover' ? <><span className="spinner"></span> Generating...</> : '✉️ Cover Letter'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => handleApply(selectedJob.id)}>📤 Apply Now</button>
              </div>
            </div>

            {/* Match Result */}
            {matchResult && (
              <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <div className={`score-circle ${scoreClass(matchResult.matchScore)}`}>{matchResult.matchScore}%</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16 }}>Job Match Score</p>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{matchResult.recommendation}</p>
                  </div>
                </div>
                <div className="grid-2">
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: '#10b981', marginBottom: 6 }}>✅ Matching Skills</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(matchResult.matchingSkills || []).map((s, i) => <span key={i} className="badge badge-success">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: '#ef4444', marginBottom: 6 }}>❌ Missing Skills</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(matchResult.missingSkills || []).map((s, i) => <span key={i} className="badge badge-danger">{s}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {coverLetter && (
              <div className="card" style={{ background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                <div className="flex-between mb-16">
                  <p style={{ fontWeight: 700 }}>✉️ AI Cover Letter</p>
                  <button onClick={() => navigator.clipboard.writeText(coverLetter).then(() => toast.success('Copied!'))} className="btn btn-secondary btn-sm">📋 Copy</button>
                </div>
                <div className="ai-result" style={{ background: 'transparent', border: 'none', padding: 0 }}>{coverLetter}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
