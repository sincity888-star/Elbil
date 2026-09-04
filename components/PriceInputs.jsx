'use client';

import React, { useState } from 'react';
import { Zap, Fuel, RotateCcw, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatNumber, formatPricePerKwh, formatPricePerLitre } from '../utils/formatters';

export default function PriceInputs({
  petrolPrice,
  onChangePetrolPrice,
  defaultPetrolPrice,
  isPetrolManual,
  onResetPetrolPrice,

  // Elpris data
  spotPriceDk1,
  homePriceKwh,
  effectiveKwhPrice,
  hasRefund,
  onToggleRefund,
  homeSharePercent,
  onChangeHomeSharePercent,
  showHourlyChart,
  onToggleHourlyChart,
  isLiveLoading
}) {
  const [showTariffDetails, setShowTariffDetails] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px' }}>
      
      {/* 1. BENZINPRIS KORT */}
      <div className="premium-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Fuel size={18} color="var(--petrol-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                Benzinpris (Oktan 95)
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isPetrolManual ? 'Manuelt indtastet pumpepris' : 'Aktuel dagspris (DK gns.)'}
              </p>
            </div>
          </div>

          {/* Tast/Ret boks */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isPetrolManual && (
              <button
                onClick={onResetPetrolPrice}
                title="Gendan standardpris"
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', padding: '4px'
                }}
              >
                <RotateCcw size={15} />
              </button>
            )}

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="number"
                step="0.05"
                min="10.00"
                max="25.00"
                value={petrolPrice}
                onChange={(e) => onChangePetrolPrice(Number(e.target.value))}
                className="input-number-box"
                style={{ width: '90px' }}
              />
              <span style={{ position: 'absolute', right: '10px', fontSize: '0.8rem', color: 'var(--text-dim)', pointerEvents: 'none' }}>
                kr.
              </span>
            </div>
          </div>
        </div>

        <input
          type="range"
          className="slider-petrol"
          min="11.50"
          max="19.50"
          step="0.10"
          value={petrolPrice}
          onChange={(e) => onChangePetrolPrice(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${((petrolPrice - 11.50) / (19.50 - 11.50)) * 100}%, rgba(255,255,255,0.1) ${((petrolPrice - 11.50) / (19.50 - 11.50)) * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
      </div>

      {/* 2. ELPRIS VEST (DK1) KORT */}
      <div className="premium-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
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
                  Auto
                </span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Rå spotpris lige nu: {isLiveLoading ? 'Henter...' : `${spotPriceDk1.toFixed(2)} kr./kWh`}
              </p>
            </div>
          </div>

          {/* Effektiv forbrugerpris */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399', letterSpacing: '-0.02em' }}>
              {formatPricePerKwh(effectiveKwhPrice)}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              Effektiv ladepris
            </span>
          </div>
        </div>

        {/* Ladeabonnement & Refusion Switch */}
        <div 
          onClick={onToggleRefund}
          style={{
            background: hasRefund ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0,0,0,0.25)',
            border: '1px solid ' + (hasRefund ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'),
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            margin: '8px 0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color={hasRefund ? '#10b981' : '#6b7280'} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: hasRefund ? '#ffffff' : 'var(--text-muted)' }}>
                Elafgiftsrefusion ved hjemmeladning
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                F.eks. Clever, Monta, OK, Spirii (-0,95 kr./kWh)
              </div>
            </div>
          </div>

          <div style={{
            width: '40px', height: '22px', borderRadius: '12px',
            background: hasRefund ? 'var(--ev-primary)' : '#374151',
            position: 'relative', transition: 'background 0.2s ease'
          }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', background: 'white',
              position: 'absolute', top: '2px', left: hasRefund ? '20px' : '2px',
              transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
            }} />
          </div>
        </div>
      </div>

    </div>
  );
}
