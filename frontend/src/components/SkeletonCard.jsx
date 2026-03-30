import React from 'react';

export default function SkeletonCard({ variant = 'card' }) {
  if (variant === 'list') {
    return (
      <div className="card skeleton-container" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12 }}></div>
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 8 }}></div>
            <div className="skeleton" style={{ height: 12, width: '20%' }}></div>
          </div>
          <div className="skeleton" style={{ width: 60, height: 32, borderRadius: 6 }}></div>
        </div>
      </div>
    );
  }

  // default variant 'card'
  return (
    <div className="card skeleton-container" style={{ minHeight: 180 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12 }}></div>
        <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 12 }}></div>
      </div>
      <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }}></div>
      <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 16 }}></div>
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <div className="skeleton" style={{ height: 32, flex: 1, borderRadius: 6 }}></div>
        <div className="skeleton" style={{ height: 32, flex: 1, borderRadius: 6 }}></div>
      </div>
    </div>
  );
}
