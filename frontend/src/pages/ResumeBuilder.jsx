import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import ResumePreview from '../components/ResumePreview';

const emptyResume = {
  title: 'My Resume', fullName: '', email: '', phone: '', location: '',
  linkedin: '', github: '', website: '', summary: '',
  experience: [], education: [], skills: [], projects: [], certifications: [],
};

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(emptyResume);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const isNew = !id || id === 'new';

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      api.get(`/resumes/${id}`)
        .then(res => setResume(res.data.resume))
        .catch(() => { toast.error('Resume not found'); navigate('/resumes'); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const res = await api.post('/resumes', resume);
        toast.success('Resume saved! ✅');
        navigate(`/resumes/${res.data.resume.id}`);
      } else {
        await api.put(`/resumes/${id}`, resume);
        toast.success('Resume updated! ✅');
      }
    } catch (err) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleAiImprove = async () => {
    if (isNew) return toast.error('Save resume first to use AI!');
    setAiLoading(true);
    setAiSuggestion('');
    try {
      const res = await api.post(`/resumes/${id}/improve`);
      setAiSuggestion(res.data.suggestion);
      toast.success('AI analysis done! 🤖');
    } catch (err) {
      toast.error('AI service error. Check your API key.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAtsScore = async () => {
    if (isNew) return toast.error('Save resume first to use ATS check!');
    setAtsLoading(true);
    setAtsResult(null);
    try {
      const res = await api.post(`/resumes/${id}/ats-score`);
      setAtsResult(res.data.scoreData);
      toast.success('ATS check complete! 🎯');
    } catch (err) {
      toast.error('AI service error. Check your API key.');
    } finally {
      setAtsLoading(false);
    }
  };

  // Array field helpers
  const addItem = (field, item) => setResume(r => ({ ...r, [field]: [...(r[field] || []), item] }));
  const updateItem = (field, idx, data) => setResume(r => ({ ...r, [field]: r[field].map((x, i) => i === idx ? { ...x, ...data } : x) }));
  const removeItem = (field, idx) => setResume(r => ({ ...r, [field]: r[field].filter((_, i) => i !== idx) }));

  const tabs = [
    { key: 'personal', label: '👤 Personal' },
    { key: 'summary', label: '📝 Summary' },
    { key: 'experience', label: '💼 Experience' },
    { key: 'education', label: '🎓 Education' },
    { key: 'skills', label: '⚡ Skills' },
    { key: 'projects', label: '🚀 Projects' },
  ];

  if (loading) return (
    <div className="flex-center" style={{ minHeight: 400 }}><div className="spinner spinner-dark" style={{ width: 40, height: 40 }}></div></div>
  );

  return (
    <div className="builder-layout" style={{ display: 'grid', gridTemplateColumns: showPreview ? '55% 45%' : '1fr', gap: 24 }}>
      {/* Builder Panel */}
      <div className={showPreview ? 'hide-on-mobile' : ''}>
        {/* Header */}
        <div className="card" style={{ marginBottom: 16, padding: '12px 16px' }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                value={resume.title}
                onChange={e => setResume({ ...resume, title: e.target.value })}
                style={{ fontSize: 18, fontWeight: 700, border: 'none', outline: 'none', background: 'transparent', color: '#0f172a', maxWidth: '180px' }}
              />
            </div>
            <div className="mobile-stack" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={() => setShowPreview(!showPreview)} className="btn btn-secondary btn-sm">
                {showPreview ? '🙈 Hide Preview' : '👁️ Preview'}
              </button>
              <button onClick={handleAiImprove} className="btn btn-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }} disabled={aiLoading}>
                {aiLoading ? <><span className="spinner"></span> Analyzing...</> : '🤖 AI Improve'}
              </button>
              <button onClick={handleAtsScore} className="btn btn-sm" style={{ background: '#10b981', color: 'white' }} disabled={atsLoading}>
                {atsLoading ? <><span className="spinner"></span> Checking...</> : '🎯 ATS Score'}
              </button>
              <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? <><span className="spinner"></span> Saving...</> : '💾 Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mobile-scroll-x" style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto', padding: '2px 0' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className="btn btn-sm"
              style={{ background: activeTab === t.key ? '#6366f1' : 'white', color: activeTab === t.key ? 'white' : '#4b5563', border: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card">
          {/* Personal Info */}
          {activeTab === 'personal' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Personal Information</h3>
              <div className="grid-2">
                {[['fullName', 'Full Name', 'Rahul Sharma'], ['email', 'Email', 'rahul@gmail.com'], ['phone', 'Phone', '+91 98765 43210'], ['location', 'Location', 'Indore, MP']].map(([key, label, ph]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-input" placeholder={ph} value={resume[key] || ''} onChange={e => setResume({ ...resume, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="grid-3" style={{ marginTop: 0 }}>
                {[['linkedin', 'LinkedIn URL', 'linkedin.com/in/rahul'], ['github', 'GitHub URL', 'github.com/rahul'], ['website', 'Portfolio URL', 'rahul.dev']].map(([key, label, ph]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-input" placeholder={ph} value={resume[key] || ''} onChange={e => setResume({ ...resume, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {activeTab === 'summary' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Professional Summary</h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Write 2-4 sentences about your professional background and key strengths.</p>
              <textarea
                className="form-input form-textarea"
                rows={6}
                placeholder="Results-driven software developer with 2+ years of experience building scalable web applications..."
                value={resume.summary || ''}
                onChange={e => setResume({ ...resume, summary: e.target.value })}
              />
            </div>
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <div>
              <div className="flex-between mb-16">
                <h3 style={{ fontWeight: 700 }}>Work Experience</h3>
                <button className="btn btn-primary btn-sm" onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', current: false, description: '' })}>+ Add</button>
              </div>
              {(resume.experience || []).map((exp, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Company</label><input className="form-input" placeholder="Google Inc." value={exp.company || ''} onChange={e => updateItem('experience', i, { company: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Role / Title</label><input className="form-input" placeholder="Software Engineer" value={exp.role || ''} onChange={e => updateItem('experience', i, { role: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" type="month" value={exp.startDate || ''} onChange={e => updateItem('experience', i, { startDate: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">End Date</label><input className="form-input" type="month" value={exp.endDate || ''} onChange={e => updateItem('experience', i, { endDate: e.target.value })} disabled={exp.current} placeholder={exp.current ? 'Present' : ''} /></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <input type="checkbox" id={`cur-${i}`} checked={exp.current || false} onChange={e => updateItem('experience', i, { current: e.target.checked, endDate: '' })} />
                    <label htmlFor={`cur-${i}`} style={{ fontSize: 13 }}>Currently working here</label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (use bullet points)</label>
                    <textarea className="form-input form-textarea" rows={3} placeholder="• Built REST APIs that improved response time by 40%..." value={exp.description || ''} onChange={e => updateItem('experience', i, { description: e.target.value })} />
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem('experience', i)}>🗑️ Remove</button>
                </div>
              ))}
              {(resume.experience || []).length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 30 }}>No experience added yet. Click "+ Add" to start.</p>}
            </div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <div>
              <div className="flex-between mb-16">
                <h3 style={{ fontWeight: 700 }}>Education</h3>
                <button className="btn btn-primary btn-sm" onClick={() => addItem('education', { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' })}>+ Add</button>
              </div>
              {(resume.education || []).map((edu, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Institution</label><input className="form-input" placeholder="IIT Bombay" value={edu.institution || ''} onChange={e => updateItem('education', i, { institution: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Degree</label><input className="form-input" placeholder="B.Tech" value={edu.degree || ''} onChange={e => updateItem('education', i, { degree: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Field of Study</label><input className="form-input" placeholder="Computer Science" value={edu.field || ''} onChange={e => updateItem('education', i, { field: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">CGPA / Percentage</label><input className="form-input" placeholder="8.5 / 10" value={edu.grade || ''} onChange={e => updateItem('education', i, { grade: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Start Year</label><input className="form-input" type="number" placeholder="2020" value={edu.startYear || ''} onChange={e => updateItem('education', i, { startYear: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">End Year</label><input className="form-input" type="number" placeholder="2024" value={edu.endYear || ''} onChange={e => updateItem('education', i, { endYear: e.target.value })} /></div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem('education', i)}>🗑️ Remove</button>
                </div>
              ))}
              {(resume.education || []).length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 30 }}>No education added yet.</p>}
            </div>
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <div>
              <div className="flex-between mb-16">
                <h3 style={{ fontWeight: 700 }}>Skills</h3>
                <button className="btn btn-primary btn-sm" onClick={() => addItem('skills', { category: 'Technical', items: '' })}>+ Add Category</button>
              </div>
              {(resume.skills || []).map((sk, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Category</label><input className="form-input" placeholder="Technical / Soft / Tools" value={sk.category || ''} onChange={e => updateItem('skills', i, { category: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Skills (comma separated)</label><input className="form-input" placeholder="React, Node.js, MySQL..." value={sk.items || ''} onChange={e => updateItem('skills', i, { items: e.target.value })} /></div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem('skills', i)}>🗑️ Remove</button>
                </div>
              ))}
              {(resume.skills || []).length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 30 }}>No skills added yet.</p>}
            </div>
          )}

          {/* Projects */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex-between mb-16">
                <h3 style={{ fontWeight: 700 }}>Projects</h3>
                <button className="btn btn-primary btn-sm" onClick={() => addItem('projects', { name: '', tech: '', link: '', description: '' })}>+ Add Project</button>
              </div>
              {(resume.projects || []).map((proj, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Project Name</label><input className="form-input" placeholder="Smart Resume Builder" value={proj.name || ''} onChange={e => updateItem('projects', i, { name: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Technologies Used</label><input className="form-input" placeholder="React, Node.js, MySQL" value={proj.tech || ''} onChange={e => updateItem('projects', i, { tech: e.target.value })} /></div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Project Link (GitHub/Live)</label><input className="form-input" placeholder="https://github.com/..." value={proj.link || ''} onChange={e => updateItem('projects', i, { link: e.target.value })} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-input form-textarea" rows={3} placeholder="Built a full-stack web app that helps users..." value={proj.description || ''} onChange={e => updateItem('projects', i, { description: e.target.value })} /></div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem('projects', i)}>🗑️ Remove</button>
                </div>
              ))}
              {(resume.projects || []).length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 30 }}>No projects added yet.</p>}
            </div>
          )}
        </div>

        {/* AI Suggestion */}
        {aiSuggestion && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="flex-between mb-16">
              <h3 style={{ fontWeight: 700 }}>🤖 AI Suggestions</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setAiSuggestion('')}>✕ Close</button>
            </div>
            <div className="ai-result">{aiSuggestion}</div>
          </div>
        )}

        {/* ATS Score Result */}
        {atsResult && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="flex-between mb-16">
              <h3 style={{ fontWeight: 700 }}>🎯 ATS Score Results</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setAtsResult(null)}>✕ Close</button>
            </div>
            <div style={{ padding: '0 8px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span style={{ 
                  display: 'inline-block',
                  background: atsResult.overallScore > 70 ? '#d1fae5' : (atsResult.overallScore >= 40 ? '#fef3c7' : '#fee2e2'),
                  color: atsResult.overallScore > 70 ? '#065f46' : (atsResult.overallScore >= 40 ? '#92400e' : '#991b1b'),
                  padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px' 
                }}>Verdict: {atsResult.verdict}</span>
                <div style={{ 
                  width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `8px solid ${atsResult.overallScore > 70 ? '#10b981' : (atsResult.overallScore >= 40 ? '#f59e0b' : '#ef4444')}`,
                  fontSize: '32px', fontWeight: 'bold'
                }}>
                  {atsResult.overallScore}%
                </div>
              </div>
              
              <div className="grid-2">
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px' }}>Section Scores</h4>
                  {Object.entries(atsResult.sections || {}).map(([sec, score]) => (
                    <div key={sec} style={{ marginBottom: '8px' }}>
                      <div className="flex-between" style={{ fontSize: '12px', marginBottom: '4px', textTransform: 'capitalize' }}>
                        <span>{sec}</span><span>{score}%</span>
                      </div>
                      <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ background: '#6366f1', height: '100%', width: `${score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px' }}>Improvements Needed</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: 'var(--text-muted, #4b5563)' }}>
                    {(atsResult.improvements || []).map((imp, i) => <li key={i} style={{ marginBottom: '4px' }}>{imp}</li>)}
                  </ul>
                </div>
              </div>

              <div className="grid-2" style={{ marginTop: '16px' }}>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', color: '#10b981', fontSize: '14px' }}>✅ Passed Checks</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px' }}>
                    {(atsResult.passedChecks || []).map((pass, i) => <li key={i} style={{ marginBottom: '4px' }}>{pass}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', color: '#ef4444', fontSize: '14px' }}>❌ Failed Checks</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px' }}>
                    {(atsResult.failedChecks || []).map((fail, i) => <li key={i} style={{ marginBottom: '4px' }}>{fail}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div style={{ position: 'sticky', top: '80px', height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <div className="hide-on-desktop" style={{ paddingBottom: 16 }}>
             <button onClick={() => setShowPreview(false)} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
               ⬅️ Back to Editor
             </button>
          </div>
          <ResumePreview resume={resume} />
        </div>
      )}
    </div>
  );
}
