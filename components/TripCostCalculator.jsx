'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Navigation,
  MapPin,
  ArrowRightLeft,
  Clock,
  Zap,
  Fuel,
  Leaf,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BatteryCharging,
  Sliders,
  Map as MapIcon
} from 'lucide-react';
import { formatCurrency, formatKm, formatPricePerKm } from '../utils/formatters';

// Dynamisk import af Leaflet kortet (SSR-safe)
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '16px',
        color: 'var(--text-muted)'
      }}
    >
      Indlæser OpenStreetMap kort...
    </div>
  )
});

const PRESET_ROUTES = [
  { label: 'København ⇄ Aarhus', from: 'København', to: 'Aarhus' },
  { label: 'Odense ⇄ København', from: 'Odense', to: 'København' },
  { label: 'Aalborg ⇄ Aarhus', from: 'Aalborg', to: 'Aarhus' },
  { label: 'Esbjerg ⇄ Odense', from: 'Esbjerg', to: 'Odense' },
  { label: 'Roskilde ⇄ København', from: 'Roskilde', to: 'København' }
];

export default function TripCostCalculator({
  currentEv,
  currentPetrol,
  kmPerKwh,
  kmPerLitre,
  petrolPrice,
  homeElectricityPrice
}) {
  const [fromInput, setFromInput] = useState('København');
  const [toInput, setToInput] = useState('Aarhus');
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // Rutedata
  const [distanceKm, setDistanceKm] = useState(303.6);
  const [durationText, setDurationText] = useState('3 t 26 min');
  const [coordinates, setCoordinates] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // Manuel kilometer-overstyring (slider)
  const [isManualKm, setIsManualKm] = useState(false);
  const [manualKm, setManualKm] = useState(304);

  // Ladescenarie: 'home' | 'mixed' | 'fast'
  const [chargingMode, setChargingMode] = useState('mixed');
  const [fastChargePrice] = useState(3.50); // gennemsnitlig lynladerpris på motorvejen

  // Kort vis/skjul
  const [showMap, setShowMap] = useState(true);

  // Autocomplete for Fra og Til
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [isSearchingFrom, setIsSearchingFrom] = useState(false);
  const [isSearchingTo, setIsSearchingTo] = useState(false);
  const fromTimeoutRef = useRef(null);
  const toTimeoutRef = useRef(null);

  // Hent standardrute ved opstart
  useEffect(() => {
    fetchRoute('København', 'Aarhus');
  }, []);

  // Hent rute fra API
  async function fetchRoute(fromLoc, toLoc) {
    if (!fromLoc || !toLoc) return;
    setIsLoadingRoute(true);
    setRouteError(null);

    try {
      const res = await fetch(
        `/api/route?from=${encodeURIComponent(fromLoc)}&to=${encodeURIComponent(toLoc)}`
      );
      const data = await res.json();

      if (data.success) {
        setDistanceKm(data.distanceKm);
        setDurationText(data.formattedDuration);
        setCoordinates(data.coordinates || []);
        setManualKm(data.distanceKm);
        setIsManualKm(false);
      } else {
        setRouteError(data.message || 'Kunne ikke finde ruten.');
      }
    } catch (e) {
      setRouteError('Der opstod en fejl ved hentning af ruten.');
    } finally {
      setIsLoadingRoute(false);
    }
  }

  // Autocomplete søgning
  const handleSearchSuggestions = (val, type) => {
    if (type === 'from') {
      setFromInput(val);
      if (fromTimeoutRef.current) clearTimeout(fromTimeoutRef.current);
      if (val.length < 2) {
        setFromSuggestions([]);
        return;
      }
      setIsSearchingFrom(true);
      fromTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/route?action=autocomplete&q=${encodeURIComponent(val)}`);
          const data = await res.json();
          if (data.results) setFromSuggestions(data.results);
        } catch (e) {
          // ignore
        } finally {
          setIsSearchingFrom(false);
        }
      }, 250);
    } else {
      setToInput(val);
      if (toTimeoutRef.current) clearTimeout(toTimeoutRef.current);
      if (val.length < 2) {
        setToSuggestions([]);
        return;
      }
      setIsSearchingTo(true);
      toTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/route?action=autocomplete&q=${encodeURIComponent(val)}`);
          const data = await res.json();
          if (data.results) setToSuggestions(data.results);
        } catch (e) {
          // ignore
        } finally {
          setIsSearchingTo(false);
        }
      }, 250);
    }
  };

  const handleSelectSuggestion = (item, type) => {
    if (type === 'from') {
      setFromInput(item.name);
      setFromSuggestions([]);
      fetchRoute(item.name, toInput);
    } else {
      setToInput(item.name);
      setToSuggestions([]);
      fetchRoute(fromInput, item.name);
    }
  };

  // Byt om på start og slut
  const handleSwapLocations = () => {
    const temp = fromInput;
    setFromInput(toInput);
    setToInput(temp);
    fetchRoute(toInput, temp);
  };

  // Vælg forudindstillet rute
  const handleSelectPreset = (preset) => {
    setFromInput(preset.from);
    setToInput(preset.to);
    fetchRoute(preset.from, preset.to);
  };

  // Beregnet køreafstand
  const baseKm = isManualKm ? manualKm : distanceKm;
  const effectiveKm = isRoundTrip ? baseKm * 2 : baseKm;

  // Effektiv elpris til turen baseret på valgte ladescenarie
  const effectiveTripKwhPrice =
    chargingMode === 'home'
      ? homeElectricityPrice
      : chargingMode === 'fast'
      ? fastChargePrice
      : (homeElectricityPrice * 0.4 + fastChargePrice * 0.6); // Blandet turkørsel

  // 1. Elbil beregninger
  const evKwhNeeded = (effectiveKm / (kmPerKwh || 5.8));
  const evTripCost = evKwhNeeded * effectiveTripKwhPrice;
  const evCostPerKm = effectiveKm > 0 ? evTripCost / effectiveKm : 0;

  // 2. Benzinbil beregninger
  const petrolLitersNeeded = (effectiveKm / (kmPerLitre || 16.5));
  const petrolTripCost = petrolLitersNeeded * (petrolPrice || 13.89);
  const petrolCostPerKm = effectiveKm > 0 ? petrolTripCost / effectiveKm : 0;

  // 3. Besparelse
  const savings = Math.max(0, petrolTripCost - evTripCost);
  const savingsPercent = petrolTripCost > 0 ? Math.round((savings / petrolTripCost) * 100) : 0;

  // 4. Miljø / CO2
  // Benzinbil udleder ca. 2.35 kg CO2 pr. liter. Elbil med dansk grønt elmix ca. 0.08 kg CO2 pr. kWh
  const petrolCo2Kg = petrolLitersNeeded * 2.35;
  const evCo2Kg = evKwhNeeded * 0.08;
  const co2SavedKg = Math.max(0, petrolCo2Kg - evCo2Kg);

  // 5. Ladestop estimat
  // Realistisk motorvejsrækkevidde for moderne elbil er ca. 340-420 km
  const estimatedHighwayRange = 360;
  let chargeStops = 0;
  let chargeStopText = '';
  if (effectiveKm <= estimatedHighwayRange) {
    chargeStops = 0;
    chargeStopText = 'Kan klares på 1 fuld opladning uden stop';
  } else if (effectiveKm <= estimatedHighwayRange * 1.75) {
    chargeStops = 1;
    chargeStopText = '1 hurtigt ladestop undervejs (ca. 18-22 min)';
  } else {
    chargeStops = Math.ceil((effectiveKm - estimatedHighwayRange) / 250);
    chargeStopText = `${chargeStops} ladestop undervejs (ca. ${chargeStops * 20} min samlet)`;
  }

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Kort Hero Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee'
            }}
          >
            <Navigation size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
                Rute- & Turberegner
              </h2>
              <span
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#22d3ee',
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}
              >
                OpenStreetMap Live
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Hvad koster det at køre turen i {currentEv.name} kontra {currentPetrol.name}?
            </p>
          </div>
        </div>

        {/* Vis / skjul kort knap */}
        <button
          onClick={() => setShowMap(!showMap)}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '7px 12px',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <MapIcon size={14} color="#22d3ee" />
          <span>{showMap ? 'Skjul kort' : 'Vis kort'}</span>
          {showMap ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Hurtigvalg af populære ruter */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Populære ruter i Danmark:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PRESET_ROUTES.map((p, idx) => {
            const isSelected = fromInput === p.from && toInput === p.to;
            return (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p)}
                style={{
                  background: isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rute Input Felter (Fra / Til) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '16px'
        }}
        className="route-inputs-grid"
      >
        {/* Fra input */}
        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <MapPin size={12} color="#10b981" />
            <span>Fra (Startsted):</span>
          </label>
          <input
            type="text"
            value={fromInput}
            onChange={(e) => handleSearchSuggestions(e.target.value, 'from')}
            placeholder="f.eks. København eller gadenavn"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: '600'
            }}
          />
          {fromSuggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#181e29',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                zIndex: 1000,
                marginTop: '4px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                maxHeight: '180px',
                overflowY: 'auto'
              }}
            >
              {fromSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectSuggestion(item, 'from')}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: '600' }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Byt om knap */}
        <div style={{ paddingTop: '18px' }}>
          <button
            onClick={handleSwapLocations}
            title="Byt om på start og slut"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
          >
            <ArrowRightLeft size={16} />
          </button>
        </div>

        {/* Til input */}
        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <MapPin size={12} color="#ec4899" />
            <span>Til (Destination):</span>
          </label>
          <input
            type="text"
            value={toInput}
            onChange={(e) => handleSearchSuggestions(e.target.value, 'to')}
            placeholder="f.eks. Aarhus eller gadenavn"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: '600'
            }}
          />
          {toSuggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#181e29',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                zIndex: 1000,
                marginTop: '4px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                maxHeight: '180px',
                overflowY: 'auto'
              }}
            >
              {toSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectSuggestion(item, 'to')}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: '600' }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rute Options Row: Tur/Retur Switch + Distance & Tid Info */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        {/* Tur / Retur Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsRoundTrip(false)}
            style={{
              background: !isRoundTrip ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              border: !isRoundTrip ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.1)',
              color: !isRoundTrip ? '#ffffff' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Enkelt tur
          </button>
          <button
            onClick={() => setIsRoundTrip(true)}
            style={{
              background: isRoundTrip ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              border: isRoundTrip ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isRoundTrip ? '#ffffff' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={13} />
            <span>Tur / Retur (2x)</span>
          </button>
        </div>

        {/* Distance & Tid display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
              Samlet køreafstand:
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#22d3ee' }}>
              {formatKm(effectiveKm)}
            </span>
          </div>

          <div style={{ height: '24px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />

          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
              Estimeret køretid:
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} color="var(--text-muted)" />
              {isRoundTrip
                ? `${Math.floor(distanceKm * 2 / 85)} t ${Math.round(((distanceKm * 2 / 85) % 1) * 60)} min`
                : durationText}
            </span>
          </div>
        </div>
      </div>

      {/* Valgfrit: Manuel justering af km (hvis man vil eksperimentere frit) */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sliders size={12} />
            <span>Eller juster distance manuelt:</span>
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#22d3ee' }}>
            {baseKm} km {isRoundTrip ? `(i alt ${effectiveKm} km retur)` : ''}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="1000"
          step="5"
          value={baseKm}
          onChange={(e) => {
            setIsManualKm(true);
            setManualKm(Number(e.target.value));
          }}
          style={{ width: '100%', accentColor: '#22d3ee' }}
        />
      </div>

      {/* Ladescenarie valg (Hjemmeladning vs. Lynlader) */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '18px'
        }}
      >
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Hvor lader du til denne tur?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
          <button
            onClick={() => setChargingMode('home')}
            style={{
              background: chargingMode === 'home' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: chargingMode === 'home' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '8px',
              color: chargingMode === 'home' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.76rem',
              fontWeight: '600',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ color: '#34d399', fontWeight: '700' }}>Hjemmeladning</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>{homeElectricityPrice.toFixed(2)} kr./kWh</div>
          </button>

          <button
            onClick={() => setChargingMode('mixed')}
            style={{
              background: chargingMode === 'mixed' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: chargingMode === 'mixed' ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '8px',
              color: chargingMode === 'mixed' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.76rem',
              fontWeight: '600',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ color: '#22d3ee', fontWeight: '700' }}>Blandet kørsel</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>40% hjemme / 60% lyn</div>
          </button>

          <button
            onClick={() => setChargingMode('fast')}
            style={{
              background: chargingMode === 'fast' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: chargingMode === 'fast' ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '8px',
              color: chargingMode === 'fast' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.76rem',
              fontWeight: '600',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ color: '#f472b6', fontWeight: '700' }}>Lynlader på farten</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>{fastChargePrice.toFixed(2)} kr./kWh</div>
          </button>
        </div>
      </div>

      {/* RESULTAT HERO BOX: BESPARELSE PÅ TUREN */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.12))',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={15} />
            <span>Besparelse på denne tur</span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', margin: '2px 0' }}>
            {formatCurrency(savings)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '600' }}>
            Du sparer {savingsPercent}% i brændstofudgifter på denne rute!
          </div>
        </div>

        {/* Hurtig visning af CO2 besparelse */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Leaf size={22} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Mindre CO2 udledning:</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#34d399' }}>
              -{co2SavedKg.toFixed(1)} kg CO₂
            </div>
          </div>
        </div>
      </div>

      {/* 2-KOLONNE SAMMENLIGNING FOR TUREN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginBottom: '18px'
        }}
      >
        {/* Elbil Boks */}
        <div
          style={{
            background: 'rgba(6, 182, 212, 0.06)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="#22d3ee" />
              <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#ffffff' }}>
                {currentEv.name}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
              Elbil
            </span>
          </div>

          <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#22d3ee' }}>
            {formatCurrency(evTripCost)}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>Strømforbrug: <b>{evKwhNeeded.toFixed(1)} kWh</b> ({kmPerKwh} km/kWh)</div>
            <div>Pris pr. km: <b>{formatPricePerKm(evCostPerKm)}</b></div>
            <div>Gns. strømpris: <b>{effectiveTripKwhPrice.toFixed(2)} kr./kWh</b></div>
          </div>

          {/* Ladestop information */}
          <div
            style={{
              marginTop: '6px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: chargeStops === 0 ? '#34d399' : '#f59e0b'
            }}
          >
            {chargeStops === 0 ? <CheckCircle2 size={15} /> : <BatteryCharging size={15} />}
            <span>{chargeStopText}</span>
          </div>
        </div>

        {/* Benzinbil Boks */}
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.06)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Fuel size={16} color="#fb7185" />
              <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#ffffff' }}>
                {currentPetrol.name}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
              Benzinbil
            </span>
          </div>

          <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#fb7185' }}>
            {formatCurrency(petrolTripCost)}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>Benzinforbrug: <b>{petrolLitersNeeded.toFixed(1)} liter</b> ({kmPerLitre} km/l)</div>
            <div>Pris pr. km: <b>{formatPricePerKm(petrolCostPerKm)}</b></div>
            <div>Benzinpris: <b>{petrolPrice.toFixed(2)} kr./l</b></div>
          </div>

          <div
            style={{
              marginTop: '6px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.74rem',
              color: 'var(--text-muted)'
            }}
          >
            Merpris pr. tur: <b style={{ color: '#fb7185' }}>+{formatCurrency(savings)}</b>
          </div>
        </div>
      </div>

      {/* RUTEKORT (OPENSTREETMAP) */}
      {showMap && (
        <div style={{ marginTop: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '0.74rem',
              color: 'var(--text-muted)'
            }}
          >
            <span>Kørevej via OpenStreetMap (OSRM):</span>
            <span>
              {fromInput} ➔ {toInput} ({formatKm(distanceKm)})
            </span>
          </div>

          <RouteMap
            coordinates={coordinates}
            fromLabel={fromInput}
            toLabel={toInput}
            height="320px"
          />
        </div>
      )}

      {routeError && (
        <div
          style={{
            marginTop: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fca5a5',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={15} />
          <span>{routeError}</span>
        </div>
      )}
    </div>
  );
}
