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
  onToggleCustomPetrol,
  customEv,
  onUpdateCustomEv,
  customPetrol,
  onUpdateCustomPetrol
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

      {/* Custom Car Inline Editor when Custom Mode is Enabled */}
      {activeTab === 'ev' && isCustomEv && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid var(--ev-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#34d399" />
            <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>
              Tilpas din egen elbil
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Bilens modelnavn
              </label>
              <input
                type="text"
                value={customEv.name}
                onChange={(e) => onUpdateCustomEv({ ...customEv, name: e.target.value })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
                placeholder="F.eks. Tesla Model 3"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Købspris (kr.)
              </label>
              <input
                type="number"
                value={customEv.price}
                onChange={(e) => onUpdateCustomEv({ ...customEv, price: Number(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Grøn ejerafgift (kr./halvår)
              </label>
              <input
                type="number"
                value={customEv.halfYearTax}
                onChange={(e) => onUpdateCustomEv({ ...customEv, halfYearTax: Number(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Årlig kaskoforsikring (kr./år)
              </label>
              <input
                type="number"
                value={customEv.insuranceYear}
                onChange={(e) => onUpdateCustomEv({ ...customEv, insuranceYear: Number(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Årlig service & dæk (kr./år)
              </label>
              <input
                type="number"
                value={customEv.annualService}
                onChange={(e) => onUpdateCustomEv({ ...customEv, annualService: Number(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Petrol Inline Editor when Custom Mode is Enabled */}
      {activeTab === 'petrol' && isCustomPetrol && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid var(--petrol-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#fb7185" />
            <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>
              Tilpas din egen benzinbil
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Bilens modelnavn
              </label>
              <input
                type="text"
                value={customPetrol.name}
                onChange={(e) => onUpdateCustomPetrol({ ...customPetrol, name: e.target.value })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
                placeholder="F.eks. Ford Focus"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Købspris (kr.)
              </label>
              <input
                type="number"
                value={customPetrol.price}
                onChange={(e) => onUpdateCustomPetrol({ ...customPetrol, price: Number(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Grøn ejerafgift (kr./halvår)
              </label>
              <input
                type="number"
                value={customPetrol.halfYearTax}
                onChange={(e) => onUpdateCustomPetrol({ ...customPetrol, halfYearTax: Number(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Årlig kaskoforsikring (kr./år)
              </label>
              <input
                type="number"
                value={customPetrol.insuranceYear}
                onChange={(e) => onUpdateCustomPetrol({ ...customPetrol, insuranceYear: Number(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Årlig service & reparation (kr./år)
              </label>
              <input
                type="number"
                value={customPetrol.annualService}
                onChange={(e) => onUpdateCustomPetrol({ ...customPetrol, annualService: Number(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
