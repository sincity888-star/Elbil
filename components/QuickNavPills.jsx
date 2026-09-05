'use client';

import React, { useState, useEffect } from 'react';
import { Award, Car, Navigation, Zap, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'section-verdict', label: 'Overblik', shortLabel: 'Overblik', icon: Award, color: '#10b981' },
  { id: 'section-cars', label: '1. Biler', shortLabel: 'Biler', icon: Car, color: '#6366f1' },
  { id: 'section-driving', label: '2. Kørsel & Rute', shortLabel: 'Rute', icon: Navigation, color: '#06b6d4' },
  { id: 'section-electricity', label: '3. Elpriser', shortLabel: 'Elpris', icon: Zap, color: '#f59e0b' },
  { id: 'section-tco', label: '4. TCO Regnskab', shortLabel: 'TCO', icon: BarChart3, color: '#a855f7' }
];

export default function QuickNavPills() {
  const [activeId, setActiveId] = useState('section-verdict');

  const scrollToSection = (id) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      // Beregn offset så vi ikke dækkes af sticky header
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Lyt på scroll for at markere den aktive sektion
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '8px 12px',
        margin: '0 -4px 10px -4px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
      className="no-scrollbar"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: isActive ? `1px solid ${item.color}` : '1px solid rgba(255, 255, 255, 0.08)',
              background: isActive
                ? `linear-gradient(135deg, ${item.color}30, ${item.color}15)`
                : 'rgba(255, 255, 255, 0.03)',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: isActive ? '700' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? `0 2px 10px ${item.color}30` : 'none',
              flexShrink: 0
            }}
          >
            <Icon size={13} color={isActive ? item.color : 'var(--text-dim)'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
