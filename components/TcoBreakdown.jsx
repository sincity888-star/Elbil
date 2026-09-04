'use client';

import React, { useState } from 'react';
import { formatCurrency, formatPricePerKm } from '../utils/formatters';
import { ChevronDown, ChevronUp, Layers, HelpCircle } from 'lucide-react';

export default function TcoBreakdown({ calculations, evName, petrolName }) {
  const [isOpen, setIsOpen] = useState(false);
  const { ev, petrol } = calculations;

  const costItems = [
    {
      title: 'Brændstof / Strøm',
      evAmount: ev.fuelCostAnnual,
      petrolAmount: petrol.fuelCostAnnual,
      note: 'Årlig energipris ved dit km-tal'
    },
    {
      title: 'Grøn Ejerafgift',
      evAmount: ev.taxAnnual,
      petrolAmount: petrol.taxAnnual,
      note: 'Halvårlig vægtafgift x 2'
    },
    {
      title: 'Service & Vedligehold',
      evAmount: ev.serviceAnnual,
      petrolAmount: petrol.serviceAnnual,
      note: 'Elbiler har ingen olie, tandrem eller tændrør'
    },
    {
      title: 'Forsikring',
      evAmount: ev.insuranceAnnual,
      petrolAmount: petrol.insuranceAnnual,
      note: 'Gennemsnitlig kaskoforsikring'
    },
    {
      title: 'Estimeret Værditab',
      evAmount: ev.depreciationAnnual,
      petrolAmount: petrol.depreciationAnnual,
      note: 'Beregnet over 5 års ejerskab'
    }
  ];

  return (
    <div className="premium-card" style={{ margin: '0 16px' }}>
      
      {/* Header / Dropdown Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Layers size={18} color="#9ca3af" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
              Komplet TCO Sammenligning
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Se hvad pengene går til om året
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
            {isOpen ? 'Skjul detaljer' : 'Se detaljer'}
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Fold-ud Detaljer */}
      {isOpen && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <span style={{ color: '#34d399', fontWeight: '700' }}>● {evName}</span>
            <span style={{ color: '#fb7185', fontWeight: '700' }}>● {petrolName}</span>
          </div>

          {costItems.map((item, idx) => {
            const maxVal = Math.max(item.evAmount, item.petrolAmount, 1);
            const evPercent = (item.evAmount / maxVal) * 100;
            const petrolPercent = (item.petrolAmount / maxVal) * 100;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: '600', color: '#ffffff' }}>{item.title}</span>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <span style={{ color: '#34d399', fontWeight: '700' }}>{formatCurrency(item.evAmount)}</span>
                    <span style={{ color: '#fb7185', fontWeight: '700' }}>{formatCurrency(item.petrolAmount)}</span>
                  </div>
                </div>

                {/* Dobbelt bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ height: '6px', width: `${evPercent}%`, background: 'var(--ev-gradient)', borderRadius: '3px' }} />
                  <div style={{ height: '6px', width: `${petrolPercent}%`, background: 'var(--petrol-gradient)', borderRadius: '3px' }} />
                </div>
              </div>
            );
          })}

          {/* Samlet TCO Pr. Km */}
          <div style={{
            marginTop: '8px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
              Samlet pris pr. kørt km:
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#34d399' }}>
                {formatPricePerKm(ev.costPerKm)}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fb7185' }}>
                {formatPricePerKm(petrol.costPerKm)}
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
