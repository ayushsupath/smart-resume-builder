import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingImprove, setLoadingImprove] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [improvedResume, setImprovedResume] = useState('');

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      return toast.error('Only PDF files are allowed.');
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      return toast.error('File too large. Max size is 5MB.');
    }
    setFile(selectedFile);
    setAnalysis(null);
    setImprovedResume('');
  };

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please upload a resume first');
    setLoadingAnalyze(true);
    setAnalysis(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/upload/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        toast.success('Analysis complete! 🎯');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error analyzing resume');
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleImprove = async () => {
    if (!file) return toast.error('Please upload a resume first');
    setLoadingImprove(true);
    setImprovedResume('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/upload/improve', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setImprovedResume(res.data.improvedResume);
        toast.success('Resume improved! ✨');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error improving resume');
    } finally {
      setLoadingImprove(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedResume);
    toast.success('Copied to clipboard! 📋');
  };

  const downloadTxt = () => {
    const element = document.createElement('a');
    const fileBlob = new Blob([improvedResume], {type: 'text/plain'});
    element.href = URL.createObjectURL(fileBlob);
    element.download = 'improved_resume.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>Upload & Analyze Resume</h1>

      {/* SECTION 1 - Upload Area */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s ease',
            marginBottom: '16px'
          }}
          onClick={() => document.getElementById('fileUpload').click()}
        >
          <input 
            type="file" 
            id="fileUpload" 
            style={{ display: 'none' }} 
            accept=".pdf" 
            onChange={handleFileSelect}
          />
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          {file ? (
            <div>
              <p style={{ fontWeight: 600, color: '#334155' }}>{file.name}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <p style={{ fontWeight: 600, color: '#334155' }}>Drop your Resume PDF here or Click to Upload</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Max file size: 5MB</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleAnalyze} 
            disabled={!file || loadingAnalyze}
            style={{ flex: 1, minWidth: '200px' }}
          >
            {loadingAnalyze ? <><span className="spinner" style={{marginRight: '8px'}}></span> Please wait...</> : '🎯 Check ATS Score'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleImprove} 
            disabled={!file || loadingImprove}
            style={{ flex: 1, minWidth: '200px' }}
          >
            {loadingImprove ? <><span className="spinner" style={{marginRight: '8px'}}></span> Please wait...</> : '✨ AI Improve Resume'}
          </button>
        </div>
      </div>

      {/* SECTION 2 - ATS Score Results */}
      {analysis && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>🎯 ATS Analysis Results</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `8px solid ${getScoreColor(analysis.score || (analysis.overallScore || 0))}`,
              fontSize: '32px', fontWeight: 800, color: '#1e293b',
              marginBottom: '16px'
            }}>
              {analysis.score || analysis.overallScore || 0}%
            </div>
            {analysis.verdict && (
              <div style={{
                background: `${getScoreColor(analysis.score || (analysis.overallScore || 0))}20`,
                color: getScoreColor(analysis.score || (analysis.overallScore || 0)),
                padding: '8px 16px', borderRadius: '24px', fontWeight: 600
              }}>
                Verdict: {analysis.verdict}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 700, color: '#10b981', marginBottom: '12px' }}>✅ Key Strengths</h3>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#334155' }}>
                {(analysis.strengths || []).map((s, i) => <li key={i} style={{ marginBottom: '8px' }}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 style={{ fontWeight: 700, color: '#ef4444', marginBottom: '12px' }}>❌ Major Weaknesses</h3>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#334155' }}>
                {(analysis.weaknesses || []).map((w, i) => <li key={i} style={{ marginBottom: '8px' }}>{w}</li>)}
              </ul>
            </div>
          </div>

          {analysis.improvements && analysis.improvements.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: 700, color: '#3b82f6', marginBottom: '12px' }}>💡 Specific Improvements</h3>
              <ol style={{ paddingLeft: '20px', margin: 0, color: '#334155' }}>
                {analysis.improvements.map((imp, i) => <li key={i} style={{ marginBottom: '8px' }}>{imp}</li>)}
              </ol>
            </div>
          )}

          {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 700, color: '#6366f1', marginBottom: '12px' }}>🏷️ Missing Keywords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysis.missingKeywords.map((kw, i) => (
                  <span key={i} style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 500 }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3 - AI Improved Resume */}
      {improvedResume && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>✨ AI Improved Resume</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={copyToClipboard}>📋 Copy</button>
              <button className="btn btn-primary btn-sm" onClick={downloadTxt}>💾 Download as TXT</button>
            </div>
          </div>
          <div style={{ 
            background: '#ffffff', 
            padding: '24px', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            whiteSpace: 'pre-wrap', 
            fontFamily: 'monospace',
            color: '#334155',
            lineHeight: 1.6,
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {improvedResume}
          </div>
        </div>
      )}

      {/* SECTION 4 - Call to action */}
      <div style={{ textAlign: 'center', padding: '32px', background: 'linear-gradient(135deg, #6366f120, #8b5cf620)', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>Want to build a better resume from scratch?</h3>
        <Link to="/resumes/new" className="btn btn-primary" style={{ display: 'inline-flex', padding: '12px 24px', fontSize: '16px' }}>
          ✨ Create New Resume
        </Link>
      </div>
    </div>
  );
}
