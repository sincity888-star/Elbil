// Database over populære forudindstillede modeller i Danmark
export const PRESET_EV_CARS = [
  {
    id: 'tesla_model_y',
    name: 'Tesla Model Y RWD',
    subtitle: 'Danmarks mest solgte elbil',
    type: 'ev',
    price: 329990,
    kmPerKwh: 6.0, // ca. 16.7 kWh / 100 km
    kwhPer100Km: 16.7,
    batterySize: 60, // kWh
    halfYearTax: 420, // Grøn ejerafgift pr. halvår
    annualService: 1800,
    insuranceYear: 7500,
    icon: '⚡',
    badge: 'Mest Populær'
  },
  {
    id: 'vw_id4',
    name: 'VW ID.4 Pro',
    subtitle: 'Familie-SUV med god plads',
    type: 'ev',
    price: 349995,
    kmPerKwh: 5.5, // ca. 18.2 kWh / 100 km
    kwhPer100Km: 18.2,
    batterySize: 77,
    halfYearTax: 420,
    annualService: 2200,
    insuranceYear: 7200,
    icon: '🚙',
    badge: 'Familiefavorit'
  },
  {
    id: 'skoda_enyaq',
    name: 'Skoda Enyaq iV 80',
    subtitle: 'Rummelig og komfortabel cruiser',
    type: 'ev',
    price: 369995,
    kmPerKwh: 5.4,
    kwhPer100Km: 18.5,
    batterySize: 77,
    halfYearTax: 420,
    annualService: 2400,
    insuranceYear: 7400,
    icon: '✨',
    badge: 'Premium Komfort'
  },
  {
    id: 'mg4_electric',
    name: 'MG4 Electric',
    subtitle: 'Kompakt og prisstærk by- og pendlerbil',
    type: 'ev',
    price: 199995,
    kmPerKwh: 6.2,
    kwhPer100Km: 16.1,
    batterySize: 51,
    halfYearTax: 420,
    annualService: 1600,
    insuranceYear: 5800,
    icon: '⚡',
    badge: 'Bedst til Prisen'
  },
  {
    id: 'tesla_model_3',
    name: 'Tesla Model 3 RWD',
    subtitle: 'Aerodynamisk og lynhurtig pendlerbil',
    type: 'ev',
    price: 311990,
    kmPerKwh: 6.4,
    kwhPer100Km: 15.6,
    batterySize: 60,
    halfYearTax: 420,
    annualService: 1800,
    insuranceYear: 7500,
    icon: '⚡',
    badge: 'Lang Rækkevidde'
  },
  {
    id: 'volvo_ex30',
    name: 'Volvo EX30 Core',
    subtitle: 'Svensk premium i kompakt SUV-format',
    type: 'ev',
    price: 274000,
    kmPerKwh: 5.8,
    kwhPer100Km: 17.2,
    batterySize: 51,
    halfYearTax: 420,
    annualService: 2100,
    insuranceYear: 6800,
    icon: '🚙',
    badge: 'Kompakt Premium'
  },
  {
    id: 'kia_ev6',
    name: 'Kia EV6 RWD',
    subtitle: '800V lynhurtig ladning & sporty design',
    type: 'ev',
    price: 324995,
    kmPerKwh: 5.7,
    kwhPer100Km: 17.5,
    batterySize: 58,
    halfYearTax: 420,
    annualService: 2200,
    insuranceYear: 7000,
    icon: '⚡',
    badge: 'Lynhurtig 800V'
  },
  {
    id: 'hyundai_ioniq_5',
    name: 'Hyundai Ioniq 5',
    subtitle: 'Futuristisk design og enorm kabineplads',
    type: 'ev',
    price: 329995,
    kmPerKwh: 5.5,
    kwhPer100Km: 18.2,
    batterySize: 58,
    halfYearTax: 420,
    annualService: 2200,
    insuranceYear: 7000,
    icon: '✨',
    badge: 'Futuristisk'
  },
  {
    id: 'polestar_2',
    name: 'Polestar 2 Standard',
    subtitle: 'Skandinavisk minimalistisk sports-fastback',
    type: 'ev',
    price: 340000,
    kmPerKwh: 5.6,
    kwhPer100Km: 17.8,
    batterySize: 69,
    halfYearTax: 420,
    annualService: 2400,
    insuranceYear: 7800,
    icon: '🚀',
    badge: 'Skandinavisk Sport'
  },
  {
    id: 'cupra_born',
    name: 'Cupra Born 58',
    subtitle: 'Sporty elektrisk hatchback',
    type: 'ev',
    price: 249990,
    kmPerKwh: 6.1,
    kwhPer100Km: 16.4,
    batterySize: 58,
    halfYearTax: 420,
    annualService: 1900,
    insuranceYear: 6600,
    icon: '🏎️',
    badge: 'Sporty Hatch'
  },
  {
    id: 'bmw_i4',
    name: 'BMW i4 eDrive35',
    subtitle: 'Tysk køreglæde i elektrisk Gran Coupé',
    type: 'ev',
    price: 389500,
    kmPerKwh: 5.8,
    kwhPer100Km: 17.2,
    batterySize: 70,
    halfYearTax: 420,
    annualService: 2800,
    insuranceYear: 8500,
    icon: '👑',
    badge: 'Ren Køreglæde'
  },
  {
    id: 'audi_q4',
    name: 'Audi Q4 45 e-tron',
    subtitle: 'Luksus familie-SUV med høj komfort',
    type: 'ev',
    price: 419990,
    kmPerKwh: 5.4,
    kwhPer100Km: 18.5,
    batterySize: 82,
    halfYearTax: 420,
    annualService: 2900,
    insuranceYear: 8800,
    icon: '💎',
    badge: 'Luksus SUV'
  },
  {
    id: 'renault_megane',
    name: 'Renault Megane E-Tech',
    subtitle: 'Smart fransk crossover med Google OS',
    type: 'ev',
    price: 279990,
    kmPerKwh: 5.9,
    kwhPer100Km: 16.9,
    batterySize: 60,
    halfYearTax: 420,
    annualService: 2000,
    insuranceYear: 6500,
    icon: '🚗',
    badge: 'Designfavorit'
  }
];

export const PRESET_PETROL_CARS = [
  {
    id: 'vw_golf',
    name: 'VW Golf 1.5 TSI',
    subtitle: 'Klassikeren i hatchback-klassen',
    type: 'petrol',
    price: 339995,
    kmPerLitre: 18.5,
    litrePer100Km: 5.4,
    tankSize: 50,
    halfYearTax: 680,
    annualService: 4200,
    insuranceYear: 6800,
    icon: '⛽',
    badge: 'Klassiker'
  },
  {
    id: 'peugeot_208',
    name: 'Peugeot 208 PureTech',
    subtitle: 'Økonomisk og agil by-pendler',
    type: 'petrol',
    price: 189990,
    kmPerLitre: 19.8,
    litrePer100Km: 5.1,
    tankSize: 44,
    halfYearTax: 640,
    annualService: 3400,
    insuranceYear: 5200,
    icon: '🚘',
    badge: 'Pendlerbil'
  },
  {
    id: 'toyota_yaris',
    name: 'Toyota Yaris 1.5 Hybrid',
    subtitle: 'Superøkonomisk by- og pendlerbil',
    type: 'petrol',
    price: 219990,
    kmPerLitre: 26.3,
    litrePer100Km: 3.8,
    tankSize: 36,
    halfYearTax: 540,
    annualService: 3500,
    insuranceYear: 5400,
    icon: '🔋',
    badge: 'Super Økonomi'
  },
  {
    id: 'toyota_corolla',
    name: 'Toyota Corolla 1.8 Hybrid',
    subtitle: 'Ekstremt driftssikker hybrid',
    type: 'petrol',
    price: 324990,
    kmPerLitre: 22.2,
    litrePer100Km: 4.5,
    tankSize: 43,
    halfYearTax: 540,
    annualService: 3800,
    insuranceYear: 6200,
    icon: '🔋',
    badge: 'Hybrid Øko'
  },
  {
    id: 'vw_polo',
    name: 'VW Polo 1.0 TSI',
    subtitle: 'Kompakt kvalitet og god gensalgsværdi',
    type: 'petrol',
    price: 249995,
    kmPerLitre: 19.2,
    litrePer100Km: 5.2,
    tankSize: 40,
    halfYearTax: 640,
    annualService: 3900,
    insuranceYear: 5900,
    icon: '🚗',
    badge: 'By-klassiker'
  },
  {
    id: 'skoda_octavia',
    name: 'Skoda Octavia 1.5 TSI',
    subtitle: 'Danmarks måske mest rummelige stationcar',
    type: 'petrol',
    price: 349995,
    kmPerLitre: 18.2,
    litrePer100Km: 5.5,
    tankSize: 45,
    halfYearTax: 680,
    annualService: 4400,
    insuranceYear: 6900,
    icon: '🚙',
    badge: 'Kæmpe Bagagerum'
  },
  {
    id: 'ford_focus',
    name: 'Ford Focus 1.0 EcoBoost',
    subtitle: 'Klassens bedste køreegenskaber',
    type: 'petrol',
    price: 299990,
    kmPerLitre: 18.5,
    litrePer100Km: 5.4,
    tankSize: 52,
    halfYearTax: 680,
    annualService: 4300,
    insuranceYear: 6700,
    icon: '🚘',
    badge: 'Køreglæde'
  },
  {
    id: 'nissan_qashqai',
    name: 'Nissan Qashqai 1.3',
    subtitle: 'Høj indstigning og god familieplads',
    type: 'petrol',
    price: 349990,
    kmPerLitre: 15.6,
    litrePer100Km: 6.4,
    tankSize: 55,
    halfYearTax: 1040,
    annualService: 4600,
    insuranceYear: 7200,
    icon: '🚙',
    badge: 'Familie-SUV'
  },
  {
    id: 'ford_kuga',
    name: 'Ford Kuga 1.5 EcoBoost',
    subtitle: 'Stor og kraftfuld familie-crossover',
    type: 'petrol',
    price: 359900,
    kmPerLitre: 14.9,
    litrePer100Km: 6.7,
    tankSize: 54,
    halfYearTax: 1150,
    annualService: 4800,
    insuranceYear: 7500,
    icon: '🔥',
    badge: 'Rummelig SUV'
  },
  {
    id: 'suzuki_swift',
    name: 'Suzuki Swift 1.2 Dualjet',
    subtitle: 'Letvægt, lav afgift og pålidelig',
    type: 'petrol',
    price: 184990,
    kmPerLitre: 22.7,
    litrePer100Km: 4.4,
    tankSize: 37,
    halfYearTax: 540,
    annualService: 3200,
    insuranceYear: 4900,
    icon: '🚗',
    badge: 'Lav Vægtafgift'
  },
  {
    id: 'bmw_320i',
    name: 'BMW 320i Sedan',
    subtitle: 'Klassisk tysk premium sportssedan',
    type: 'petrol',
    price: 499000,
    kmPerLitre: 15.4,
    litrePer100Km: 6.5,
    tankSize: 59,
    halfYearTax: 1040,
    annualService: 5800,
    insuranceYear: 8900,
    icon: '👑',
    badge: 'Premium Sedan'
  }
];

export const DEFAULT_STANDARDS = {
  annualKm: 20000,
  petrolPricePerLitre: 14.29, // DKK/L (gennemsnitlig dansk 95 oktan)
  
  // Dansk Elpris Defaults:
  // Spotpris DK1 (Vestdanmark) baseret på typisk gennemsnit
  defaultSpotPriceDk1Kwh: 0.75, // kr. rå spotpris
  netTariffKwh: 1.12,          // Transport, systemtarif, nettarif & grønne bidrag
  momsRate: 0.25,               // 25% moms
  
  // El-refusion for hjemmeladning i Danmark (typisk ~0.94 - 1.10 kr./kWh gennem ladeoperatør som Clever/Monta/OK)
  taxRefundKwh: 0.95,
  
  // Forventet andel af hjemmeladning vs. offentlig lynlader
  homeChargingPercent: 85,
  publicChargingPriceKwh: 3.85, // kr./kWh på lynladere (Ionity, Clever, Tesla supercharger)
  
  // Ejerperiode i år for TCO & afskrivning
  ownershipYears: 5
};
