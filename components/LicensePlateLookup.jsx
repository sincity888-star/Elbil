'use client';

import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, AlertCircle, Car, Sparkles, KeyRound } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function LicensePlateLookup({ onApplyCar, activeTab, initialOpen = false }) {
  const [plateInput, setPlateInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(initialOpen);

  const samplePlates = [
    { label: 'Elbil (Tesla Y)', code: 'EK99123' },
    { label: 'Benzin (Golf TSI)', code: 'AB12345' },
    { label: 'Hybrid (Yaris)', code: 'DG77123' }
  ];

  const handleLookup = async (plateToSearch) => {
    const query = (plateToSearch || plateInput).trim();
    if (!query || query.length < 2) {
      setError('Indtast venligst en nummerplade (f.eks. AB12345)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/nummerplade?plate=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok && data.success && data.car) {
        setResult(data);
      } else {
        setError(data.message || 'Kunne ikke finde bil med denne nummerplade');
      }
    } catch (err) {
      setError('Der opstod en netværksfejl under opslaget');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFoundCar = () => {
    if (result && result.car) {
      onApplyCar(result.car);
      setIsOpen(false);
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      
      {/* Åbn / Luk knap for Nummerpladeopslag */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
        border: '1px solid rgba(234, 179, 8, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Car size={20} color="#fbbf24" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>
                  Slå din bil op på nummerplade
                </h3>
                <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.25)', color: '#fbbf24', fontWeight: '700' }}>
                  DMR
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Hent automatisk bilmodel, forbrug og grøn ejerafgift
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: isOpen ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '7px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: isOpen ? 'none' : '0 2px 8px rgba(245, 158, 11, 0.3)'
            }}
          >
            {isOpen ? 'Luk' : 'Slå op'}
          </button>
        </div>

        {/* Udfoldet Nummerpladeopsalg Panel */}
        {isOpen && (
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            
            {/* Realistisk Dansk Nummerplade Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                border: '3px solid #1e293b',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                width: '100%',
                maxWidth: '320px',
                height: '52px'
              }}>
                {/* Blåt EU Bånd */}
                <div style={{
                  background: '#003399',
                  width: '42px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px 0'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#ffcc00' }}>🇪🇺</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: '900', color: '#ffffff', letterSpacing: '0.05em' }}>DK</span>
                </div>

                {/* Hvidt Nummerplade Felt */}
                <input
                  type="text"
                  placeholder="AB 12 345"
                  maxLength={9}
                  value={plateInput}
                  onChange={(e) => {
                    setPlateInput(e.target.value.toUpperCase());
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  style={{
                    flex: 1,
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#000000',
                    fontFamily: 'monospace, sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: '900',
                    letterSpacing: '0.15em',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              {/* Søg knap */}
              <button
                onClick={() => handleLookup()}
                disabled={loading}
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  background: 'var(--ev-gradient)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? <Loader2 size={16} className="spinner" /> : <Search size={16} />}
                <span>{loading ? 'Søger i Motorregistret...' : 'Hent biloplysninger'}</span>
              </button>
            </div>

            {/* Hurtigvalg af eksempler */}
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Prøv et hurtigt eksempel: </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {samplePlates.map((sample) => (
                  <button
                    key={sample.code}
                    onClick={() => {
                      setPlateInput(sample.code);
                      handleLookup(sample.code);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      color: '#38bdf8',
                      cursor: 'pointer'
                    }}
                  >
                    {sample.label} ({sample.code})
                  </button>
                ))}
              </div>
            </div>

            {/* Fejlbesked */}
            {error && (
              <div style={{
                marginTop: '12px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#fb7185',
                fontSize: '0.78rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Fundet Bil Resultat Boks */}
            {result && result.car && (
              <div style={{
                marginTop: '14px',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid ' + (result.car.type === 'ev' ? 'var(--ev-primary)' : 'var(--petrol-primary)'),
                borderRadius: '12px',
                padding: '14px',
                animation: 'fadeIn 0.2s ease-in-out'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: result.car.type === 'ev' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                      color: result.car.type === 'ev' ? '#34d399' : '#fb7185',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {result.car.type === 'ev' ? '⚡ Elbil Fundet' : (result.car.isHybrid ? '🔋 Hybrid Fundet' : '⛽ Benzinbil Fundet')}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
                      {result.car.name}
                    </h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Nummerplade: {result.car.plate} • Årgang: {result.car.year}
                    </p>
                  </div>
                  <span style={{ fontSize: '1.8rem' }}>{result.car.icon}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', margin: '10px 0' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Forbrug</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                      {result.car.type === 'ev' ? `${result.car.kmPerKwh} km/kWh` : `${result.car.kmPerLitre} km/l`}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Ejerafgift</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                      {result.car.halfYearTax} kr./h.år
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Anslået pris</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                      {formatCurrency(result.car.price)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSelectFoundCar}
                  style={{
                    width: '100%',
                    background: result.car.type === 'ev' ? 'var(--ev-gradient)' : 'var(--petrol-gradient)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Vælg {result.car.name} til beregneren</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
