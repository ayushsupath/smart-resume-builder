import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ width: '100%' }}>
      {/* SECTION 1 - Hero */}
      <section style={{ 
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
        color: 'white', 
        padding: '80px 24px', 
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}>About Smart Resume Builder</h1>
          <p style={{ fontSize: '20px', opacity: 0.9, lineHeight: 1.6, fontWeight: 500 }}>
            Helping freshers and job seekers land their dream jobs with AI-powered resumes
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* SECTION 2 - What We Do */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            <div className="card" style={{ padding: '32px', textAlign: 'center', borderTop: '4px solid #6366f1' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Resume Builder</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Build professional ATS-friendly resumes in minutes</p>
            </div>
            <div className="card" style={{ padding: '32px', textAlign: 'center', borderTop: '4px solid #8b5cf6' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>AI Powered</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Get AI suggestions to improve your resume instantly</p>
            </div>
            <div className="card" style={{ padding: '32px', textAlign: 'center', borderTop: '4px solid #10b981' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>ATS Optimized</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Our resumes pass ATS scanners used by top companies</p>
            </div>
          </div>
        </section>

        {/* SECTION 3 - Features List */}
        <section style={{ padding: '0 0 80px' }}>
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px', color: 'var(--text)' }}>Everything you need to get hired</h2>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px',
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              {[
                'Professional Resume Builder',
                'AI Resume Improvement',
                'ATS Score Checker',
                'Upload & Analyze Existing Resume',
                'AI Cover Letter Generator',
                'Multiple Resume Templates',
                'PDF Download',
                '100% Free to use'
              ].map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', color: 'var(--text)', fontWeight: 500 }}>
                  <span style={{ fontSize: '20px' }}>✅</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 4 - Tech Stack Used */}
        <section style={{ padding: '0 0 80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px', color: 'var(--text)' }}>Built With</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
            {[
              'React.js', 'Node.js', 'MySQL', 'Groq AI', 
              'Express.js', 'JWT Auth', 'Vite'
            ].map((tech, i) => (
              <span key={i} style={{ 
                background: 'var(--surface-50)', 
                color: 'var(--text)', 
                padding: '12px 24px', 
                borderRadius: '30px', 
                fontSize: '16px', 
                fontWeight: 600,
                border: '1px solid var(--border)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* SECTION 5 - CTA */}
        <section style={{ padding: '0 0 80px', textAlign: 'center' }}>
          <div style={{ background: 'var(--primary-light)', padding: '64px 24px', borderRadius: '24px', border: '1px solid var(--primary)' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px', color: 'var(--primary)' }}>Ready to build your dream resume?</h2>
            <Link to="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px', display: 'inline-flex' }}>
              Get Started Free →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
