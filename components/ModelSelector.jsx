'use client';

import React, { useState, useMemo } from 'react';
import { PRESET_EV_CARS, PRESET_PETROL_CARS } from '../data/cars';
import { formatCurrency } from '../utils/formatters';
import { Zap, Fuel, Sliders, Check, Search, X, ChevronDown } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCards, setShowAllCards] = useState(false);

  // Filtrerede biler baseret på søgning
  const currentCarsList = activeTab === 'ev' ? PRESET_EV_CARS : PRESET_PETROL_CARS;
  
  const filteredCars = useMemo(() => {
    if (!searchQuery.trim()) return currentCarsList;
    const query = searchQuery.toLowerCase().trim();
    return currentCarsList.filter(car => 
      car.name.toLowerCase().includes(query) ||
      car.subtitle.toLowerCase().includes(query) ||
      (car.badge && car.badge.toLowerCase().includes(query))
    );
  }, [currentCarsList, searchQuery]);

  // Antal biler der skal vises som kort som standard (f.eks. 6 medmindre man søger eller klikker "Vis alle")
  const displayedCars = useMemo(() => {
    if (searchQuery.trim()) return filteredCars;
    if (showAllCards) return currentCarsList;
    return currentCarsList.slice(0, 6);
  }, [searchQuery, showAllCards, filteredCars, currentCarsList]);

  // Nuværende valgte bil id til dropdown
  const currentSelectedId = activeTab === 'ev' 
    ? (isCustomEv ? 'custom' : selectedEv.id)
    : (isCustomPetrol ? 'custom' : selectedPetrol.id);

  // Håndtering af valg fra dropdown
  const handleDropdownChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      if (activeTab === 'ev' && !isCustomEv) onToggleCustomEv();
      if (activeTab === 'petrol' && !isCustomPetrol) onToggleCustomPetrol();
      return;
    }

    if (activeTab === 'ev') {
      const car = PRESET_EV_CARS.find(c => c.id === val);
      if (car) onSelectEv(car);
    } else {
      const car = PRESET_PETROL_CARS.find(c => c.id === val);
      if (car) onSelectPetrol(car);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '0 16px' }}>
      
      {/* 1. Segmented Switcher for Tabs */}
      <div className="segmented-control">
        <button
          className={`segmented-btn ${activeTab === 'ev' ? 'active-ev' : ''}`}
          onClick={() => {
            onTabChange('ev');
            setSearchQuery('');
          }}
        >
          <Zap size={16} />
          <span>Vælg Elbil ({PRESET_EV_CARS.length})</span>
        </button>
        <button
          className={`segmented-btn ${activeTab === 'petrol' ? 'active-petrol' : ''}`}
          onClick={() => {
            onTabChange('petrol');
            setSearchQuery('');
          }}
        >
          <Fuel size={16} />
          <span>Vælg Benzinbil ({PRESET_PETROL_CARS.length})</span>
        </button>
      </div>

      {/* 2. Søgebjælke & Dropdown menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* Søgefelt med Search ikon og X ryd-knap */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder={activeTab === 'ev' ? 'Søg elbil (f.eks. Tesla, ID.4, Volvo, Cupra...)' : 'Søg benzinbil (f.eks. Golf, Yaris, Focus, Polo...)'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid ' + (searchQuery ? (activeTab === 'ev' ? 'var(--ev-primary)' : 'var(--petrol-primary)') : 'var(--border-subtle)'),
              borderRadius: '12px',
              padding: '10px 36px 10px 36px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff'
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Dropdown vælger for direkte hurtigvalg fra listen */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            value={currentSelectedId}
            onChange={handleDropdownChange}
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #131d2c 0%, #0b111a 100%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '9px 36px 9px 12px',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none'
            }}
          >
            <optgroup label={activeTab === 'ev' ? 'Vælg fra alle populære elbiler:' : 'Vælg fra alle populære benzinbiler:'}>
              {currentCarsList.map(car => (
                <option key={car.id} value={car.id}>
                  {car.name} — {formatCurrency(car.price)} ({activeTab === 'ev' ? `${car.kmPerKwh} km/kWh` : `${car.kmPerLitre} km/l`})
                </option>
              ))}
            </optgroup>
            <option value="custom">
              ⚙️ Tilpas din egen {activeTab === 'ev' ? 'elbil' : 'benzinbil'} manuelt...
            </option>
          </select>
          <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
        </div>

      </div>

      {/* 3. Header & "Tilpas egen bil" knap */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', marginTop: '2px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>
          {searchQuery.trim() 
            ? `Søgeresultater (${filteredCars.length}):` 
            : `Populære modeller (${displayedCars.length} af ${currentCarsList.length}):`}
        </span>
        <button
          onClick={activeTab === 'ev' ? onToggleCustomEv : onToggleCustomPetrol}
          style={{
            background: (activeTab === 'ev' ? isCustomEv : isCustomPetrol)
              ? (activeTab === 'ev' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)')
              : 'transparent',
            border: '1px solid ' + ((activeTab === 'ev' ? isCustomEv : isCustomPetrol)
              ? (activeTab === 'ev' ? 'var(--ev-primary)' : 'var(--petrol-primary)')
              : 'var(--border-subtle)'),
            color: (activeTab === 'ev' ? isCustomEv : isCustomPetrol)
              ? (activeTab === 'ev' ? '#34d399' : '#fb7185')
              : 'var(--text-muted)',
            padding: '5px 10px',
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
          <span>
            {activeTab === 'ev'
              ? (isCustomEv ? '✓ Egen elbil valgt' : 'Tilpas egen elbil')
              : (isCustomPetrol ? '✓ Egen benzinbil valgt' : 'Tilpas egen benzinbil')}
          </span>
        </button>
      </div>

      {/* 4. Modelkort Grid */}
      {filteredCars.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Ingen bil matcher &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={activeTab === 'ev' ? onToggleCustomEv : onToggleCustomPetrol}
            style={{
              background: activeTab === 'ev' ? 'var(--ev-primary)' : 'var(--petrol-primary)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Opret din egen bil med dine egne tal
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '8px'
        }}>
          {displayedCars.map((car) => {
            const isSelected = activeTab === 'ev'
              ? (!isCustomEv && selectedEv.id === car.id)
              : (!isCustomPetrol && selectedPetrol.id === car.id);

            const isEv = activeTab === 'ev';
            const primaryColor = isEv ? 'var(--ev-primary)' : 'var(--petrol-primary)';
            const bgSelected = isEv ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';
            const glowColor = isEv ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';
            const priceColor = isEv ? '#34d399' : '#fb7185';

            return (
              <div
                key={car.id}
                onClick={() => (isEv ? onSelectEv(car) : onSelectPetrol(car))}
                style={{
                  background: isSelected ? bgSelected : 'var(--bg-card)',
                  border: '1px solid ' + (isSelected ? primaryColor : 'var(--border-subtle)'),
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 15px ${glowColor}` : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{car.icon}</span>
                  {isSelected && (
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Check size={12} color="#ffffff" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#ffffff', marginBottom: '2px' }}>
                  {car.name}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {isEv ? `${car.kmPerKwh} km/kWh` : `${car.kmPerLitre} km/l`}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: priceColor }}>
                  {formatCurrency(car.price)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vis flere biler knap (hvis der ikke søges og ikke alle vises) */}
      {!searchQuery.trim() && currentCarsList.length > 6 && (
        <button
          onClick={() => setShowAllCards(prev => !prev)}
          style={{
            background: 'transparent',
            border: '1px dashed var(--border-subtle)',
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          {showAllCards 
            ? '▲ Vis færre modeller' 
            : `▼ Vis alle ${currentCarsList.length} ${activeTab === 'ev' ? 'elbiler' : 'benzinbiler'}`}
        </button>
      )}

      {/* 5. Custom Elbil Inline Editor */}
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

      {/* 6. Custom Benzinbil Inline Editor */}
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
