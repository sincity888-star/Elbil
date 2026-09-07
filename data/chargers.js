/**
 * Danske Lynladere (High-Power DC Fast Chargers 150-400 kW)
 * Kurateret netværk af strategisk placerede lynladestationer langs de store færdselsårer (E20, E45, m.fl.)
 */

export const FAST_CHARGERS = [
  // --- E20 / Sjælland ---
  {
    id: 'karlslunde-clever',
    name: 'Clever Lynladestation Karlslunde',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 8,
    lat: 55.5721,
    lon: 12.2612,
    address: 'Køge Bugt Motorvejen 28',
    city: 'Karlslunde'
  },
  {
    id: 'koge-tesla',
    name: 'Tesla Supercharger Køge',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 16,
    lat: 55.4578,
    lon: 12.1523,
    address: 'Københavnsvej 224',
    city: 'Køge'
  },
  {
    id: 'koge-ionity',
    name: 'IONITY Køge Nord',
    operator: 'IONITY',
    operatorColor: '#06b6d4',
    powerKw: 350,
    stalls: 6,
    lat: 55.4856,
    lon: 12.1645,
    address: 'Nordstjernen 1',
    city: 'Køge'
  },
  {
    id: 'ringsted-unox',
    name: 'Uno-X Lynlader Ringsted',
    operator: 'Uno-X',
    operatorColor: '#f59e0b',
    powerKw: 300,
    stalls: 8,
    lat: 55.4419,
    lon: 11.7891,
    address: 'Næstvedvej 350',
    city: 'Ringsted'
  },
  {
    id: 'slagelse-clever',
    name: 'Clever Lynladestation Slagelse',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 12,
    lat: 55.3995,
    lon: 11.3852,
    address: 'Trafikcenter Alle 4',
    city: 'Slagelse'
  },
  {
    id: 'slagelse-tesla',
    name: 'Tesla Supercharger Slagelse',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 16,
    lat: 55.3980,
    lon: 11.3831,
    address: 'Trafikcenter Alle 2',
    city: 'Slagelse'
  },
  {
    id: 'korsor-ionity',
    name: 'IONITY Korsør',
    operator: 'IONITY',
    operatorColor: '#06b6d4',
    powerKw: 350,
    stalls: 6,
    lat: 55.3341,
    lon: 11.1623,
    address: 'Halsskov Tværvej 1',
    city: 'Korsør'
  },

  // --- E20 / Fyn ---
  {
    id: 'nyborg-ionity',
    name: 'IONITY Nyborg',
    operator: 'IONITY',
    operatorColor: '#06b6d4',
    powerKw: 350,
    stalls: 6,
    lat: 55.3218,
    lon: 10.7681,
    address: 'Storebæltsvej 60',
    city: 'Nyborg'
  },
  {
    id: 'odense-clever-odense-so',
    name: 'Clever Lynladestation Odense SØ',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 16,
    lat: 55.3582,
    lon: 10.4521,
    address: 'Krogagervej 2',
    city: 'Odense'
  },
  {
    id: 'odense-tesla',
    name: 'Tesla Supercharger Odense',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 20,
    lat: 55.3621,
    lon: 10.4542,
    address: 'Ørbækvej 268',
    city: 'Odense'
  },
  {
    id: 'middelfart-clever',
    name: 'Clever Lynladestation Middelfart',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 8,
    lat: 55.4988,
    lon: 9.7712,
    address: 'Mandal Alle 21',
    city: 'Middelfart'
  },
  {
    id: 'middelfart-tesla',
    name: 'Tesla Supercharger Middelfart',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 12,
    lat: 55.5012,
    lon: 9.7689,
    address: 'Karensmindevej 2',
    city: 'Middelfart'
  },

  // --- E45 / Trekantområdet & Syddanmark ---
  {
    id: 'fredericia-ionity',
    name: 'IONITY Fredericia',
    operator: 'IONITY',
    operatorColor: '#06b6d4',
    powerKw: 350,
    stalls: 6,
    lat: 55.5742,
    lon: 9.6912,
    address: 'Strevelinsvej 15',
    city: 'Fredericia'
  },
  {
    id: 'kolding-clever',
    name: 'Clever Lynladestation Kolding',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 12,
    lat: 55.5124,
    lon: 9.4761,
    address: 'Vejlevej 341',
    city: 'Kolding'
  },
  {
    id: 'kolding-tesla',
    name: 'Tesla Supercharger Kolding',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 16,
    lat: 55.5110,
    lon: 9.4745,
    address: 'Kokholm 2',
    city: 'Kolding'
  },
  {
    id: 'aabenraa-ionity',
    name: 'IONITY Aabenraa',
    operator: 'IONITY',
    operatorColor: '#06b6d4',
    powerKw: 350,
    stalls: 6,
    lat: 55.0592,
    lon: 9.3854,
    address: 'Hovslundvej 2',
    city: 'Rødekro'
  },
  {
    id: 'esbjerg-clever',
    name: 'Clever Lynladestation Esbjerg',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 8,
    lat: 55.4981,
    lon: 8.4982,
    address: 'Kjersing Ringvej 1',
    city: 'Esbjerg'
  },

  // --- E45 / Midt- og Nordjylland ---
  {
    id: 'vejle-clever',
    name: 'Clever Lynladestation Vejle Nord',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 12,
    lat: 55.7381,
    lon: 9.5821,
    address: 'Horsensvej 85',
    city: 'Vejle'
  },
  {
    id: 'horsens-unox',
    name: 'Uno-X Lynlader Horsens S',
    operator: 'Uno-X',
    operatorColor: '#f59e0b',
    powerKw: 300,
    stalls: 8,
    lat: 55.8341,
    lon: 9.8012,
    address: 'Vejlevej 120',
    city: 'Horsens'
  },
  {
    id: 'skanderborg-clever',
    name: 'Clever Lynladestation Skanderborg',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 8,
    lat: 56.0482,
    lon: 9.9412,
    address: 'Danmarksvej 34',
    city: 'Skanderborg'
  },
  {
    id: 'aarhus-tesla',
    name: 'Tesla Supercharger Aarhus S',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 16,
    lat: 56.1118,
    lon: 10.1341,
    address: 'Hasselager Centervej 30',
    city: 'Aarhus'
  },
  {
    id: 'aarhus-clever',
    name: 'Clever Lynladestation Aarhus N',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 16,
    lat: 56.1981,
    lon: 10.1582,
    address: 'Brendstrupgårdsvej 21',
    city: 'Aarhus'
  },
  {
    id: 'randers-tesla',
    name: 'Tesla Supercharger Randers',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 16,
    lat: 56.4421,
    lon: 10.0152,
    address: 'Messingvej 2',
    city: 'Randers'
  },
  {
    id: 'haverslev-clever',
    name: 'Clever Lynladestation Haverslev',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 12,
    lat: 56.7842,
    lon: 9.6912,
    address: 'Industriparken 2',
    city: 'Haverslev'
  },
  {
    id: 'haverslev-tesla',
    name: 'Tesla Supercharger Haverslev',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 16,
    lat: 56.7821,
    lon: 9.6945,
    address: 'Strandvejen 3',
    city: 'Haverslev'
  },
  {
    id: 'aalborg-clever',
    name: 'Clever Lynladestation Aalborg SØ',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 16,
    lat: 57.0142,
    lon: 9.9721,
    address: 'P. O. Pedersens Vej 1',
    city: 'Aalborg'
  },
  {
    id: 'aalborg-tesla',
    name: 'Tesla Supercharger Aalborg',
    operator: 'Tesla',
    operatorColor: '#ef4444',
    powerKw: 250,
    stalls: 20,
    lat: 57.0121,
    lon: 9.9689,
    address: 'Hobrovej 452',
    city: 'Aalborg'
  },
  {
    id: 'hjorring-clever',
    name: 'Clever Lynladestation Hjørring',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 8,
    lat: 57.4412,
    lon: 9.9852,
    address: 'Frederikshavnsvej 90',
    city: 'Hjørring'
  },

  // --- Hovedstaden / Nordsjælland ---
  {
    id: 'cph-lufthavn-clever',
    name: 'Clever Lynladestation CPH Lufthavn',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 12,
    lat: 55.6291,
    lon: 12.6481,
    address: 'Ellehammersvej 20',
    city: 'Kastrup'
  },
  {
    id: 'hillerod-clever',
    name: 'Clever Lynladestation Hillerød',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 8,
    lat: 55.9321,
    lon: 12.2852,
    address: 'Herredsvejen 2',
    city: 'Hillerød'
  },
  {
    id: 'herning-clever',
    name: 'Clever Lynladestation Herning',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 8,
    lat: 56.1412,
    lon: 8.9482,
    address: 'Silkeborgvej 110',
    city: 'Herning'
  },
  {
    id: 'silkeborg-clever',
    name: 'Clever Lynladestation Silkeborg',
    operator: 'Clever',
    operatorColor: '#0ea5e9',
    powerKw: 300,
    stalls: 8,
    lat: 56.1821,
    lon: 9.5852,
    address: 'Nordre Højmarksvej 1',
    city: 'Silkeborg'
  }
];

/**
 * Beregner afstanden mellem to koordinater i kilometer via Haversine-formlen.
 */
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Jordens radius i km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finder alle lynladestationer inden for en given radius (standard 12 km) fra ruten.
 * @param {Array<[number, number]>} routeCoords Array af [lat, lon] punkter
 * @param {number} maxDistanceKm Maksimal afstand til ruten
 * @returns {Array} Liste over stationer sorteret efter rækkefølge langs ruten
 */
export function getChargersNearRoute(routeCoords, maxDistanceKm = 12) {
  if (!routeCoords || routeCoords.length === 0) return [];

  const foundChargers = [];

  // Optimeret sampling af ruten
  const step = Math.max(1, Math.floor(routeCoords.length / 250));

  for (const charger of FAST_CHARGERS) {
    let minDistance = Infinity;
    let closestRouteIndex = -1;

    for (let i = 0; i < routeCoords.length; i += step) {
      const [rLat, rLon] = routeCoords[i];
      const dist = calculateHaversineDistanceKm(charger.lat, charger.lon, rLat, rLon);
      if (dist < minDistance) {
        minDistance = dist;
        closestRouteIndex = i;
      }
    }

    if (minDistance <= maxDistanceKm) {
      foundChargers.push({
        ...charger,
        distanceToRouteKm: Number(minDistance.toFixed(1)),
        routeProgress: closestRouteIndex / routeCoords.length
      });
    }
  }

  // Sorter efter rækkefølge langs ruten (fra start til mål)
  foundChargers.sort((a, b) => a.routeProgress - b.routeProgress);

  return foundChargers;
}
