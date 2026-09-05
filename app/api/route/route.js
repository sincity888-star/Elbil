import { NextResponse } from 'next/server';

// Kendte danske byer med præcise koordinater [lon, lat]
const KNOWN_CITIES = {
  'københavn': { name: 'København', lat: 55.6761, lon: 12.5683, label: 'København' },
  'kobenhavn': { name: 'København', lat: 55.6761, lon: 12.5683, label: 'København' },
  'copenhagen': { name: 'København', lat: 55.6761, lon: 12.5683, label: 'København' },
  'aarhus': { name: 'Aarhus', lat: 56.1629, lon: 10.2039, label: 'Aarhus' },
  'århus': { name: 'Aarhus', lat: 56.1629, lon: 10.2039, label: 'Aarhus' },
  'odense': { name: 'Odense', lat: 55.4038, lon: 10.3883, label: 'Odense' },
  'aalborg': { name: 'Aalborg', lat: 57.0488, lon: 9.9217, label: 'Aalborg' },
  'ålborg': { name: 'Aalborg', lat: 57.0488, lon: 9.9217, label: 'Aalborg' },
  'esbjerg': { name: 'Esbjerg', lat: 55.4703, lon: 8.4519, label: 'Esbjerg' },
  'vejle': { name: 'Vejle', lat: 55.7093, lon: 9.5357, label: 'Vejle' },
  'kolding': { name: 'Kolding', lat: 55.4904, lon: 9.4730, label: 'Kolding' },
  'horsens': { name: 'Horsens', lat: 55.8607, lon: 9.8503, label: 'Horsens' },
  'roskilde': { name: 'Roskilde', lat: 55.6415, lon: 12.0803, label: 'Roskilde' },
  'helsingør': { name: 'Helsingør', lat: 56.0361, lon: 12.6136, label: 'Helsingør' },
  'herning': { name: 'Herning', lat: 56.1354, lon: 8.9738, label: 'Herning' },
  'silkeborg': { name: 'Silkeborg', lat: 56.1697, lon: 9.5451, label: 'Silkeborg' },
  'næstved': { name: 'Næstved', lat: 55.2299, lon: 11.7609, label: 'Næstved' },
  'randers': { name: 'Randers', lat: 56.4607, lon: 10.0364, label: 'Randers' },
  'fredericia': { name: 'Fredericia', lat: 55.5657, lon: 9.7522, label: 'Fredericia' },
  'hillerød': { name: 'Hillerød', lat: 55.9279, lon: 12.3008, label: 'Hillerød' },
  'slangerup': { name: 'Slangerup', lat: 55.8447, lon: 12.1706, label: 'Slangerup' },
  'skagen': { name: 'Skagen', lat: 57.7209, lon: 10.5840, label: 'Skagen' },
  'billund': { name: 'Billund', lat: 55.7303, lon: 9.1158, label: 'Billund' }
};

// Geocoding hjælpefunktion
async function geocodeAddress(query) {
  if (!query || typeof query !== 'string') return null;
  const qClean = query.trim().toLowerCase();

  // 1. Tjek kendte byer for øjeblikkeligt hit
  if (KNOWN_CITIES[qClean]) {
    return KNOWN_CITIES[qClean];
  }

  // 2. OpenStreetMap / Photon geocoder
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(`https://photon.komoot.io/api/?q=${encoded}&limit=5&lat=56&lon=10`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        // Find det bedste match (helst i Danmark)
        const dkFeature = data.features.find(f => f.properties.country === 'Danmark') || data.features[0];
        const [lon, lat] = dkFeature.geometry.coordinates;
        const p = dkFeature.properties;
        const parts = [p.name, p.postcode, p.city || p.county].filter(Boolean);
        return {
          name: p.name || query,
          label: parts.length > 1 ? parts.join(', ') : (p.name || query),
          lat,
          lon
        };
      }
    }
  } catch (err) {
    console.warn('Geocoding fetch failed:', err.message);
  }

  return null;
}

// Beregn vejafstand via OSRM
async function calculateDrivingRoute(fromCoords, toCoords) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Number((route.distance / 1000).toFixed(1));
        const durationMinutes = Math.round(route.duration / 60);

        // Omdan coordinates fra [lon, lat] til [lat, lon] for Leaflet
        const coordinates = (route.geometry?.coordinates || []).map(([lon, lat]) => [lat, lon]);

        return {
          distanceKm,
          durationMinutes,
          coordinates
        };
      }
    }
  } catch (err) {
    console.warn('OSRM routing fetch failed:', err.message);
  }

  // Matematisk Haversine fallback med 1.28x vejkorrektion hvis OSRM er offline
  const R = 6371; // km
  const dLat = ((toCoords.lat - fromCoords.lat) * Math.PI) / 180;
  const dLon = ((toCoords.lon - fromCoords.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((fromCoords.lat * Math.PI) / 180) *
      Math.cos((toCoords.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;
  const estimatedRoadKm = Number((straightLineKm * 1.28).toFixed(1));
  const estimatedMinutes = Math.round((estimatedRoadKm / 85) * 60);

  return {
    distanceKm: estimatedRoadKm,
    durationMinutes: estimatedMinutes,
    coordinates: [
      [fromCoords.lat, fromCoords.lon],
      [toCoords.lat, toCoords.lon]
    ]
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  // 1. Autocomplete forslag
  if (action === 'autocomplete') {
    const q = searchParams.get('q') || '';
    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    try {
      const encoded = encodeURIComponent(q.trim());
      const res = await fetch(`https://photon.komoot.io/api/?q=${encoded}&limit=6&lat=56&lon=10`);
      if (res.ok) {
        const data = await res.json();
        const results = (data.features || []).map(f => {
          const p = f.properties;
          const [lon, lat] = f.geometry.coordinates;
          const detail = [p.postcode, p.city || p.county, p.country || 'Danmark'].filter(Boolean).join(', ');
          return {
            id: `${lat}_${lon}_${p.name}`,
            name: p.name,
            detail,
            label: `${p.name}${detail ? ` (${detail})` : ''}`,
            lat,
            lon
          };
        });
        return NextResponse.json({ success: true, results });
      }
    } catch (e) {
      console.warn('Autocomplete error:', e.message);
    }
    return NextResponse.json({ success: true, results: [] });
  }

  // 2. Ruteberegning
  const fromQuery = searchParams.get('from');
  const toQuery = searchParams.get('to');
  const fromLat = searchParams.get('fromLat');
  const fromLon = searchParams.get('fromLon');
  const toLat = searchParams.get('toLat');
  const toLon = searchParams.get('toLon');

  let fromCoords = null;
  let toCoords = null;

  if (fromLat && fromLon) {
    fromCoords = {
      name: fromQuery || 'Startpunkt',
      label: fromQuery || 'Start',
      lat: parseFloat(fromLat),
      lon: parseFloat(fromLon)
    };
  } else if (fromQuery) {
    fromCoords = await geocodeAddress(fromQuery);
  }

  if (toLat && toLon) {
    toCoords = {
      name: toQuery || 'Slutpunkt',
      label: toQuery || 'Slut',
      lat: parseFloat(toLat),
      lon: parseFloat(toLon)
    };
  } else if (toQuery) {
    toCoords = await geocodeAddress(toQuery);
  }

  if (!fromCoords || !toCoords) {
    return NextResponse.json(
      {
        success: false,
        message: 'Kunne ikke finde en eller begge adresser. Prøv venligst en anden by eller adresse.'
      },
      { status: 400 }
    );
  }

  const routeData = await calculateDrivingRoute(fromCoords, toCoords);

  // Formater køretid
  const hours = Math.floor(routeData.durationMinutes / 60);
  const mins = routeData.durationMinutes % 60;
  const formattedDuration = hours > 0 ? `${hours} t ${mins} min` : `${mins} min`;

  return NextResponse.json({
    success: true,
    from: fromCoords,
    to: toCoords,
    distanceKm: routeData.distanceKm,
    durationMinutes: routeData.durationMinutes,
    formattedDuration,
    coordinates: routeData.coordinates
  });
}
