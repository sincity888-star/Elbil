'use client';

import React from 'react';
import { X, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency, formatKm } from '../utils/formatters';

export default function BreakevenModal({ isOpen, onClose, calculations, evName, petrolName }) {
  if (!isOpen) return null;

  const { savings } = calculations;
  const isEvCheaperPurchase = savings.initialPriceDiff <= 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 200
    }}>
      <div style={{
        background: '#131b28',
        border: '1px solid var(--border-subtle)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 20px 36px 20px',
        width: '100%',
        maxWidth: '540px',
        boxShadow: '0 -20px 50px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#34d399" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
              Breakeven Analyse
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {isEvCheaperPurchase ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--ev-border)',
            borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', gap: '12px'
          }}>
            <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                Elbilen er billigere fra Dag 1!
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {evName} har en lavere eller identisk købspris end {petrolName}, og samtidig markant lavere driftsomkostninger. Du sparer penge fra første kilometer!
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              background: 'rgba(0,0,0,0.35)', borderRadius: 'var(--radius-md)',
              padding: '16px', border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Merpris i indkøb for elbilen:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: '4px 0 12px 0' }}>
                {formatCurrency(savings.initialPriceDiff)}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Årlig driftsbesparelse:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399', margin: '4px 0 12px 0' }}>
                {formatCurrency(savings.annualTotal)} / år
              </div>

              <div style={{
                paddingTop: '12px', borderTop: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>Tjent hjem efter:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#34d399' }}>
                  {savings.breakevenYears} år ({formatKm(savings.breakevenKm)})
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: '1.4' }}>
              Efter {savings.breakevenYears} år er hele merprisen betalt af de lavere udgifter til strøm, grøn ejerafgift og service. Herefter er al besparelse ren gevinst.
            </p>
          </div>
        )}

        {/* Luk Knap */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '20px',
            background: 'var(--ev-gradient)',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          Forstået
        </button>
      </div>
    </div>
  );
}
