'use client';

import React, { useState } from 'react';
import { Zap, Fuel, RotateCcw, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import { formatCurrency, formatNumber, formatPricePerKwh, formatPricePerLitre } from '../utils/formatters';

export default function PriceInputs({
  // Elpris data
  spotPriceDk1,
  homePriceKwh,
  effectiveKwhPrice,
  homeSharePercent,
  onChangeHomeSharePercent,
  isLiveLoading
}) {
  const [showTariffDetails, setShowTariffDetails] = useState(false);

  // Udregn momsandelen for gennemsigtighed
  const netTariff = 0.50;
  const stateTax = 0.01;
  const baseBeforeVat = Math.max(0, spotPriceDk1) + netTariff + stateTax;
  const vatAmount = Number((baseBeforeVat * 0.25).toFixed(2));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px' }}>
      
      {/* ELPRIS VEST (DK1) KORT */}
      <div className="premium-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={18} color="var(--ev-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Elpris DK1 Vest</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '6px' }}>
                  Live Data
                </span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Rå spotpris lige nu: <b style={{ color: '#ffffff' }}>{isLiveLoading ? 'Henter...' : `${spotPriceDk1.toFixed(2)} kr./kWh`}</b>
              </p>
            </div>
          </div>

          {/* Reelle hjemmeladepris i stikkontakten lige nu */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#34d399', letterSpacing: '-0.02em' }}>
              {formatPricePerKwh(homePriceKwh)}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              I stikkontakten lige nu
            </span>
          </div>
        </div>

        {/* Gennemsigtig prisoversigt - præcis hvad koster 1 kWh hjemme */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '10px',
            fontSize: '0.74rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>1. Rå markeds-spotpris:</span>
            <span style={{ fontWeight: '600', color: '#ffffff' }}>{spotPriceDk1.toFixed(2)} kr.</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>2. Netselskab transport & tarif:</span>
            <span style={{ fontWeight: '600', color: '#ffffff' }}>0,50 kr.</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ color: '#34d399', fontWeight: '600' }}>3. Statens elafgift (1 øre EU-sats):</span>
            <span style={{ fontWeight: '700', color: '#34d399' }}>0,01 kr.</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>4. Moms (25%):</span>
            <span style={{ fontWeight: '600', color: '#ffffff' }}>+{vatAmount.toFixed(2)} kr.</span>
          </div>
          <div
            style={{
              paddingTop: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: '700'
            }}
          >
            <span style={{ color: '#ffffff' }}>Samlet pris pr. kWh hjemme:</span>
            <span style={{ color: '#34d399', fontSize: '0.88rem' }}>{homePriceKwh.toFixed(2)} kr./kWh</span>
          </div>
        </div>

        {/* Ladefordeling: Hjemme vs. Lynlader */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '10px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sliders size={12} />
              <span>Forventet ladefordeling for årlig kørsel:</span>
            </span>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#22d3ee' }}>
              {homeSharePercent}% hjemme / {100 - homeSharePercent}% lyn
            </span>
          </div>

          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={homeSharePercent}
            onChange={(e) => onChangeHomeSharePercent(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#22d3ee' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>
              Effektiv snitpris for TCO (inkl. farten):
            </span>
            <span style={{ fontWeight: '700', color: '#ffffff' }}>
              {effectiveKwhPrice.toFixed(2)} kr./kWh
            </span>
          </div>
        </div>

        {/* Statens Elafgift Info-badge */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <b style={{ color: '#ffffff' }}>Statens elafgift er 1 øre (0,01 kr.).</b> Der lægges ingen gammel afgift på 90 øre til. Du betaler ren spotpris + nettarif og 1 øre.
          </div>
        </div>

      </div>

    </div>
  );
}
