'use client';

import React from 'react';

export default function SectionHeader({
  step,
  title,
  subtitle,
  icon: Icon,
  color = '#6366f1',
  badge
}) {
  return (
    <div
      style={{
        marginTop: '12px',
        marginBottom: '6px',
        padding: '0 4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      {/* Top divider linje med farvet gradient glow */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${color} 25%, ${color} 75%, transparent 100%)`,
          opacity: 0.35,
          marginBottom: '8px'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Ikon med farvet glød */}
          {Icon && (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${color}25, ${color}10)`,
                border: `1px solid ${color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                boxShadow: `0 0 14px ${color}25`
              }}
            >
              <Icon size={16} />
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  color: color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                {badge || `Trin ${step}`}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>•</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                {title}
              </h3>
            </div>
            {subtitle && (
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
