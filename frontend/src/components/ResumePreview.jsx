import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function ResumePreview({ resume }) {
  try {
    const r = resume || {};
    const contactItems = [r.email, r.phone, r.location, r.linkedin, r.github].filter(Boolean).join(' | ');

    const wrapperStyle = {
      background: '#f3f4f6',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100%',
      width: '100%'
    };

    const paperStyle = {
      background: '#ffffff',
      width: '100%',
      maxWidth: '700px',
      minHeight: '842px', // Approx A4 height
      padding: '40px 48px',
      color: '#000000',
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: '1.5',
      textAlign: 'left',
      boxSizing: 'border-box'
    };

    const headingStyle = {
      fontSize: '13px',
      fontWeight: 700,
      color: '#000000',
      textTransform: 'uppercase',
      borderBottom: '1.5px solid #000000',
      margin: '0 0 8px 0',
      paddingBottom: '2px'
    };

    const printRef = useRef();

    const handleDownload = useReactToPrint({
      content: () => printRef.current,
      documentTitle: r.fullName ? `${r.fullName.replace(/\s+/g, '_')}_Resume` : 'ATS_Resume',
    });

    return (
      <div style={wrapperStyle} className="preview-wrapper">
        <div style={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button onClick={handleDownload} className="btn btn-success btn-sm btn-lg hide-on-desktop">Download PDF</button>
          <button onClick={handleDownload} className="btn btn-success btn-sm hide-on-mobile">Download ATS Resume</button>
        </div>

        <div style={paperStyle} id="resume-preview-content" ref={printRef} className="preview-paper">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0', color: '#000000' }}>
              {r.fullName || 'Your Name'}
            </h1>
            <div style={{ fontSize: '12px', color: '#000000', marginBottom: '12px' }}>
              {contactItems}
            </div>
            <div style={{ borderBottom: '2px solid #000000' }}></div>
          </div>

          {/* Professional Summary */}
          {r.summary && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={headingStyle}>PROFESSIONAL SUMMARY</h2>
              <div style={{ whiteSpace: 'pre-wrap', color: '#000000' }}>{r.summary}</div>
            </div>
          )}

          {/* Work Experience */}
          {(r.experience || []).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
               <h2 style={headingStyle}>WORK EXPERIENCE</h2>
              {r.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, color: '#000000' }}>{exp.role || ''}</div>
                    <div style={{ color: '#000000' }}>
                      {exp.startDate || ''}{(exp.startDate || exp.endDate) ? ' - ' : ''}{exp.current ? 'Present' : (exp.endDate || '')}
                    </div>
                  </div>
                  <div style={{ fontStyle: 'italic', color: '#000000', marginBottom: '4px' }}>{exp.company || ''}</div>
                  {exp.description && (
                    <div style={{ whiteSpace: 'pre-wrap', color: '#000000' }}>{exp.description || ''}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {(r.education || []).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={headingStyle}>EDUCATION</h2>
              {r.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, color: '#000000' }}>
                      {edu.degree || ''}{edu.field ? ` in ${edu.field}` : ''}
                    </div>
                    <div style={{ color: '#000000' }}>
                      {edu.startYear || ''}{(edu.startYear || edu.endYear) ? ' - ' : ''}{edu.endYear || ''}
                    </div>
                  </div>
                  <div style={{ fontStyle: 'italic', color: '#000000' }}>{edu.institution || ''}</div>
                  {edu.grade && <div style={{ color: '#000000' }}>Grade: {edu.grade || ''}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(r.skills || []).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={headingStyle}>SKILLS</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {r.skills.map((sk, i) => (
                  <div key={i} style={{ color: '#000000' }}>
                    <span style={{ fontWeight: 700, color: '#000000' }}>{sk.category || ''}: </span>
                    <span>{(sk.items || '').split(',').map(s => s.trim()).filter(Boolean).join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {(r.projects || []).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={headingStyle}>PROJECTS</h2>
              {r.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, color: '#000000' }}>
                      {proj.name || ''} {proj.tech && <span style={{ fontWeight: 'normal' }}>({proj.tech || ''})</span>}
                    </div>
                    {proj.link && (
                      <div style={{ fontSize: '11px' }}>
                        <a href={proj.link || ''} target="_blank" rel="noopener noreferrer" style={{ color: '#000000', textDecoration: 'none' }}>
                          {proj.link || ''}
                        </a>
                      </div>
                    )}
                  </div>
                  {proj.description && <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px', color: '#000000' }}>{proj.description || ''}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {(r.certifications || []).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={headingStyle}>CERTIFICATIONS</h2>
              {r.certifications.map((cert, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#000000' }}>{cert.name || (typeof cert === 'string' ? cert : '')}</span>
                      {cert.issuer && <span style={{ color: '#000000' }}> | {cert.issuer || ''}</span>}
                    </div>
                    <div style={{ color: '#000000' }}>
                      {cert.issueDate || ''}{((cert.issueDate) && (cert.expiryDate || cert.noExpiry)) ? ' - ' : ''}{cert.noExpiry ? 'No Expiry' : (cert.expiryDate || '')}
                    </div>
                  </div>
                  {cert.credentialId && <div style={{ color: '#000000' }}>Credential ID: {cert.credentialId || ''}</div>}
                  {cert.url && <div style={{ color: '#000000' }}>{cert.url || ''}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("Preview render error", err);
    return (
      <div style={{ background: '#ffffff', padding: '40px', minHeight: '842px', textAlign: 'center', margin: '40px', borderRadius: '10px' }}>
        <h2 style={{color: '#ff4444'}}>Error Loading Preview</h2>
        <p>There was a problem rendering your resume preview. Please check if all fields are correctly formatted.</p>
      </div>
    );
  }
}
