'use client';

import React, { useState, useMemo } from 'react';
import { PRESET_EV_CARS, PRESET_PETROL_CARS } from '../data/cars';
import { formatCurrency } from '../utils/formatters';
import { 
  Zap, 
  Fuel, 
  Sliders, 
  Check, 
  Search, 
  X, 
  ChevronDown, 
  Car, 
  BookOpen, 
  Sparkles, 
  Filter,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  FileText
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
  // Overordnet visningstilstand i Trin 1: 'catalog' | 'plate' | 'custom'
  const [activeMode, setActiveMode] = useState('catalog');

  // Filtre og søgning i kataloget
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price_asc' | 'price_desc' | 'efficiency'

  // Hvilken biltype kigger vi på lige nu (ev eller petrol)
  const currentCarsList = activeTab === 'ev' ? PRESET_EV_CARS : PRESET_PETROL_CARS;

  // Uddrag af unikke mærker for den aktive biltype
  const availableBrands = useMemo(() => {
    const brands = new Set();
    currentCarsList.forEach(car => {
      if (car.brand) brands.add(car.brand);
    });
    return Array.from(brands).sort();
  }, [currentCarsList]);

  // Uddrag af unikke kategorier
  const availableCategories = useMemo(() => {
    const cats = new Set();
    currentCarsList.forEach(car => {
      if (car.category) cats.add(car.category);
    });
    return Array.from(cats).sort();
  }, [currentCarsList]);

  // Filtreret & sorteret liste over biler
  const filteredAndSortedCars = useMemo(() => {
    let list = [...currentCarsList];

    // 1. Fritekstsøgning
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(car => 
        car.name.toLowerCase().includes(q) ||
        (car.brand && car.brand.toLowerCase().includes(q)) ||
        (car.subtitle && car.subtitle.toLowerCase().includes(q)) ||
        (car.badge && car.badge.toLowerCase().includes(q)) ||
        (car.category && car.category.toLowerCase().includes(q))
      );
    }

    // 2. Mærkefilter
    if (selectedBrand !== 'ALL') {
      list = list.filter(car => car.brand === selectedBrand);
    }

    // 3. Kategorifilter
    if (selectedCategory !== 'ALL') {
      list = list.filter(car => car.category === selectedCategory);
    }

    // 4. Sortering
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'efficiency') {
      if (activeTab === 'ev') {
        list.sort((a, b) => b.kmPerKwh - a.kmPerKwh);
      } else {
        list.sort((a, b) => b.kmPerLitre - a.kmPerLitre);
      }
    }

    return list;
  }, [currentCarsList, searchQuery, selectedBrand, selectedCategory, sortBy, activeTab]);

  // Nuværende aktive biler med information
  const currentEvInfo = isCustomEv ? customEv : selectedEv;
  const currentPetrolInfo = isCustomPetrol ? customPetrol : selectedPetrol;

  // Skift til Custom mode med udgangspunkt i valgt bil
  const handleCustomizeCurrent = (car, type) => {
    if (type === 'ev') {
      onUpdateCustomEv({
        id: `custom_${car.id}`,
        name: car.name,
        type: 'ev',
        price: car.price,
        kmPerKwh: car.kmPerKwh || 5.8,
        halfYearTax: car.halfYearTax || 420,
        annualService: car.annualService || 2000,
        insuranceYear: car.insuranceYear || 7000,
        icon: car.icon || '⚡',
        badge: 'Tilpasset'
      });
      if (!isCustomEv) onToggleCustomEv();
      setActiveMode('custom');
      onTabChange('ev');
    } else {
      onUpdateCustomPetrol({
        id: `custom_${car.id}`,
        name: car.name,
        type: 'petrol',
        price: car.price,
        kmPerLitre: car.kmPerLitre || 18.0,
        halfYearTax: car.halfYearTax || 680,
        annualService: car.annualService || 4200,
        insuranceYear: car.insuranceYear || 6500,
        icon: car.icon || '⛽',
        badge: 'Tilpasset'
      });
      if (!isCustomPetrol) onToggleCustomPetrol();
      setActiveMode('custom');
      onTabChange('petrol');
    }
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
          onClick={() => {
            onTabChange('ev');
            if (activeMode !== 'catalog' && !isCustomEv) setActiveMode('catalog');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'ev' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
            border: '1px solid ' + (activeTab === 'ev' ? 'var(--ev-primary)' : 'var(--border-subtle)'),
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'var(--ev-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', color: '#ffffff', flexShrink: 0
          }}>
            {currentEvInfo.icon || '⚡'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '800', color: 'var(--ev-primary)', letterSpacing: '0.05em' }}>
                Aktiv Elbil
              </span>
              {isCustomEv && (
                <span style={{ fontSize: '0.62rem', background: 'rgba(16,185,129,0.2)', color: 'var(--ev-primary)', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                  Tilpasset
                </span>
              )}
            </div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentEvInfo.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {formatCurrency(currentEvInfo.price)} · {currentEvInfo.kmPerKwh} km/kWh · {currentEvInfo.halfYearTax} kr./halvår
            </div>
          </div>
        </div>

        {/* Benzinbil Boks */}
        <div 
          onClick={() => {
            onTabChange('petrol');
            if (activeMode !== 'catalog' && !isCustomPetrol) setActiveMode('catalog');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'petrol' ? 'rgba(244, 63, 94, 0.12)' : 'var(--bg-card)',
            border: '1px solid ' + (activeTab === 'petrol' ? 'var(--petrol-primary)' : 'var(--border-subtle)'),
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'var(--petrol-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', color: '#ffffff', flexShrink: 0
          }}>
            {currentPetrolInfo.icon || '⛽'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: '800', color: 'var(--petrol-primary)', letterSpacing: '0.05em' }}>
                Aktiv Benzinbil
              </span>
              {isCustomPetrol && (
                <span style={{ fontSize: '0.62rem', background: 'rgba(244,63,94,0.2)', color: 'var(--petrol-primary)', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                  Tilpasset
                </span>
              )}
            </div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentPetrolInfo.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {formatCurrency(currentPetrolInfo.price)} · {currentPetrolInfo.kmPerLitre} km/l · {currentPetrolInfo.halfYearTax} kr./halvår
            </div>
          </div>
        </div>
      </div>

      {/* 2. HOVED-MODUS NAVIGATION: DE 3 VALGMULIGHEDER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        background: 'var(--box-inset-bg)',
        padding: '5px',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setActiveMode('catalog')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 8px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.82rem',
            transition: 'all 0.2s ease',
            background: activeMode === 'catalog' 
              ? (activeTab === 'ev' ? 'var(--ev-gradient)' : 'var(--petrol-gradient)')
              : 'transparent',
            color: activeMode === 'catalog' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <BookOpen size={16} />
          <span>Bilkatalog ({PRESET_EV_CARS.length + PRESET_PETROL_CARS.length})</span>
        </button>

        <button
          onClick={() => setActiveMode('plate')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 8px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.82rem',
            transition: 'all 0.2s ease',
            background: activeMode === 'plate' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
            color: activeMode === 'plate' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <Car size={16} />
          <span>Nummerplade (DMR)</span>
        </button>

        <button
          onClick={() => setActiveMode('custom')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 8px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.82rem',
            transition: 'all 0.2s ease',
            background: activeMode === 'custom' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
            color: activeMode === 'custom' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <Sliders size={16} />
          <span>Konfigurer selv</span>
        </button>
      </div>

      {/* 3. MODUS 1: DET STORE BILKATALOG */}
      {activeMode === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Elbil vs Benzinbil Switcher i Kataloget */}
          <div className="segmented-control">
            <button
              className={`segmented-btn ${activeTab === 'ev' ? 'active-ev' : ''}`}
              onClick={() => {
                onTabChange('ev');
                setSelectedBrand('ALL');
                setSelectedCategory('ALL');
              }}
            >
              <Zap size={16} />
              <span>Søg blandt Elbiler ({PRESET_EV_CARS.length} modeller)</span>
            </button>
            <button
              className={`segmented-btn ${activeTab === 'petrol' ? 'active-petrol' : ''}`}
              onClick={() => {
                onTabChange('petrol');
                setSelectedBrand('ALL');
                setSelectedCategory('ALL');
              }}
            >
              <Fuel size={16} />
              <span>Søg blandt Benzinbiler ({PRESET_PETROL_CARS.length} modeller)</span>
            </button>
          </div>

          {/* Søgefelt & Sortering */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Søgefelt */}
            <div style={{ position: 'relative', flex: '1 1 240px', display: 'flex', alignItems: 'center' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder={activeTab === 'ev' 
                  ? "Søg elbil (f.eks. Tesla Y, ID.4, EX30, Enyaq, Kia EV3...)" 
                  : "Søg benzin/hybrid (f.eks. Golf, Yaris, 208, Focus, Octavia...)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid ' + (searchQuery ? (activeTab === 'ev' ? 'var(--ev-primary)' : 'var(--petrol-primary)') : 'var(--border-subtle)'),
                  borderRadius: '12px',
                  padding: '10px 36px 10px 36px',
                  color: 'var(--text-main)',
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
                    background: 'var(--box-inset-bg)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-main)'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sortering dropdown */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '150px' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '10px 30px 10px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none'
                }}
              >
                <option value="popular">Mest populære</option>
                <option value="price_asc">Pris: Lav til høj</option>
                <option value="price_desc">Pris: Høj til lav</option>
                <option value="efficiency">
                  {activeTab === 'ev' ? 'Bedste km/kWh' : 'Bedste km/l'}
                </option>
              </select>
              <ArrowUpDown size={14} color="var(--text-muted)" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Mærke Hurtigfiltre (Chips) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Filtrér efter bilmærke:
              </span>
              {(selectedBrand !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedBrand('ALL');
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCcw size={10} />
                  <span>Nulstil filtre</span>
                </button>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}>
              <button
                onClick={() => setSelectedBrand('ALL')}
                style={{
                  background: selectedBrand === 'ALL'
                    ? (activeTab === 'ev' ? 'var(--ev-primary)' : 'var(--petrol-primary)')
                    : 'var(--bg-card)',
                  color: selectedBrand === 'ALL' ? '#ffffff' : 'var(--text-main)',
                  border: '1px solid ' + (selectedBrand === 'ALL' ? 'transparent' : 'var(--border-subtle)'),
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.76rem',
                  fontWeight: selectedBrand === 'ALL' ? '700' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                Alle mærker ({currentCarsList.length})
              </button>

              {availableBrands.map(brand => {
                const count = currentCarsList.filter(c => c.brand === brand).length;
                const isSelected = selectedBrand === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(isSelected ? 'ALL' : brand)}
                    style={{
                      background: isSelected
                        ? (activeTab === 'ev' ? 'var(--ev-primary)' : 'var(--petrol-primary)')
                        : 'var(--bg-card)',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid ' + (isSelected ? 'transparent' : 'var(--border-subtle)'),
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '0.76rem',
                      fontWeight: isSelected ? '700' : '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {brand} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Karrosseritype Hurtigfiltre (Chips) */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '2px',
            scrollbarWidth: 'none'
          }}>
            <button
              onClick={() => setSelectedCategory('ALL')}
              style={{
                background: selectedCategory === 'ALL' ? 'var(--box-inset-bg)' : 'transparent',
                color: selectedCategory === 'ALL' ? 'var(--text-main)' : 'var(--text-muted)',
                border: '1px solid ' + (selectedCategory === 'ALL' ? 'var(--border-focus)' : 'var(--border-subtle)'),
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Alle typer
            </button>
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? 'ALL' : cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--box-inset-bg)' : 'transparent',
                  color: selectedCategory === cat ? 'var(--text-main)' : 'var(--text-muted)',
                  border: '1px solid ' + (selectedCategory === cat ? 'var(--border-focus)' : 'var(--border-subtle)'),
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resultattæller */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Viser {filteredAndSortedCars.length} af {currentCarsList.length} {activeTab === 'ev' ? 'elbiler' : 'benzinbiler'}
            </span>
          </div>

          {/* BILKORT GRID */}
          {filteredAndSortedCars.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700', marginBottom: '6px' }}>
                Ingen bil matcher dine søgekriterier
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Fandt du ikke den ønskede model? Du kan konfigurere din egen bil helt frit med dine egne tal.
              </p>
              <button
                onClick={() => setActiveMode('custom')}
                style={{
                  background: activeTab === 'ev' ? 'var(--ev-gradient)' : 'var(--petrol-gradient)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Opret og konfigurer egen bil
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '10px'
            }}>
              {filteredAndSortedCars.map((car) => {
                const isSelected = activeTab === 'ev'
                  ? (!isCustomEv && selectedEv.id === car.id)
                  : (!isCustomPetrol && selectedPetrol.id === car.id);

                const isEv = activeTab === 'ev';
                const primaryColor = isEv ? 'var(--ev-primary)' : 'var(--petrol-primary)';
                const bgSelected = isEv ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';
                const glowColor = isEv ? 'var(--ev-glow)' : 'var(--petrol-glow)';

                return (
                  <div
                    key={car.id}
                    onClick={() => {
                      if (isEv) {
                        onSelectEv(car);
                        if (isCustomEv) onToggleCustomEv();
                      } else {
                        onSelectPetrol(car);
                        if (isCustomPetrol) onToggleCustomPetrol();
                      }
                    }}
                    style={{
                      background: isSelected ? bgSelected : 'var(--bg-card)',
                      border: '1px solid ' + (isSelected ? primaryColor : 'var(--border-subtle)'),
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 16px ${glowColor}` : 'none'
                    }}
                  >
                    {/* Top Række: Ikon, Badges & Valg-indikator */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1.3rem' }}>{car.icon}</span>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {car.brand && (
                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--box-inset-bg)', color: 'var(--text-muted)', fontWeight: '700' }}>
                              {car.brand}
                            </span>
                          )}
                          {car.category && (
                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--box-inset-bg)', color: 'var(--text-dim)' }}>
                              {car.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected ? (
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#ffffff'
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          border: '1.5px solid var(--border-subtle)'
                        }} />
                      )}
                    </div>

                    {/* Modelnavn & Beskrivelse */}
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.25', marginBottom: '3px' }}>
                        {car.name}
                      </div>
                      {car.subtitle && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                          {car.subtitle}
                        </div>
                      )}
                    </div>

                    {/* Specifikationer: Forbrug & Afgift */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      background: 'var(--box-inset-bg)',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      fontSize: '0.72rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.65rem' }}>Forbrug</span>
                        <span style={{ fontWeight: '700', color: primaryColor }}>
                          {isEv ? `${car.kmPerKwh} km/kWh` : `${car.kmPerLitre} km/l`}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.65rem' }}>Grøn afgift</span>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                          {car.halfYearTax} kr./h-år
                        </span>
                      </div>
                    </div>

                    {/* Pris & Handling */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: '2px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block' }}>Købspris:</span>
                        <span style={{ fontSize: '0.92rem', fontWeight: '800', color: primaryColor }}>
                          {formatCurrency(car.price)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomizeCurrent(car, isEv ? 'ev' : 'petrol');
                        }}
                        title="Tilpas denne bils pris og forbrug"
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          color: 'var(--text-muted)',
                          padding: '4px 8px',
                          fontSize: '0.68rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Sliders size={10} />
                        <span>Tilpas tal</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 4. MODUS 2: NUMMERPLADESØGNING (DMR) */}
      {activeMode === 'plate' && (
        <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
          <LicensePlateLookup
            initialOpen={true}
            activeTab={activeTab}
            onApplyCar={(car) => {
              if (onApplyCarFromPlate) {
                onApplyCarFromPlate(car);
              }
              // Når bilen er anvendt, kan brugeren se den med det samme i toppen
            }}
          />
        </div>
      )}

      {/* 5. MODUS 3: KONFIGURER SELV (MANUEL INDTASTNING) */}
      {activeMode === 'custom' && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} color="var(--ev-primary)" />
                  <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    Dine specifikke tal for Elbilen
                  </span>
                </div>
                {!isCustomEv && (
                  <button
                    onClick={onToggleCustomEv}
                    style={{
                      background: 'var(--ev-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Aktivér egne tal
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {isCustomEv && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    onClick={onToggleCustomEv}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-muted)',
                      padding: '5px 12px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Nulstil og vend tilbage til standardbil ({selectedEv.name})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Formular for Benzinbil */}
          {activeTab === 'petrol' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} color="var(--petrol-primary)" />
                  <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    Dine specifikke tal for Benzinbilen
                  </span>
                </div>
                {!isCustomPetrol && (
                  <button
                    onClick={onToggleCustomPetrol}
                    style={{
                      background: 'var(--petrol-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Aktivér egne tal
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                    Modelnavn
                  </label>
                  <input
                    type="text"
                    value={customPetrol.name}
                    onChange={(e) => {
                      onUpdateCustomPetrol({ ...customPetrol, name: e.target.value });
                      if (!isCustomPetrol) onToggleCustomPetrol();
                    }}
                    placeholder="F.eks. VW Golf"
                    style={{
                      width: '100%',
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                    Service & reparation (kr./år)
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
                      background: 'var(--box-inset-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {isCustomPetrol && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    onClick={onToggleCustomPetrol}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-muted)',
                      padding: '5px 12px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Nulstil og vend tilbage til standardbil ({selectedPetrol.name})
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
