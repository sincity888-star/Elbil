'use client';

import React, { useState } from 'react';
import { Moon, Sun, Info, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { formatPricePerKwh } from '../utils/formatters';

export default function HourlyPriceChart({ hours = [], onSelectHourPrice, priceArea = 'DK1' }) {
  const [selectedHour, setSelectedHour] = useState(null);

  if (!hours || hours.length === 0) {
    return (
      <div className="premium-card" style={{ margin: '0 16px', textAlign: 'center', padding: '24px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Indlæser timepriser for {priceArea}...</p>
      </div>
    );
  }

  // Find max pris til søjlehøjde
  const maxPrice = Math.max(...hours.map(h => h.consumerPriceHome), 2.00);
  const minPrice = Math.min(...hours.map(h => h.consumerPriceHome));
  const currentHourRecord = hours.find(h => h.isCurrent) || hours[0];
  const activeDetail = selectedHour || currentHourRecord;

  return (
    <div className="premium-card" style={{ margin: '0 16px', background: '#0e1522' }}>
      
      {/* Header med tip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Moon size={16} color="#38bdf8" />
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
              Døgnets Timepriser ({priceArea === 'DK2' ? 'DK2 Øst' : 'DK1 Vest'})
            </h4>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Grønne søjler er de billigste timer · Tryk på en time for at vælge den
          </p>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '4px 8px',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <ArrowDownRight size={12} />
          <span>Laveste: {minPrice.toFixed(2)} kr.</span>
        </div>
      </div>

      {/* Søjlediagram (24 timer) */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        height: '110px',
        paddingBottom: '22px',
        position: 'relative',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {hours.map((item, idx) => {
          const heightPercent = Math.max(15, Math.min(100, (item.consumerPriceHome / maxPrice) * 100));
          const isCheap = item.isLowest;
          const isCurrent = item.isCurrent;
          const isSelected = selectedHour?.hour === item.hour;

          let barColor = '#475569';
          if (isCheap) barColor = '#10b981';
          if (isCurrent) barColor = '#38bdf8';
          if (isSelected) barColor = '#fbbf24';

          return (
            <div
              key={idx}
              onClick={() => setSelectedHour(item)}
              style={{
                flex: 1,
                height: `${heightPercent}%`,
                background: isSelected
                  ? 'linear-gradient(180deg, #fde047 0%, #d97706 100%)'
                  : isCheap
                  ? 'linear-gradient(180deg, #34d399 0%, #059669 100%)'
                  : isCurrent
                  ? 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)'
                  : 'rgba(255, 255, 255, 0.15)',
                borderRadius: '3px 3px 0 0',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 0 10px rgba(251, 191, 36, 0.6)' : isCheap ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'
              }}
            >
              {/* Lille prik over aktuel time */}
              {isCurrent && (
                <div style={{
                  position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
                  width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8',
                  boxShadow: '0 0 6px #38bdf8'
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Tidsakse */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '6px' }}>
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>

      {/* Detaljeboks for valgt/aktiv time */}
      <div style={{
        marginTop: '12px',
        background: 'rgba(0, 0, 0, 0.35)',
        border: selectedHour ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '10px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#ffffff' }}>
          <div style={{ fontWeight: '700', color: selectedHour ? '#fbbf24' : '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Kl. {activeDetail ? activeDetail.hour : 'Lige nu'}</span>
            {activeDetail?.isCurrent && <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>(Lige nu)</span>}
            {activeDetail?.isLowest && <span style={{ fontSize: '0.68rem', color: '#34d399' }}>· Billigste</span>}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginTop: '2px' }}>
            Rå spot: <b style={{ color: '#ffffff' }}>{(activeDetail?.spotPriceKwh ?? 0).toFixed(2)} kr.</b> · I stikkontakt: <b style={{ color: '#34d399' }}>{(activeDetail?.consumerPriceHome ?? 0).toFixed(2)} kr.</b>
          </div>
        </div>

        {onSelectHourPrice && (
          <button
            onClick={() => onSelectHourPrice(activeDetail?.spotPriceKwh ?? 0)}
            style={{
              background: selectedHour ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(56, 189, 248, 0.15)',
              border: selectedHour ? 'none' : '1px solid rgba(56, 189, 248, 0.3)',
              color: selectedHour ? '#000000' : '#38bdf8',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.72rem',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {selectedHour ? '⚡ Brug denne time' : 'Valgt'}
          </button>
        )}
      </div>

    </div>
  );
}
