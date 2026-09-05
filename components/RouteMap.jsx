'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function RouteMap({ coordinates, fromLabel, toLabel, height = '320px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerGroupRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      const L = await import('leaflet');

      if (!isMounted) return;

      // Hvis kortet ikke allerede er initialiseret
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [56.0, 11.0], // Centrum af Danmark
          zoom: 7,
          zoomControl: true,
          attributionControl: false
        });

        // Tilføj mørkt, stilrent CartoDB Dark Matter tile-lag
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);
        routeLayerGroupRef.current = layerGroup;
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      const layerGroup = routeLayerGroupRef.current;

      if (!map || !layerGroup) return;

      layerGroup.clearLayers();

      if (coordinates && coordinates.length > 0) {
        // Tegn ruten med en flot, glødende cyan/turkis linje
        // Ydre glød
        const glowLine = L.polyline(coordinates, {
          color: '#06b6d4',
          weight: 7,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        });

        // Indre skarp linje
        const mainLine = L.polyline(coordinates, {
          color: '#22d3ee',
          weight: 3.5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        });

        glowLine.addTo(layerGroup);
        mainLine.addTo(layerGroup);

        // Opret stilrene HTML markører
        const startCoord = coordinates[0];
        const endCoord = coordinates[coordinates.length - 1];

        // Start markør
        const startIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background: linear-gradient(135deg, #10b981, #059669);
              border: 2px solid #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 800;
              font-size: 12px;
              box-shadow: 0 0 12px rgba(16, 185, 129, 0.7);
            ">A</div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        // Slut markør
        const endIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background: linear-gradient(135deg, #ec4899, #d946ef);
              border: 2px solid #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 800;
              font-size: 12px;
              box-shadow: 0 0 12px rgba(236, 72, 153, 0.7);
            ">B</div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        L.marker(startCoord, { icon: startIcon })
          .bindPopup(`<b>Start (A):</b> ${fromLabel || 'Startpunkt'}`)
          .addTo(layerGroup);

        L.marker(endCoord, { icon: endIcon })
          .bindPopup(`<b>Mål (B):</b> ${toLabel || 'Destination'}`)
          .addTo(layerGroup);

        // Zoom automatisk så hele ruten passer ind med lidt padding
        try {
          map.fitBounds(mainLine.getBounds(), {
            padding: [40, 40],
            maxZoom: 13,
            animate: true
          });
        } catch (e) {
          // Fallback hvis bounds fejler
        }
      }

      // Sørg for at kortet tilpasser sig elementets størrelse
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [coordinates, fromLabel, toLabel]);

  // Ryd op ved total demontering
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Attribution badge diskret i hjørnet */}
      <div
        style={{
          position: 'absolute',
          bottom: '6px',
          right: '8px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.65rem',
          color: 'rgba(255, 255, 255, 0.6)',
          pointerEvents: 'none',
          zIndex: 1000
        }}
      >
        © OpenStreetMap · OSRM
      </div>
    </div>
  );
}
