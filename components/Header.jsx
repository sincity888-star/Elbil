'use client';

import React from 'react';
import { Zap, Sun, Moon } from 'lucide-react';

export default function Header({ dk1Price, isLiveLoading, priceArea = 'DK1', theme = 'dark', onToggleTheme }) {
  const displayPrice = (dk1Price !== undefined && dk1Price !== null) ? Number(dk1Price).toFixed(2) : '0,20';

  return (
    <header style={{
      padding: '18px 20px 14px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo & Titel */}
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

        {/* Højre side: Tema Switcher & Live Spot Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Tema-knap (Lys / Mørk) */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              title={theme === 'light' ? 'Skift til mørkt tema' : 'Skift til lyst tema'}
              aria-label="Skift tema"
              style={{
                background: theme === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
                border: theme === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '5px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--text-main)',
                fontSize: '0.74rem',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                boxShadow: theme === 'light' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {theme === 'light' ? (
                <>
                  <Sun size={15} color="#d97706" />
                  <span>Lys</span>
                </>
              ) : (
                <>
                  <Moon size={15} color="#38bdf8" />
                  <span>Mørk</span>
                </>
              )}
            </button>
          )}

          {/* Live Spot Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '5px 9px', borderRadius: '20px'
          }}>
            <div className="live-pulse" />
            <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#34d399' }}>
              {priceArea}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>•</span>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {isLiveLoading ? '...' : `${displayPrice} kr.`}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}
