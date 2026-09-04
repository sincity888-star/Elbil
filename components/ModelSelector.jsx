'use client';

import React from 'react';
import { PRESET_EV_CARS, PRESET_PETROL_CARS } from '../data/cars';
import { formatCurrency } from '../utils/formatters';
import { Zap, Fuel, Sliders, Check } from 'lucide-react';

export default function ModelSelector({
  selectedEv,
  onSelectEv,
  selectedPetrol,
  onSelectPetrol,
  activeTab,
  onTabChange,
  isCustomEv,
  onToggleCustomEv,
  isCustomPetrol,
  onToggleCustomPetrol
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '0 16px' }}>
      
      {/* Segmented Switcher for Tabs */}
      <div className="segmented-control">
        <button
          className={`segmented-btn ${activeTab === 'ev' ? 'active-ev' : ''}`}
          onClick={() => onTabChange('ev')}
        >
          <Zap size={16} />
          <span>Vælg Elbil</span>
        </button>
        <button
          className={`segmented-btn ${activeTab === 'petrol' ? 'active-petrol' : ''}`}
          onClick={() => onTabChange('petrol')}
        >
          <Fuel size={16} />
          <span>Vælg Benzinbil</span>
        </button>
      </div>

      {/* Model Cards Scroll Grid */}
      {activeTab === 'ev' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Populære elbiler i DK:
            </span>
            <button
              onClick={onToggleCustomEv}
              style={{
                background: isCustomEv ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                border: '1px solid ' + (isCustomEv ? 'var(--ev-primary)' : 'var(--border-subtle)'),
                color: isCustomEv ? '#34d399' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '600'
              }}
            >
              <Sliders size={12} />
              <span>{isCustomEv ? '✓ Egen elbil valgt' : 'Tilpas egen elbil'}</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px'
          }}>
            {PRESET_EV_CARS.map((car) => {
              const isSelected = !isCustomEv && selectedEv.id === car.id;
              return (
                <div
                  key={car.id}
                  onClick={() => onSelectEv(car)}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                    border: '1px solid ' + (isSelected ? 'var(--ev-primary)' : 'var(--border-subtle)'),
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{car.icon}</span>
                    {isSelected && (
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: 'var(--ev-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Check size={12} color="#ffffff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff', marginBottom: '2px' }}>
                    {car.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {car.kmPerKwh} km/kWh
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#34d399' }}>
                    {formatCurrency(car.price)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Populære benzinbiler i DK:
            </span>
            <button
              onClick={onToggleCustomPetrol}
              style={{
                background: isCustomPetrol ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
                border: '1px solid ' + (isCustomPetrol ? 'var(--petrol-primary)' : 'var(--border-subtle)'),
                color: isCustomPetrol ? '#fb7185' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '600'
              }}
            >
              <Sliders size={12} />
              <span>{isCustomPetrol ? '✓ Egen benzinbil valgt' : 'Tilpas egen benzinbil'}</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px'
          }}>
            {PRESET_PETROL_CARS.map((car) => {
              const isSelected = !isCustomPetrol && selectedPetrol.id === car.id;
              return (
                <div
                  key={car.id}
                  onClick={() => onSelectPetrol(car)}
                  style={{
                    background: isSelected ? 'rgba(244, 63, 94, 0.12)' : 'var(--bg-card)',
                    border: '1px solid ' + (isSelected ? 'var(--petrol-primary)' : 'var(--border-subtle)'),
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 15px rgba(244, 63, 94, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{car.icon}</span>
                    {isSelected && (
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: 'var(--petrol-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Check size={12} color="#ffffff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff', marginBottom: '2px' }}>
                    {car.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {car.kmPerLitre} km/l
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fb7185' }}>
                    {formatCurrency(car.price)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
