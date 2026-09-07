'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  Maximize2,
  Minimize2,
  Zap,
  Layers,
  Crosshair,
  MapPin,
  Clock,
  Navigation,
  X
} from 'lucide-react';
import { getChargersNearRoute } from '../data/chargers';

// Tilgængelige kortlag / Basemaps
const BASEMAP_PRESETS = {
  dark: {
    id: 'dark',
    name: 'Mørkt',
    icon: '🌙',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  },
  light: {
    id: 'light',
    name: 'Gadekort',
    icon: '☀️',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  },
  satellite: {
    id: 'satellite',
    name: 'Satellit',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    subdomains: 'abc',
    maxZoom: 18
  }
};

export default function RouteMap({
  coordinates,
  fromLabel,
  toLabel,
  distanceKm,
  durationMinutes,
  height = '360px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const routeLayerGroupRef = useRef(null);
  const chargersLayerGroupRef = useRef(null);
  const leafletModuleRef = useRef(null);

  // UI Tilstande
  const [activeBasemap, setActiveBasemap] = useState('dark');
  const [showChargers, setShowChargers] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | '300+' | 'tesla' | 'clever' | 'ionity'

  // Beregn lynladestationer nær ruten (inden for 15 km)
  const nearbyChargers = useMemo(() => {
    if (!coordinates || coordinates.length === 0) return [];
    return getChargersNearRoute(coordinates, 15);
  }, [coordinates]);

  // Filtrerede ladestandere
  const filteredChargers = useMemo(() => {
    if (!showChargers) return [];
    if (selectedFilter === 'all') return nearbyChargers;
    if (selectedFilter === '300+') return nearbyChargers.filter((c) => c.powerKw >= 300);
    if (selectedFilter === 'tesla') return nearbyChargers.filter((c) => c.operator === 'Tesla');
    if (selectedFilter === 'clever') return nearbyChargers.filter((c) => c.operator === 'Clever');
    if (selectedFilter === 'ionity') return nearbyChargers.filter((c) => c.operator === 'IONITY');
    return nearbyChargers;
  }, [nearbyChargers, showChargers, selectedFilter]);

  // ESC tast til at forlade fuldskærm
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Håndter størrelsesændring i Leaflet ved fuldskærmsskift
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Initialiser eller opdater kortet
  useEffect(() => {
    let isMounted = true;

    async function initOrUpdateMap() {
      if (!mapContainerRef.current) return;

      if (!leafletModuleRef.current) {
        leafletModuleRef.current = await import('leaflet');
      }
      const L = leafletModuleRef.current;

      if (!isMounted) return;

      // 1. Initialiser Leaflet Map hvis det ikke eksisterer
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [56.0, 11.0],
          zoom: 7,
          zoomControl: false, // Vi placerer vores egne knapper
          attributionControl: false
        });

        // Opret baselag
        const cfg = BASEMAP_PRESETS[activeBasemap] || BASEMAP_PRESETS.dark;
        const baseLayer = L.tileLayer(cfg.url, {
          maxZoom: cfg.maxZoom,
          subdomains: cfg.subdomains,
          attribution: cfg.attribution
        }).addTo(map);
        baseTileLayerRef.current = baseLayer;

        // Opret lag-grupper
        const routeGroup = L.layerGroup().addTo(map);
        const chargersGroup = L.layerGroup().addTo(map);
        routeLayerGroupRef.current = routeGroup;
        chargersLayerGroupRef.current = chargersGroup;

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      const routeGroup = routeLayerGroupRef.current;

      if (!map || !routeGroup) return;

      // 2. Tegn ruten
      routeGroup.clearLayers();

      if (coordinates && coordinates.length > 0) {
        // Ydre lysende glød
        const glowLine = L.polyline(coordinates, {
          color: '#06b6d4',
          weight: 7,
          opacity: 0.4,
          lineCap: 'round',
          lineJoin: 'round'
        });

        // Indre skarp rute
        const mainLine = L.polyline(coordinates, {
          color: '#22d3ee',
          weight: 3.5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        });

        glowLine.addTo(routeGroup);
        mainLine.addTo(routeGroup);

        // Start (A) og Mål (B) markører
        const startCoord = coordinates[0];
        const endCoord = coordinates[coordinates.length - 1];

        const startIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #10b981, #059669);
              border: 2.5px solid #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 900;
              font-size: 13px;
              box-shadow: 0 0 16px rgba(16, 185, 129, 0.8), 0 4px 6px rgba(0,0,0,0.4);
            ">A</div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const endIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #ec4899, #d946ef);
              border: 2.5px solid #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 900;
              font-size: 13px;
              box-shadow: 0 0 16px rgba(236, 72, 153, 0.8), 0 4px 6px rgba(0,0,0,0.4);
            ">B</div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker(startCoord, { icon: startIcon })
          .bindPopup(`
            <div style="min-width: 170px; font-family: inherit;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #10b981; font-weight: 800; margin-bottom: 2px;">Startpunkt (A)</div>
              <div style="font-size: 14px; font-weight: 700; color: #f8fafc;">${fromLabel || 'Start'}</div>
            </div>
          `)
          .addTo(routeGroup);

        L.marker(endCoord, { icon: endIcon })
          .bindPopup(`
            <div style="min-width: 170px; font-family: inherit;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ec4899; font-weight: 800; margin-bottom: 2px;">Destination (B)</div>
              <div style="font-size: 14px; font-weight: 700; color: #f8fafc;">${toLabel || 'Destination'}</div>
              ${distanceKm ? `<div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Samlet distance: <b style="color: #38bdf8;">${distanceKm} km</b></div>` : ''}
            </div>
          `)
          .addTo(routeGroup);

        // Halvvejspunkt (Midpoint) hvis ruten er over 50 km
        if (distanceKm && distanceKm >= 50 && coordinates.length > 10) {
          const midIndex = Math.floor(coordinates.length / 2);
          const midCoord = coordinates[midIndex];
          const halfKm = Math.round(distanceKm / 2);
          const halfMin = durationMinutes ? Math.round(durationMinutes / 2) : null;

          const midIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `
              <div style="
                background: rgba(15, 23, 42, 0.9);
                border: 1.5px solid #38bdf8;
                border-radius: 12px;
                padding: 3px 8px;
                color: #e2e8f0;
                font-weight: 700;
                font-size: 10px;
                white-space: nowrap;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                gap: 4px;
              ">
                <span style="color: #38bdf8;">📍</span>
                <span>Halvvejs (~${halfKm} km)</span>
              </div>
            `,
            iconSize: [110, 24],
            iconAnchor: [55, 12]
          });

          L.marker(midCoord, { icon: midIcon })
            .bindPopup(`
              <div style="min-width: 160px; font-family: inherit;">
                <div style="font-size: 11px; text-transform: uppercase; color: #38bdf8; font-weight: 800;">Halvvejspunkt</div>
                <div style="font-size: 13px; font-weight: 700; color: #f8fafc; margin-top: 2px;">Cirka ${halfKm} km fra start</div>
                ${halfMin ? `<div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Køretid: ca. ${halfMin} min</div>` : ''}
                <div style="font-size: 10px; color: #10b981; margin-top: 4px;">Oplagt stop til strække ben eller lade elbilen</div>
              </div>
            `)
            .addTo(routeGroup);
        }

        // Zoom automatisk til ruten
        try {
          map.fitBounds(mainLine.getBounds(), {
            padding: [45, 45],
            maxZoom: 13,
            animate: true
          });
        } catch (e) {
          // Fallback hvis bounds fejler
        }
      }

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);
    }

    initOrUpdateMap();

    return () => {
      isMounted = false;
    };
  }, [coordinates, fromLabel, toLabel, distanceKm, durationMinutes]);

  // Opdater basemap når activeBasemap ændres
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current || !leafletModuleRef.current) return;
    const L = leafletModuleRef.current;
    const cfg = BASEMAP_PRESETS[activeBasemap] || BASEMAP_PRESETS.dark;

    mapInstanceRef.current.removeLayer(baseTileLayerRef.current);
    const newLayer = L.tileLayer(cfg.url, {
      maxZoom: cfg.maxZoom,
      subdomains: cfg.subdomains,
      attribution: cfg.attribution
    }).addTo(mapInstanceRef.current);

    // Sørg for at tile-laget er bagerst
    newLayer.bringToBack();
    baseTileLayerRef.current = newLayer;
  }, [activeBasemap]);

  // Opdater lynladere på kortet
  useEffect(() => {
    if (!mapInstanceRef.current || !chargersLayerGroupRef.current || !leafletModuleRef.current) return;
    const L = leafletModuleRef.current;
    const chargersGroup = chargersLayerGroupRef.current;

    chargersGroup.clearLayers();

    if (!showChargers) return;

    for (const ch of filteredChargers) {
      const opColor = ch.operatorColor || '#0ea5e9';

      const chargerIcon = L.divIcon({
        className: 'charger-map-marker',
        html: `
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            background: rgba(15, 23, 42, 0.92);
            border: 2px solid ${opColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 13px;
            box-shadow: 0 0 12px ${opColor}88, 0 3px 6px rgba(0,0,0,0.5);
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <span style="line-height: 1; filter: drop-shadow(0 0 2px ${opColor});">⚡</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([ch.lat, ch.lon], { icon: chargerIcon });

      marker.bindPopup(`
        <div style="min-width: 220px; font-family: inherit; line-height: 1.4;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="
              background: ${opColor}22;
              color: ${opColor};
              border: 1px solid ${opColor}55;
              padding: 2px 7px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">${ch.operator}</span>
            <span style="
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              padding: 2px 7px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 800;
            ">${ch.powerKw} kW Lynlader</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #f8fafc; margin-bottom: 2px;">
            ${ch.name}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
            📍 ${ch.address}, ${ch.city}
          </div>
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            background: rgba(255, 255, 255, 0.05);
            padding: 6px 8px;
            border-radius: 8px;
            font-size: 10px;
            color: #cbd5e1;
          ">
            <div>🔌 Udtag: <b style="color: #ffffff;">${ch.stalls} lynstik</b></div>
            <div>🛣️ Fra rute: <b style="color: #38bdf8;">${ch.distanceToRouteKm} km</b></div>
          </div>
          <div style="margin-top: 8px; font-size: 10px; color: #64748b; text-align: right;">
            Understøtter CCS / Lynopladning
          </div>
        </div>
      `);

      chargersGroup.addLayer(marker);
    }
  }, [filteredChargers, showChargers]);

  // Ryd op ved demontering
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Håndter zoom tilbage til ruten
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current || !coordinates || coordinates.length === 0) return;
    try {
      const L = leafletModuleRef.current;
      if (L) {
        const line = L.polyline(coordinates);
        mapInstanceRef.current.fitBounds(line.getBounds(), {
          padding: [45, 45],
          maxZoom: 13,
          animate: true
        });
      }
    } catch (e) {
      // Ignorer bounds fejl
    }
  };

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : undefined,
        left: isFullscreen ? 0 : undefined,
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : height,
        zIndex: isFullscreen ? 999999 : 1,
        borderRadius: isFullscreen ? '0' : '16px',
        overflow: 'hidden',
        background: '#090d16',
        border: isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isFullscreen ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.45)',
        transition: 'height 0.2s ease, border-radius 0.2s ease'
      }}
    >
      {/* Global popup styles for Leaflet */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-radius: 14px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6) !important;
          color: #f1f5f9 !important;
          padding: 6px !important;
        }
        .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          padding: 6px !important;
        }
        .leaflet-popup-close-button:hover {
          color: #ffffff !important;
        }
      `}</style>

      {/* Rute-header i Fuldskærm */}
      {isFullscreen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10000,
            background: 'linear-gradient(180deg, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.6) 80%, transparent 100%)',
            backdropFilter: 'blur(8px)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)'
              }}
            >
              <Navigation size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>
                {fromLabel || 'Start'} ➔ {toLabel || 'Mål'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', gap: '10px' }}>
                {distanceKm && <span>Afstand: <b style={{ color: '#38bdf8' }}>{distanceKm} km</b></span>}
                {durationMinutes && <span>Køretid: <b style={{ color: '#f59e0b' }}>ca. {durationMinutes} min</b></span>}
                {nearbyChargers.length > 0 && (
                  <span>Lynladere langs rute: <b style={{ color: '#10b981' }}>{nearbyChargers.length} stationer</b></span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.15s'
            }}
          >
            <X size={16} />
            <span>Luk Fuldskærm</span>
          </button>
        </div>
      )}

      {/* Flydende kontrolpanel (Øverst til Højre) */}
      <div
        style={{
          position: 'absolute',
          top: isFullscreen ? '75px' : '10px',
          right: '10px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-end'
        }}
      >
        {/* Basemap Switcher (Pill) */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '3px',
            display: 'flex',
            gap: '2px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          }}
        >
          {Object.values(BASEMAP_PRESETS).map((bm) => (
            <button
              key={bm.id}
              onClick={() => setActiveBasemap(bm.id)}
              style={{
                background: activeBasemap === bm.id ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                border: activeBasemap === bm.id ? '1px solid #38bdf8' : '1px solid transparent',
                borderRadius: '8px',
                padding: '4px 8px',
                color: activeBasemap === bm.id ? '#ffffff' : '#94a3b8',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              title={`Skift til ${bm.name} kort`}
            >
              <span>{bm.icon}</span>
              <span>{bm.name}</span>
            </button>
          ))}
        </div>

        {/* Funktionsknapper (Fuldskærm + Centrer) */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleRecenter}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#e2e8f0',
              fontSize: '0.72rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)'
            }}
            title="Gen-centrer ruten"
          >
            <Crosshair size={14} color="#38bdf8" />
            <span>Centrér</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              background: isFullscreen ? '#0284c7' : 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)'
            }}
            title={isFullscreen ? 'Minimer kort' : 'Fuldskærm'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? 'Minimér' : 'Fuldskærm'}</span>
          </button>
        </div>
      </div>

      {/* Flydende Lynlader-Panel (Nederst til Venstre) */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {/* Toggle Lynladere */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '5px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          }}
        >
          <button
            onClick={() => setShowChargers(!showChargers)}
            style={{
              background: showChargers ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: showChargers ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '7px',
              padding: '4px 8px',
              color: showChargers ? '#34d399' : '#94a3b8',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Zap size={14} color={showChargers ? '#34d399' : '#94a3b8'} />
            <span>{showChargers ? `Lynladere (${nearbyChargers.length})` : 'Vis Lynladere'}</span>
          </button>

          {/* Hurtig-filtre for ladere når aktiv */}
          {showChargers && nearbyChargers.length > 0 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'all', label: 'Alle' },
                { id: '300+', label: '300+ kW' },
                { id: 'tesla', label: 'Tesla' },
                { id: 'clever', label: 'Clever' }
              ].map((flt) => (
                <button
                  key={flt.id}
                  onClick={() => setSelectedFilter(flt.id)}
                  style={{
                    background: selectedFilter === flt.id ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                    border: selectedFilter === flt.id ? '1px solid #38bdf8' : '1px solid transparent',
                    borderRadius: '6px',
                    padding: '3px 6px',
                    color: selectedFilter === flt.id ? '#ffffff' : '#64748b',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {flt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kort-beholder (Leaflet) */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Diskret kortkilde-attribution */}
      <div
        style={{
          position: 'absolute',
          bottom: '6px',
          right: '8px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.62rem',
          color: 'rgba(255, 255, 255, 0.6)',
          pointerEvents: 'none',
          zIndex: 1000
        }}
      >
        © OpenStreetMap · {BASEMAP_PRESETS[activeBasemap]?.name || 'CARTO'}
      </div>
    </div>
  );
}
