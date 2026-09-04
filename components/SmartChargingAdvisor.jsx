'use client';

import React from 'react';
import { Moon, Zap, Clock, TrendingDown, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatPricePerKwh } from '../utils/formatters';

export default function SmartChargingAdvisor({ hours = [], hasRefund = true, onToggleChart, isChartOpen }) {
  if (!hours || hours.length === 0) return null;

  // 1. Find aktuel time
  const currentHourObj = hours.find(h => h.isCurrent) || hours[0];
  const currentPrice = currentHourObj?.consumerPriceHome || 1.35;

  // 2. Find den bedste sammenhængende 4-timers ladeblok (standard for 11 kW hjemmeladning af ~45 kWh)
  const WINDOW_SIZE = 4;
  let bestWindowStartIdx = 0;
  let lowestWindowAvg = Infinity;

  for (let i = 0; i <= hours.length - WINDOW_SIZE; i++) {
    let sum = 0;
    for (let j = 0; j < WINDOW_SIZE; j++) {
      sum += hours[i + j].consumerPriceHome;
    }
    const avg = sum / WINDOW_SIZE;
    if (avg < lowestWindowAvg) {
      lowestWindowAvg = avg;
      bestWindowStartIdx = i;
    }
  }

  const startHourObj = hours[bestWindowStartIdx];
  const endHourObj = hours[bestWindowStartIdx + WINDOW_SIZE] || hours[hours.length - 1];
  const windowStart = startHourObj?.hour || '01:00';
  const windowEnd = endHourObj?.hour || '05:00';
  const avgCheapestPrice = Number(lowestWindowAvg.toFixed(2));

  // 3. Find absolut laveste og højeste enkelttimer
  const sortedByPrice = [...hours].sort((a, b) => a.consumerPriceHome - b.consumerPriceHome);
  const absoluteLowest = sortedByPrice[0];
  const maxPriceObj = sortedByPrice[sortedByPrice.length - 1];
  const peakPrice = maxPriceObj?.consumerPriceHome || 2.45;

  // Pris for en typisk 50 kWh opladning (~ 280-320 km kørsel)
  const costCheap50kWh = avgCheapestPrice * 50;
  const costPeak50kWh = peakPrice * 50;
  const savingPerCharge = costPeak50kWh - costCheap50kWh;

  // Vurdering af den aktuelle time
  const isCurrentlyInWindow = (
    currentHourObj?.hourNumber >= startHourObj?.hourNumber && 
    currentHourObj?.hourNumber < (startHourObj?.hourNumber + WINDOW_SIZE)
  );
  const isCurrentlyLowest = currentHourObj?.hourNumber === absoluteLowest?.hourNumber;
  const isCurrentlyPeak = currentHourObj?.hourNumber >= 17 && currentHourObj?.hourNumber <= 21;

  let statusBadge = {
    title: 'Moderat elpris lige nu',
    desc: `Det er billigst at sætte laderen til kl. ${windowStart} – ${windowEnd}.`,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.3)',
    icon: Clock
  };

  if (isCurrentlyInWindow || isCurrentlyLowest) {
    statusBadge = {
      title: 'Perfekt tidspunkt at lade nu!',
      desc: 'Elprisen er i det billigste interval lige nu.',
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.35)',
      icon: CheckCircle2
    };
  } else if (isCurrentlyPeak) {
    statusBadge = {
      title: 'Dyr spidstime (kl. 17-21)',
      desc: `Undgå at lade nu – vent til efter kl. 23 eller i nat (${windowStart} - ${windowEnd}).`,
      color: '#fb7185',
      bg: 'rgba(244, 63, 94, 0.15)',
      border: 'rgba(244, 63, 94, 0.35)',
      icon: AlertTriangle
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0e1726 0%, #090e17 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
      }}>
        {/* Subtilt baggrundsglød */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Moon size={18} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>
                  Hvornår er det billigst at lade?
                </h3>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  fontWeight: '700'
                }}>
                  Live DK1
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Optimeret til smart-ladning i Vestdanmark
              </p>
            </div>
          </div>

          <button
            onClick={onToggleChart}
            style={{
              background: isChartOpen ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '5px 10px',
              fontSize: '0.72rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{isChartOpen ? 'Skjul graf' : 'Se døgnkurve'}</span>
          </button>
        </div>

        {/* Hovedanbefaling: Bedste ladetidspunkt */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              🌙 Billigste ladevindue i døgnet
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', marginTop: '2px' }}>
              Kl. {windowStart} – {windowEnd}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '2px', fontWeight: '600' }}>
              Gns. kun {formatPricePerKwh(avgCheapestPrice)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Spar pr. optankning:
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#34d399' }}>
              ~{Math.round(savingPerCharge)} kr.
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
              ved 50 kWh (~300 km)
            </div>
          </div>
        </div>

        {/* Lige-nu status boks */}
        <div style={{
          background: statusBadge.bg,
          border: `1px solid ${statusBadge.border}`,
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <StatusIcon size={20} color={statusBadge.color} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: statusBadge.color }}>
              {statusBadge.title} (lige nu: {formatPricePerKwh(currentPrice)})
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {statusBadge.desc}
            </div>
          </div>
        </div>

        {/* Hurtig sammenligning af fuld optankning */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginTop: '10px'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 10px'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
              🔋 Opladning i nat (50 kWh):
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>
              {formatCurrency(costCheap50kWh)}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              ca. 0,14 kr./km
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 10px'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
              ⚡ Opladning i dag/spidslast:
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fb7185', marginTop: '2px' }}>
              {formatCurrency(costPeak50kWh)}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              ca. 0,39 kr./km
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
