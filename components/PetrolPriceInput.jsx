'use client';

import React from 'react';
import { Fuel, RotateCcw } from 'lucide-react';

export default function PetrolPriceInput({
  petrolPrice,
  onChangePetrolPrice,
  defaultPetrolPrice = 14.29,
  isPetrolManual,
  onResetPetrolPrice
}) {
  return (
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
  );
}
