import { NextResponse } from 'next/server';

export const revalidate = 600; // Cache i 10 minutter på serveren for altid friske priser

// Realistisk backup døgnkurve for DK1 (Vestdanmark) med aktuel markedspris (~0,30-0,60 kr. spot)
const FALLBACK_DK1_HOURS = [
  { hour: '00:00', spot: 0.38 }, { hour: '01:00', spot: 0.36 },
  { hour: '02:00', spot: 0.39 }, { hour: '03:00', spot: 0.40 },
  { hour: '04:00', spot: 0.36 }, { hour: '05:00', spot: 0.34 },
  { hour: '06:00', spot: 0.42 }, { hour: '07:00', spot: 0.45 },
  { hour: '08:00', spot: 0.23 }, { hour: '09:00', spot: 0.15 },
  { hour: '10:00', spot: 0.10 }, { hour: '11:00', spot: 0.08 },
  { hour: '12:00', spot: 0.05 }, { hour: '13:00', spot: 0.08 },
  { hour: '14:00', spot: 0.12 }, { hour: '15:00', spot: 0.22 },
  { hour: '16:00', spot: 0.35 }, { hour: '17:00', spot: 0.52 },
  { hour: '18:00', spot: 0.65 }, { hour: '19:00', spot: 0.58 },
  { hour: '20:00', spot: 0.58 }, { hour: '21:00', spot: 0.56 },
  { hour: '22:00', spot: 0.48 }, { hour: '23:00', spot: 0.42 }
];

export async function GET() {
  const currentHourNum = new Date().getHours();
  
  try {
    // Energi Data Service: DayAheadPrices (det aktive officielle datasæt i Danmark efter lukning af Elspotprices)
    // Sorteret faldende på TimeDK for at få de nyeste dags- og timedata for DK1 (Vestdanmark)
    const url = 'https://api.energidataservice.dk/dataset/DayAheadPrices?filter=%7B%22PriceArea%22%3A%22DK1%22%7D&sort=TimeDK%20desc&limit=140';
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 600 }
    });

    if (response.ok) {
      const json = await response.json();
      const records = json.records || [];

      if (records.length > 0) {
        // Gruppér de 15-minutters intervaller til hele timer (f.eks. '2026-09-05T08')
        const hourMap = new Map();
        for (const r of records) {
          const key = r.TimeDK.slice(0, 13);
          const d = new Date(r.TimeDK);
          const spotKwh = Number(r.DayAheadPriceDKK) / 1000;

          if (!hourMap.has(key)) {
            hourMap.set(key, {
              dateKey: key,
              hourNumber: d.getHours(),
              hourLabel: `${String(d.getHours()).padStart(2, '0')}:00`,
              spotSum: 0,
              count: 0
            });
          }
          const item = hourMap.get(key);
          item.spotSum += spotKwh;
          item.count += 1;
        }

        // Konverter til kronologisk sorteret array over de seneste 24 timer
        const sortedHours = Array.from(hourMap.values())
          .map(h => {
            const avgSpot = Number((h.spotSum / h.count).toFixed(3));
            // Forbrugerpris: Rå spotpris + 0.50 kr. nettarif + 0.01 kr. elafgift (1 øre EU-minimum) + 25% moms
            const consumerPriceHome = Number(((avgSpot + 0.50 + 0.01) * 1.25).toFixed(2));
            return {
              dateKey: h.dateKey,
              hour: h.hourLabel,
              hourNumber: h.hourNumber,
              spotPriceKwh: avgSpot,
              consumerPriceHome
            };
          })
          .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
          .slice(-24);

        if (sortedHours.length > 0) {
          // Find minimumsprisen
          const minPrice = Math.min(...sortedHours.map(h => h.consumerPriceHome));

          const hours = sortedHours.map(h => ({
            ...h,
            isCurrent: h.hourNumber === currentHourNum,
            isLowest: h.consumerPriceHome <= minPrice + 0.08
          }));

          const currentRecord = hours.find(h => h.isCurrent) || hours[hours.length - 1];
          const avgSpot = Number((hours.reduce((acc, h) => acc + h.spotPriceKwh, 0) / hours.length).toFixed(3));
          const avgConsumerHome = Number((hours.reduce((acc, h) => acc + h.consumerPriceHome, 0) / hours.length).toFixed(2));

          return NextResponse.json({
            success: true,
            priceArea: 'DK1 (Vestdanmark)',
            source: 'Energi Data Service (DayAheadPrices Live)',
            updatedAt: new Date().toISOString(),
            currentPrice: {
              spotKwh: currentRecord.spotPriceKwh,
              consumerHomeKwh: currentRecord.consumerPriceHome,
              hour: currentRecord.hour
            },
            averages: {
              avgSpotKwh: avgSpot,
              avgConsumerHomeKwh: avgConsumerHome
            },
            hours
          });
        }
      }
    }
  } catch (error) {
    console.warn('Elpris API DayAheadPrices fetch failed, using calibrated fallback:', error.message);
  }

  // Fallback data
  const hours = FALLBACK_DK1_HOURS.map(h => {
    const spotKwh = h.spot;
    const consumerPriceHome = Number(((spotKwh + 0.50 + 0.01) * 1.25).toFixed(2));
    const hourNum = parseInt(h.hour.split(':')[0], 10);
    return {
      hour: h.hour,
      hourNumber: hourNum,
      spotPriceKwh: spotKwh,
      consumerPriceHome,
      isCurrent: hourNum === currentHourNum,
      isLowest: spotKwh <= 0.15
    };
  });

  const currentRecord = hours.find(h => h.isCurrent) || hours[currentHourNum] || hours[0];
  const avgSpot = 0.32;
  const avgConsumerHome = 1.03;

  return NextResponse.json({
    success: true,
    priceArea: 'DK1 (Vestdanmark)',
    source: 'Energi Data Service (Estimeret backup)',
    updatedAt: new Date().toISOString(),
    currentPrice: {
      spotKwh: currentRecord.spotPriceKwh,
      consumerHomeKwh: currentRecord.consumerPriceHome,
      hour: currentRecord.hour
    },
    averages: {
      avgSpotKwh: avgSpot,
      avgConsumerHomeKwh: avgConsumerHome
    },
    hours
  });
}
