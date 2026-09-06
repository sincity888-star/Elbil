'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export default function Header({ dk1Price, isLiveLoading, priceArea = 'DK1' }) {
  const displayPrice = (dk1Price !== undefined && dk1Price !== null) ? Number(dk1Price).toFixed(2) : '0,20';

  return (
    <header style={{
      padding: '20px 20px 14px 20px',
      background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.9) 0%, rgba(10, 14, 23, 0) 100%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #f43f5e 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}>
            <Zap size={22} color="#ffffff" style={{ transform: 'rotate(-10deg)' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.25rem', fontWeight: '800', fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <span>Elbil</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>vs.</span>
              <span style={{ color: 'var(--petrol-primary)' }}>Benzin</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Sincitys Beregner
            </p>
          </div>
        </div>

        {/* Live Spot Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '6px 10px', borderRadius: '20px'
        }}>
          <div className="live-pulse" />
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#34d399' }}>
            {priceArea} Spot
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>•</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff' }}>
            {isLiveLoading ? 'Henter...' : `${displayPrice} kr.`}
          </span>
        </div>
      </div>
    </header>
  );
}
