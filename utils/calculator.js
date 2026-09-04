// TCO & Økonomi Beregner for Elbil vs. Benzinbil

/**
 * Beregner den samlede forbrugerpris for 1 kWh i Danmark (Vest / DK1)
 * @param {number} spotPriceKwh - Rå spotpris i kr./kWh (f.eks. 0.75)
 * @param {number} netTariffKwh - Nettarif, systemtarif og afgifter i kr./kWh (f.eks. 1.12)
 * @param {boolean} hasRefund - Om brugeren har elafgiftsrefusion via ladeabonnement (typisk -0.95 kr)
 * @param {number} taxRefundKwh - Refusionssats pr. kWh (f.eks. 0.95)
 */
export function calculateHomeElectricityPrice(spotPriceKwh, netTariffKwh = 1.12, hasRefund = true, taxRefundKwh = 0.95) {
  // Rå pris før moms
  const basePrice = Math.max(0, spotPriceKwh) + netTariffKwh;
  // Pris inkl. 25% moms
  const priceWithVat = basePrice * 1.25;
  // Fratræk refusion hvis aktiv
  const finalPrice = hasRefund ? Math.max(0.40, priceWithVat - taxRefundKwh) : priceWithVat;
  return Number(finalPrice.toFixed(2));
}

/**
 * Beregner den gennemsnitlige effektive elpris pr. kWh baseret på ladefordeling
 */
export function calculateEffectiveElectricityPrice({
  homePriceKwh,
  publicPriceKwh = 3.85,
  homeChargingPercent = 85
}) {
  const homeRatio = Math.max(0, Math.min(100, homeChargingPercent)) / 100;
  const publicRatio = 1 - homeRatio;
  const blended = (homeRatio * homePriceKwh) + (publicRatio * publicPriceKwh);
  return Number(blended.toFixed(2));
}

/**
 * Beregner årlig kørsel, brændstof-/strømforbrug og omkostninger
 */
export function calculateAnnualRunningCosts({
  annualKm = 20000,
  
  // Elbil parametre
  evKmPerKwh = 6.0,
  effectiveElectricityPrice = 1.85,
  evHalfYearTax = 420,
  evAnnualService = 1800,
  evAnnualInsurance = 7500,
  evPrice = 330000,
  
  // Benzinbil parametre
  petrolKmPerLitre = 18.5,
  petrolPricePerLitre = 14.29,
  petrolHalfYearTax = 680,
  petrolAnnualService = 4200,
  petrolAnnualInsurance = 6800,
  petrolPrice = 330000,

  // Generelle parametre
  ownershipYears = 5
}) {
  // 1. ELBIL BEREGNINGER
  const validEvKmPerKwh = Math.max(0.1, evKmPerKwh);
  const evTotalKwhAnnual = annualKm / validEvKmPerKwh;
  const evFuelCostAnnual = evTotalKwhAnnual * effectiveElectricityPrice;
  const evTaxAnnual = evHalfYearTax * 2;
  const evFixedOperationalAnnual = evTaxAnnual + evAnnualService + evAnnualInsurance;
  
  // Årligt værditab (estimeret 11.5% årligt gennemsnit over 5 år)
  const evAnnualDepreciation = (evPrice * 0.50) / ownershipYears;
  
  const evTotalAnnual = evFuelCostAnnual + evFixedOperationalAnnual + evAnnualDepreciation;
  const evCostPerKm = annualKm > 0 ? evTotalAnnual / annualKm : 0;
  const evCostPerMonth = evTotalAnnual / 12;
  const evFuelCostPerKm = annualKm > 0 ? evFuelCostAnnual / annualKm : 0;

  // 2. BENZINBIL BEREGNINGER
  const validPetrolKmPerLitre = Math.max(0.1, petrolKmPerLitre);
  const petrolTotalLitresAnnual = annualKm / validPetrolKmPerLitre;
  const petrolFuelCostAnnual = petrolTotalLitresAnnual * petrolPricePerLitre;
  const petrolTaxAnnual = petrolHalfYearTax * 2;
  const petrolFixedOperationalAnnual = petrolTaxAnnual + petrolAnnualService + petrolAnnualInsurance;
  
  // Årligt værditab (estimeret 12.5% årligt gennemsnit for fossilbiler)
  const petrolAnnualDepreciation = (petrolPrice * 0.55) / ownershipYears;
  
  const petrolTotalAnnual = petrolFuelCostAnnual + petrolFixedOperationalAnnual + petrolAnnualDepreciation;
  const petrolCostPerKm = annualKm > 0 ? petrolTotalAnnual / annualKm : 0;
  const petrolCostPerMonth = petrolTotalAnnual / 12;
  const petrolFuelCostPerKm = annualKm > 0 ? petrolFuelCostAnnual / annualKm : 0;

  // 3. FORSKEL & BESPARELSE
  const annualSavingsTotal = petrolTotalAnnual - evTotalAnnual;
  const annualFuelSavings = petrolFuelCostAnnual - evFuelCostAnnual;
  const monthlySavingsTotal = annualSavingsTotal / 12;
  const savingsPerKm = petrolCostPerKm - evCostPerKm;

  // Breakeven beregning
  const initialPriceDiff = evPrice - petrolPrice; // positiv hvis elbil koster mere i indkøb
  let breakevenYears = null;
  let breakevenKm = null;

  if (initialPriceDiff > 0) {
    if (annualSavingsTotal > 0) {
      breakevenYears = Number((initialPriceDiff / annualSavingsTotal).toFixed(1));
      breakevenKm = Math.round(breakevenYears * annualKm);
    } else {
      breakevenYears = Infinity;
    }
  } else {
    // Elbilen var billigere eller lig i indkøb og billigere i drift = 0 års breakeven
    breakevenYears = 0;
    breakevenKm = 0;
  }

  return {
    ev: {
      annualKwh: Math.round(evTotalKwhAnnual),
      fuelCostAnnual: Math.round(evFuelCostAnnual),
      fuelCostMonthly: Math.round(evFuelCostAnnual / 12),
      fuelCostPerKm: Number(evFuelCostPerKm.toFixed(2)),
      taxAnnual: Math.round(evTaxAnnual),
      serviceAnnual: Math.round(evAnnualService),
      insuranceAnnual: Math.round(evAnnualInsurance),
      depreciationAnnual: Math.round(evAnnualDepreciation),
      totalAnnual: Math.round(evTotalAnnual),
      totalMonthly: Math.round(evCostPerMonth),
      costPerKm: Number(evCostPerKm.toFixed(2))
    },
    petrol: {
      annualLitres: Math.round(petrolTotalLitresAnnual),
      fuelCostAnnual: Math.round(petrolFuelCostAnnual),
      fuelCostMonthly: Math.round(petrolFuelCostAnnual / 12),
      fuelCostPerKm: Number(petrolFuelCostPerKm.toFixed(2)),
      taxAnnual: Math.round(petrolTaxAnnual),
      serviceAnnual: Math.round(petrolAnnualService),
      insuranceAnnual: Math.round(petrolAnnualInsurance),
      depreciationAnnual: Math.round(petrolAnnualDepreciation),
      totalAnnual: Math.round(petrolTotalAnnual),
      totalMonthly: Math.round(petrolCostPerMonth),
      costPerKm: Number(petrolCostPerKm.toFixed(2))
    },
    savings: {
      annualTotal: Math.round(annualSavingsTotal),
      annualFuel: Math.round(annualFuelSavings),
      monthlyTotal: Math.round(monthlySavingsTotal),
      perKm: Number(savingsPerKm.toFixed(2)),
      breakevenYears,
      breakevenKm,
      initialPriceDiff: Math.round(initialPriceDiff)
    }
  };
}
