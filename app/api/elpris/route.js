import { NextResponse } from 'next/server';

export const revalidate = 1800; // Cache i 30 minutter på serveren for at beskytte mod rate limits

// Realistisk backup døgnkurve for DK1 (Vestdanmark) hvis API'en er nede eller rammer 429
const FALLBACK_DK1_HOURS = [
  { hour: '00:00', spot: 0.42 }, { hour: '01:00', spot: 0.38 },
  { hour: '02:00', spot: 0.32 }, { hour: '03:00', spot: 0.28 },
  { hour: '04:00', spot: 0.34 }, { hour: '05:00', spot: 0.48 },
  { hour: '06:00', spot: 0.72 }, { hour: '07:00', spot: 0.95 },
  { hour: '08:00', spot: 1.12 }, { hour: '09:00', spot: 0.88 },
  { hour: '10:00', spot: 0.65 }, { hour: '11:00', spot: 0.54 },
  { hour: '12:00', spot: 0.48 }, { hour: '13:00', spot: 0.52 },
  { hour: '14:00', spot: 0.62 }, { hour: '15:00', spot: 0.78 },
  { hour: '16:00', spot: 0.94 }, { hour: '17:00', spot: 1.28 },
  { hour: '18:00', spot: 1.45 }, { hour: '19:00', spot: 1.32 },
  { hour: '20:00', spot: 0.98 }, { hour: '21:00', spot: 0.76 },
  { hour: '22:00', spot: 0.58 }, { hour: '23:00', spot: 0.46 }
];

export async function GET() {
  const currentHourNum = new Date().getHours();
  
  try {
    // Energi Data Service API for DK1 (Danmark Vest)
    // Sorteret faldende for at få seneste og kommende timer
    const url = 'https://api.energidataservice.dk/dataset/Elspotprices?filter=%7B%22PriceArea%22%3A%22DK1%22%7D&sort=HourDK%20desc&limit=36';
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 1800 }
    });

    if (response.ok) {
      const json = await response.json();
      const records = json.records || [];

      if (records.length > 0) {
        // Tag de 24 mest relevante timer i kronologisk rækkefølge
        const sortedRecords = [...records].reverse().slice(-24);

        // Find laveste rå spotpris
        const spotValues = sortedRecords.map(r => Number((r.SpotPriceDKK / 1000).toFixed(3)));
        const minSpot = Math.min(...spotValues);

        const hours = sortedRecords.map(r => {
          const date = new Date(r.HourDK);
          const hourLabel = date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
          const hourNum = date.getHours();
          const spotKwh = Number((r.SpotPriceDKK / 1000).toFixed(3));
          
          // Beregn forbrugerpris inkl. netselskabstarif (~0.50 kr.), statens elafgift på 1 øre (0.01 kr.) og moms (25%)
          const consumerPriceHome = Number(((spotKwh + 0.51) * 1.25).toFixed(2));

          return {
            hour: hourLabel,
            hourNumber: hourNum,
            spotPriceKwh: spotKwh,
            consumerPriceHome,
            isCurrent: hourNum === currentHourNum,
            isLowest: spotKwh <= minSpot + 0.05
          };
        });

        const currentRecord = hours.find(h => h.isCurrent) || hours[0];
        const avgSpot = Number((hours.reduce((acc, h) => acc + h.spotPriceKwh, 0) / hours.length).toFixed(3));
        const avgConsumerHome = Number((hours.reduce((acc, h) => acc + h.consumerPriceHome, 0) / hours.length).toFixed(2));

        return NextResponse.json({
          success: true,
          priceArea: 'DK1 (Vestdanmark)',
          source: 'Energi Data Service (Live)',
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
  } catch (error) {
    console.warn('Elpris API live fetch failed, using calibrated fallback:', error.message);
  }

  // Fallback data
  const hours = FALLBACK_DK1_HOURS.map((h, i) => {
    const spotKwh = h.spot;
    const consumerPriceHome = Number(((spotKwh + 0.51) * 1.25).toFixed(2));
    return {
      hour: h.hour,
      hourNumber: i,
      spotPriceKwh: spotKwh,
      consumerPriceHome,
      isCurrent: i === currentHourNum,
      isLowest: spotKwh <= 0.35
    };
  });

  const currentRecord = hours.find(h => h.isCurrent) || hours[12];
  const avgSpot = 0.72;
  const avgConsumerHome = 1.35;

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
