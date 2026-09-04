'use client';

import React from 'react';
import { formatCurrency, formatPricePerKm } from '../utils/formatters';
import { TrendingUp, ArrowDown, CheckCircle2, Zap, Fuel, Sparkles } from 'lucide-react';

export default function VerdictCard({
  calculations,
  evName,
  petrolName,
  onOpenBreakeven
}) {
  const { ev, petrol, savings } = calculations;
  const isEvCheaper = savings.annualTotal > 0;

  return (
    <div style={{ margin: '0 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* Hovedkort / Hero Card */}
      <div style={{
        background: 'linear-gradient(145deg, #111e2e 0%, #0d1522 100%)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.15)'
      }}>
        {/* Subtilt glød-overlay i toppen */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-40px', width: '160px', height: '160px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#34d399" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399' }}>
              Din Samlede Besparelse
            </span>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#34d399'
          }}>
            {savings.monthlyTotal > 0 ? `${formatCurrency(savings.monthlyTotal)} / md.` : 'Ens pris'}
          </div>
        </div>

        {/* KÆMPE BELØB */}
        <div style={{
          fontSize: '2.4rem',
          fontWeight: '900',
          fontFamily: "'Outfit', sans-serif",
          color: '#ffffff',
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
          margin: '6px 0 14px 0'
        }}>
          {isEvCheaper ? formatCurrency(savings.annualTotal) : `${formatCurrency(Math.abs(savings.annualTotal))} dyrere`}
          <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-muted)', marginLeft: '6px' }}>
            / år
          </span>
        </div>

        {/* 2 Søjler: Elbil vs Benzin i Brændstof / Måned */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Elbil søjle */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <Zap size={14} color="var(--ev-primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                El / måned
              </span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#34d399' }}>
              {formatCurrency(ev.fuelCostMonthly)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              {formatPricePerKm(ev.fuelCostPerKm)} (kun strøm)
            </div>
          </div>

          {/* Benzin søjle */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <Fuel size={14} color="var(--petrol-primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                Benzin / måned
              </span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fb7185' }}>
              {formatCurrency(petrol.fuelCostMonthly)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              {formatPricePerKm(petrol.fuelCostPerKm)} (kun benzin)
            </div>
          </div>
        </div>

        {/* Breakeven trigger knap */}
        {savings.breakevenYears !== null && savings.breakevenYears > 0 && (
          <button
            onClick={onOpenBreakeven}
            style={{
              width: '100%',
              marginTop: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '10px',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <TrendingUp size={15} color="#34d399" />
            <span>Merpris tjent hjem efter: <strong>{savings.breakevenYears} år ({savings.breakevenKm?.toLocaleString('da-DK')} km)</strong></span>
          </button>
        )}
      </div>

    </div>
  );
}
