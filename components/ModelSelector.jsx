'use client';

import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { 
  Zap, 
  Fuel, 
  Sliders, 
  Check, 
  Car, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldCheck,
  Wrench,
  DollarSign
} from 'lucide-react';
import LicensePlateLookup from './LicensePlateLookup';

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
  onUpdateCustomPetrol,
  onApplyCarFromPlate
}) {
  // Overordnet visningstilstand: 'plate' (Nummerplade) eller 'custom' (Konfigurer selv)
  const [activeMode, setActiveMode] = useState('plate');

  // Nuværende viste biler
  const currentEvInfo = isCustomEv ? customEv : selectedEv;
  const currentPetrolInfo = isCustomPetrol ? customPetrol : selectedPetrol;

  const handleSelectCarType = (type) => {
    onTabChange(type);
    setActiveMode('custom');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 16px' }}>
      
      {/* 1. STATUS BAR: AKTUELT VALGTE BILER I BEREGNINGEN */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '10px',
        background: 'var(--box-inset-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 14px'
      }}>
        {/* Elbil Boks */}
        <div 
          onClick={() => handleSelectCarType('ev')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'ev' && activeMode === 'custom' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
            border: '1px solid ' + (activeTab === 'ev' ? 'var(--ev-primary)' : 'var(--border-subtle)'),
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Klik for at konfigurere elbilen"
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'var(--ev-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', color: '#ffffff', flexShrink: 0,
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
          }}>
            {currentEvInfo.icon || '⚡'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '800', color: 'var(--ev-primary)', letterSpacing: '0.05em' }}>
                Aktiv Elbil
              </span>
              {currentEvInfo.badge && (
                <span style={{ fontSize: '0.62rem', background: 'rgba(16,185,129,0.2)', color: 'var(--ev-primary)', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                  {currentEvInfo.badge}
                </span>
              )}
            </div>
            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentEvInfo.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {formatCurrency(currentEvInfo.price)} · {currentEvInfo.kmPerKwh} km/kWh · {currentEvInfo.halfYearTax} kr./h.år
            </div>
          </div>
        </div>

        {/* Benzinbil Boks */}
        <div 
          onClick={() => handleSelectCarType('petrol')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'petrol' && activeMode === 'custom' ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-card)',
            border: '1px solid ' + (activeTab === 'petrol' ? 'var(--petrol-primary)' : 'var(--border-subtle)'),
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Klik for at konfigurere benzinbilen"
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'var(--petrol-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', color: '#ffffff', flexShrink: 0,
            boxShadow: '0 4px 10px rgba(244, 63, 94, 0.3)'
          }}>
            {currentPetrolInfo.icon || '⛽'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '800', color: 'var(--petrol-primary)', letterSpacing: '0.05em' }}>
                Aktiv Benzinbil
              </span>
              {currentPetrolInfo.badge && (
                <span style={{ fontSize: '0.62rem', background: 'rgba(244,63,94,0.2)', color: 'var(--petrol-primary)', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                  {currentPetrolInfo.badge}
                </span>
              )}
            </div>
            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentPetrolInfo.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {formatCurrency(currentPetrolInfo.price)} · {currentPetrolInfo.kmPerLitre} km/l · {currentPetrolInfo.halfYearTax} kr./h.år
            </div>
          </div>
        </div>
      </div>

      {/* 2. HOVED-NAVIGATION: DE 2 VALGMULIGHEDER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        background: 'var(--box-inset-bg)',
        padding: '6px',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setActiveMode('plate')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 10px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '800',
            fontSize: '0.86rem',
            transition: 'all 0.2s ease',
            background: activeMode === 'plate' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
            color: activeMode === 'plate' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeMode === 'plate' ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none'
          }}
        >
          <Car size={18} />
          <span>Nummerpladeopslag (DMR)</span>
        </button>

        <button
          onClick={() => setActiveMode('custom')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 10px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '800',
            fontSize: '0.86rem',
            transition: 'all 0.2s ease',
            background: activeMode === 'custom' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
            color: activeMode === 'custom' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeMode === 'custom' ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
          }}
        >
          <Sliders size={18} />
          <span>Konfigurer selv</span>
        </button>
      </div>

      {/* 3. MODUS 1: NUMMERPLADEOPSLAG (DMR) */}
      {activeMode === 'plate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.2s ease-in-out' }}>
          <LicensePlateLookup
            alwaysOpen={true}
            onApplyCar={(car) => {
              onApplyCarFromPlate(car);
            }}
            activeTab={activeTab}
            onSwitchToCustom={() => setActiveMode('custom')}
          />

          {/* Infoboks om Nummerpladeopslag */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <Info size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              <b style={{ color: '#ffffff' }}>Sådan virker det:</b> Indtast nummerpladen på din egen bil eller den bil, du overvejer at købe. Data som forbrug (WLTP), drivmiddel og grøn ejerafgift hentes direkte. Du kan efterfølgende trykke på <b>"Konfigurer selv"</b> for at justere købspris og forsikring.
            </div>
          </div>
        </div>
      )}

      {/* 4. MODUS 2: KONFIGURER SELV */}
      {activeMode === 'custom' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          {/* Valg af hvilken bil der konfigureres */}
          <div className="segmented-control">
            <button
              className={`segmented-btn ${activeTab === 'ev' ? 'active-ev' : ''}`}
              onClick={() => onTabChange('ev')}
            >
              <Zap size={16} />
              <span>Konfigurer Elbil</span>
            </button>
            <button
              className={`segmented-btn ${activeTab === 'petrol' ? 'active-petrol' : ''}`}
              onClick={() => onTabChange('petrol')}
            >
              <Fuel size={16} />
              <span>Konfigurer Benzinbil</span>
            </button>
          </div>

          {/* Formular for Elbil */}
          {activeTab === 'ev' && (
            <div style={{
              background: 'var(--box-inset-bg)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={20} color="var(--ev-primary)" />
                  <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>
                    Specifikationer for Elbilen
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--ev-primary)', fontWeight: '700' }}>
                  Live opdatering
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Modelnavn
                  </label>
                  <input
                    type="text"
                    value={customEv.name}
                    onChange={(e) => {
                      onUpdateCustomEv({ ...customEv, name: e.target.value });
                      if (!isCustomEv) onToggleCustomEv();
                    }}
                    placeholder="F.eks. Tesla Model Y"
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Købspris (kr.)
                  </label>
                  <input
                    type="number"
                    value={customEv.price}
                    onChange={(e) => {
                      onUpdateCustomEv({ ...customEv, price: Number(e.target.value) || 0 });
                      if (!isCustomEv) onToggleCustomEv();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Forbrug (km/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customEv.kmPerKwh}
                    onChange={(e) => {
                      onUpdateCustomEv({ ...customEv, kmPerKwh: Number(e.target.value) || 0 });
                      if (!isCustomEv) onToggleCustomEv();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Grøn ejerafgift (kr./halvår)
                  </label>
                  <input
                    type="number"
                    value={customEv.halfYearTax}
                    onChange={(e) => {
                      onUpdateCustomEv({ ...customEv, halfYearTax: Number(e.target.value) || 0 });
                      if (!isCustomEv) onToggleCustomEv();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Kaskoforsikring (kr./år)
                  </label>
                  <input
                    type="number"
                    value={customEv.insuranceYear}
                    onChange={(e) => {
                      onUpdateCustomEv({ ...customEv, insuranceYear: Number(e.target.value) || 0 });
                      if (!isCustomEv) onToggleCustomEv();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Service & dæk (kr./år)
                  </label>
                  <input
                    type="number"
                    value={customEv.annualService}
                    onChange={(e) => {
                      onUpdateCustomEv({ ...customEv, annualService: Number(e.target.value) || 0 });
                      if (!isCustomEv) onToggleCustomEv();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>
              </div>

              {/* Hurtige presets til elbil */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Indlæs standard:</span>
                  <button
                    onClick={() => {
                      onUpdateCustomEv({
                        id: 'preset_tesla_y',
                        name: 'Tesla Model Y Long Range',
                        type: 'ev',
                        price: 349990,
                        kmPerKwh: 5.9,
                        halfYearTax: 420,
                        annualService: 2000,
                        insuranceYear: 7500,
                        icon: '⚡',
                        badge: 'SUV'
                      });
                      if (!isCustomEv) onToggleCustomEv();
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.68rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    Model Y
                  </button>
                  <button
                    onClick={() => {
                      onUpdateCustomEv({
                        id: 'preset_id4',
                        name: 'VW ID.4 Pro',
                        type: 'ev',
                        price: 334995,
                        kmPerKwh: 5.6,
                        halfYearTax: 420,
                        annualService: 2400,
                        insuranceYear: 7200,
                        icon: '⚡',
                        badge: 'SUV'
                      });
                      if (!isCustomEv) onToggleCustomEv();
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.68rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    VW ID.4
                  </button>
                </div>

                <button
                  onClick={() => {
                    onUpdateCustomEv({
                      id: 'custom_ev',
                      name: 'Min Elbil',
                      type: 'ev',
                      price: 320000,
                      kmPerKwh: 5.8,
                      halfYearTax: 420,
                      annualService: 1800,
                      insuranceYear: 7000,
                      icon: '⚡',
                      badge: 'Egen bil'
                    });
                    if (!isCustomEv) onToggleCustomEv();
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-muted)',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Nulstil til basis</span>
                </button>
              </div>
            </div>
          )}

          {/* Formular for Benzinbil */}
          {activeTab === 'petrol' && (
            <div style={{
              background: 'var(--box-inset-bg)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Fuel size={20} color="var(--petrol-primary)" />
                  <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>
                    Specifikationer for Benzinbilen
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--petrol-primary)', fontWeight: '700' }}>
                  Live opdatering
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Modelnavn
                  </label>
                  <input
                    type="text"
                    value={customPetrol.name}
                    onChange={(e) => {
                      onUpdateCustomPetrol({ ...customPetrol, name: e.target.value });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    placeholder="F.eks. VW Golf TSI"
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Købspris (kr.)
                  </label>
                  <input
                    type="number"
                    value={customPetrol.price}
                    onChange={(e) => {
                      onUpdateCustomPetrol({ ...customPetrol, price: Number(e.target.value) || 0 });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Forbrug (km/l)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customPetrol.kmPerLitre}
                    onChange={(e) => {
                      onUpdateCustomPetrol({ ...customPetrol, kmPerLitre: Number(e.target.value) || 0 });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Grøn ejerafgift (kr./halvår)
                  </label>
                  <input
                    type="number"
                    value={customPetrol.halfYearTax}
                    onChange={(e) => {
                      onUpdateCustomPetrol({ ...customPetrol, halfYearTax: Number(e.target.value) || 0 });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Kaskoforsikring (kr./år)
                  </label>
                  <input
                    type="number"
                    value={customPetrol.insuranceYear}
                    onChange={(e) => {
                      onUpdateCustomPetrol({ ...customPetrol, insuranceYear: Number(e.target.value) || 0 });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
                    Service & vedligehold (kr./år)
                  </label>
                  <input
                    type="number"
                    value={customPetrol.annualService}
                    onChange={(e) => {
                      onUpdateCustomPetrol({ ...customPetrol, annualService: Number(e.target.value) || 0 });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  />
                </div>
              </div>

              {/* Hurtige presets til benzinbil */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Indlæs standard:</span>
                  <button
                    onClick={() => {
                      onUpdateCustomPetrol({
                        id: 'preset_golf',
                        name: 'VW Golf 1.5 eTSI',
                        type: 'petrol',
                        price: 319995,
                        kmPerLitre: 18.2,
                        halfYearTax: 680,
                        annualService: 4200,
                        insuranceYear: 6800,
                        icon: '⛽',
                        badge: 'Hatchback'
                      });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.68rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    Golf 1.5 TSI
                  </button>
                  <button
                    onClick={() => {
                      onUpdateCustomPetrol({
                        id: 'preset_peugeot_208',
                        name: 'Peugeot 208 PureTech',
                        type: 'petrol',
                        price: 189990,
                        kmPerLitre: 19.5,
                        halfYearTax: 600,
                        annualService: 3600,
                        insuranceYear: 5800,
                        icon: '⛽',
                        badge: 'Minibil'
                      });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.68rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    Peugeot 208
                  </button>
                </div>

                <button
                  onClick={() => {
                    onUpdateCustomPetrol({
                      id: 'custom_petrol',
                      name: 'Min Benzinbil',
                      type: 'petrol',
                      price: 280000,
                      kmPerLitre: 16.5,
                      halfYearTax: 780,
                      annualService: 4500,
                      insuranceYear: 6500,
                      icon: '⛽',
                      badge: 'Egen bil'
                    });
                    if (!isCustomPetrol) onToggleCustomPetrol();
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-muted)',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Nulstil til basis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
