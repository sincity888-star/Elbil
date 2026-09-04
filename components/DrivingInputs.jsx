'use client';

import React from 'react';
import { Gauge, Navigation } from 'lucide-react';
import { formatKm } from '../utils/formatters';

const PRESET_KM_CHIPS = [10000, 15000, 20000, 25000, 35000];

export default function DrivingInputs({ annualKm, onChangeKm }) {
  return (
    <div className="premium-card" style={{ margin: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Navigation size={18} color="#9ca3af" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
              Årlig Kørsel
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Dit gennemsnitlige kørselsbehov
            </p>
          </div>
        </div>

        {/* Live Km Talboks */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '6px 12px',
          fontSize: '1.1rem',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}>
          {formatKm(annualKm)}
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="5000"
        max="60000"
        step="1000"
        value={annualKm}
        onChange={(e) => onChangeKm(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${((annualKm - 5000) / (60000 - 5000)) * 100}%, rgba(255,255,255,0.1) ${((annualKm - 5000) / (60000 - 5000)) * 100}%, rgba(255,255,255,0.1) 100%)`
        }}
      />

      {/* Quick Chips */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between', marginTop: '4px' }}>
        {PRESET_KM_CHIPS.map((km) => {
          const isActive = annualKm === km;
          return (
            <button
              key={km}
              onClick={() => onChangeKm(km)}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: '8px',
                border: '1px solid ' + (isActive ? 'rgba(255,255,255,0.3)' : 'var(--border-subtle)'),
                background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {km / 1000}k
            </button>
          );
        })}
      </div>
    </div>
  );
}
