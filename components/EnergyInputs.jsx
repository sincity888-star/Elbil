'use client';

import React from 'react';
import { Zap, Fuel, Plus, Minus } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export default function EnergyInputs({
  kmPerKwh,
  onChangeKmPerKwh,
  kmPerLitre,
  onChangeKmPerLitre,
  evName,
  petrolName
}) {
  // Hjælpekonverteringer
  const kwhPer100Km = kmPerKwh > 0 ? (100 / kmPerKwh).toFixed(1) : 0;
  const litrePer100Km = kmPerLitre > 0 ? (100 / kmPerLitre).toFixed(1) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px' }}>
      
      {/* 1. ELBIL FORBRUG (km pr. kWh) */}
      <div className="premium-card" style={{ borderLeft: '4px solid var(--ev-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <Zap size={16} color="var(--ev-primary)" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                Elbil: Km pr. kilowatt (kWh)
              </h4>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {evName} • Svarer til {kwhPer100Km} kWh / 100 km
            </p>
          </div>

          {/* Talboks & Justering */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => onChangeKmPerKwh(Math.max(2.0, Number((kmPerKwh - 0.2).toFixed(1))))}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.3)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <Minus size={14} />
            </button>

            <div style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--ev-border)',
              borderRadius: '10px',
              padding: '6px 10px',
              minWidth: '76px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#34d399' }}>
                {formatNumber(kmPerKwh, 1)}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '-2px' }}>
                km/kWh
              </span>
            </div>

            <button
              onClick={() => onChangeKmPerKwh(Math.min(10.0, Number((kmPerKwh + 0.2).toFixed(1))))}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.3)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <input
          type="range"
          className="slider-ev"
          min="3.0"
          max="8.5"
          step="0.1"
          value={kmPerKwh}
          onChange={(e) => onChangeKmPerKwh(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((kmPerKwh - 3.0) / (8.5 - 3.0)) * 100}%, rgba(255,255,255,0.1) ${((kmPerKwh - 3.0) / (8.5 - 3.0)) * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
      </div>

      {/* 2. BENZINBIL FORBRUG (km pr. liter) */}
      <div className="premium-card" style={{ borderLeft: '4px solid var(--petrol-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <Fuel size={16} color="var(--petrol-primary)" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                Benzinbil: Km pr. liter
              </h4>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {petrolName} • Svarer til {litrePer100Km} l / 100 km
            </p>
          </div>

          {/* Talboks & Justering */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => onChangeKmPerLitre(Math.max(6.0, Number((kmPerLitre - 0.5).toFixed(1))))}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.3)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <Minus size={14} />
            </button>

            <div style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--petrol-border)',
              borderRadius: '10px',
              padding: '6px 10px',
              minWidth: '76px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fb7185' }}>
                {formatNumber(kmPerLitre, 1)}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '-2px' }}>
                km/l
              </span>
            </div>

            <button
              onClick={() => onChangeKmPerLitre(Math.min(30.0, Number((kmPerLitre + 0.5).toFixed(1))))}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.3)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <input
          type="range"
          className="slider-petrol"
          min="8.0"
          max="26.0"
          step="0.2"
          value={kmPerLitre}
          onChange={(e) => onChangeKmPerLitre(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${((kmPerLitre - 8.0) / (26.0 - 8.0)) * 100}%, rgba(255,255,255,0.1) ${((kmPerLitre - 8.0) / (26.0 - 8.0)) * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
      </div>

    </div>
  );
}
