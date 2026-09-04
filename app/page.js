'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ModelSelector from '../components/ModelSelector';
import DrivingInputs from '../components/DrivingInputs';
import EnergyInputs from '../components/EnergyInputs';
import PriceInputs from '../components/PriceInputs';
import HourlyPriceChart from '../components/HourlyPriceChart';
import VerdictCard from '../components/VerdictCard';
import TcoBreakdown from '../components/TcoBreakdown';
import BreakevenModal from '../components/BreakevenModal';

import { PRESET_EV_CARS, PRESET_PETROL_CARS, DEFAULT_STANDARDS } from '../data/cars';
import {
  calculateHomeElectricityPrice,
  calculateEffectiveElectricityPrice,
  calculateAnnualRunningCosts
} from '../utils/calculator';
import { formatCurrency, formatPricePerKm } from '../utils/formatters';
import { Sparkles, ArrowRight, Zap, Fuel } from 'lucide-react';

export default function Home() {
  // 1. Bilvalg
  const [selectedEv, setSelectedEv] = useState(PRESET_EV_CARS[0]); // Tesla Model Y
  const [selectedPetrol, setSelectedPetrol] = useState(PRESET_PETROL_CARS[0]); // VW Golf
  const [activeTab, setActiveTab] = useState('ev'); // 'ev' eller 'petrol'
  const [isCustomEv, setIsCustomEv] = useState(false);
  const [isCustomPetrol, setIsCustomPetrol] = useState(false);

  // Egen elbil konfiguration
  const [customEv, setCustomEv] = useState({
    id: 'custom_ev',
    name: 'Min egen elbil',
    type: 'ev',
    price: 320000,
    kmPerKwh: 5.8,
    halfYearTax: 420,
    annualService: 1800,
    insuranceYear: 7000,
    icon: '⚡',
    badge: 'Egen elbil'
  });

  // Egen benzinbil konfiguration
  const [customPetrol, setCustomPetrol] = useState({
    id: 'custom_petrol',
    name: 'Min egen benzinbil',
    type: 'petrol',
    price: 280000,
    kmPerLitre: 16.5,
    halfYearTax: 780,
    annualService: 4500,
    insuranceYear: 6500,
    icon: '⛽',
    badge: 'Egen benzinbil'
  });

  // 2. Kørsel & Forbrug (brugeren kan taste frit)
  const [annualKm, setAnnualKm] = useState(DEFAULT_STANDARDS.annualKm);
  const [kmPerKwh, setKmPerKwh] = useState(PRESET_EV_CARS[0].kmPerKwh);
  const [kmPerLitre, setKmPerLitre] = useState(PRESET_PETROL_CARS[0].kmPerLitre);

  // 3. Priser & Elpris Vest (DK1)
  const [petrolPrice, setPetrolPrice] = useState(DEFAULT_STANDARDS.petrolPricePerLitre);
  const [isPetrolManual, setIsPetrolManual] = useState(false);

  const [spotPriceDk1, setSpotPriceDk1] = useState(DEFAULT_STANDARDS.defaultSpotPriceDk1Kwh);
  const [hourlyData, setHourlyData] = useState([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);
  const [hasRefund, setHasRefund] = useState(true); // Standard: ja, ladeabonnement med refusion
  const [homeSharePercent, setHomeSharePercent] = useState(DEFAULT_STANDARDS.homeChargingPercent);
  const [showHourlyChart, setShowHourlyChart] = useState(false);
  const [showBreakevenModal, setShowBreakevenModal] = useState(false);

  // Hent live DK1 elpris automatisk ved indlæsning
  useEffect(() => {
    async function fetchLiveElpris() {
      try {
        setIsLiveLoading(true);
        const res = await fetch('/api/elpris');
        if (res.ok) {
          const data = await res.json();
          if (data.currentPrice?.spotKwh !== undefined) {
            setSpotPriceDk1(data.currentPrice.spotKwh);
          }
          if (data.hours) {
            setHourlyData(data.hours);
          }
        }
      } catch (err) {
        console.warn('Kunne ikke hente live elpris, anvender standard:', err);
      } finally {
        setIsLiveLoading(false);
      }
    }
    fetchLiveElpris();
  }, []);

  // Når der vælges en ny forudindstillet elbil
  const handleSelectEv = (car) => {
    setSelectedEv(car);
    setIsCustomEv(false);
    setKmPerKwh(car.kmPerKwh);
  };

  // Når der vælges en ny forudindstillet benzinbil
  const handleSelectPetrol = (car) => {
    setSelectedPetrol(car);
    setIsCustomPetrol(false);
    setKmPerLitre(car.kmPerLitre);
  };

  const handleToggleCustomEv = () => {
    setIsCustomEv(prev => {
      const next = !prev;
      if (next) {
        setKmPerKwh(customEv.kmPerKwh);
      } else {
        setKmPerKwh(selectedEv.kmPerKwh);
      }
      return next;
    });
  };

  const handleToggleCustomPetrol = () => {
    setIsCustomPetrol(prev => {
      const next = !prev;
      if (next) {
        setKmPerLitre(customPetrol.kmPerLitre);
      } else {
        setKmPerLitre(selectedPetrol.kmPerLitre);
      }
      return next;
    });
  };

  const handleUpdateCustomEv = (updated) => {
    setCustomEv(updated);
    if (updated.kmPerKwh !== undefined && updated.kmPerKwh !== kmPerKwh) {
      setKmPerKwh(updated.kmPerKwh);
    }
  };

  const handleUpdateCustomPetrol = (updated) => {
    setCustomPetrol(updated);
    if (updated.kmPerLitre !== undefined && updated.kmPerLitre !== kmPerLitre) {
      setKmPerLitre(updated.kmPerLitre);
    }
  };

  const handlePetrolPriceChange = (val) => {
    setPetrolPrice(val);
    setIsPetrolManual(true);
  };

  const handleResetPetrolPrice = () => {
    setPetrolPrice(DEFAULT_STANDARDS.petrolPricePerLitre);
    setIsPetrolManual(false);
  };

  // Nuværende valgte biler (enten forudindstillet eller egen tilpasset bil)
  const currentEv = isCustomEv ? customEv : selectedEv;
  const currentPetrol = isCustomPetrol ? customPetrol : selectedPetrol;

  // 4. BEREGNINGER
  const homeElectricityPrice = calculateHomeElectricityPrice(
    spotPriceDk1,
    DEFAULT_STANDARDS.netTariffKwh,
    hasRefund,
    DEFAULT_STANDARDS.taxRefundKwh
  );

  const effectiveKwhPrice = calculateEffectiveElectricityPrice({
    homePriceKwh: homeElectricityPrice,
    publicPriceKwh: DEFAULT_STANDARDS.publicChargingPriceKwh,
    homeChargingPercent: homeSharePercent
  });

  const calculations = calculateAnnualRunningCosts({
    annualKm,
    evKmPerKwh: kmPerKwh,
    effectiveElectricityPrice: effectiveKwhPrice,
    evHalfYearTax: currentEv.halfYearTax,
    evAnnualService: currentEv.annualService,
    evAnnualInsurance: currentEv.insuranceYear,
    evPrice: currentEv.price,

    petrolKmPerLitre: kmPerLitre,
    petrolPricePerLitre: petrolPrice,
    petrolHalfYearTax: currentPetrol.halfYearTax,
    petrolAnnualService: currentPetrol.annualService,
    petrolAnnualInsurance: currentPetrol.insuranceYear,
    petrolPrice: currentPetrol.price,

    ownershipYears: DEFAULT_STANDARDS.ownershipYears
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '30px' }}>
      
      {/* 1. App Header */}
      <Header dk1Price={spotPriceDk1} isLiveLoading={isLiveLoading} />

      {/* 2. Hovedresultat / Verdict Hero Card */}
      <VerdictCard 
        calculations={calculations}
        evName={currentEv.name}
        petrolName={currentPetrol.name}
        onOpenBreakeven={() => setShowBreakevenModal(true)}
      />

      {/* 3. Bilvælger (Populære modeller + tilpasning) */}
      <ModelSelector
        selectedEv={selectedEv}
        onSelectEv={handleSelectEv}
        selectedPetrol={selectedPetrol}
        onSelectPetrol={handleSelectPetrol}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCustomEv={isCustomEv}
        onToggleCustomEv={handleToggleCustomEv}
        isCustomPetrol={isCustomPetrol}
        onToggleCustomPetrol={handleToggleCustomPetrol}
        customEv={customEv}
        onUpdateCustomEv={handleUpdateCustomEv}
        customPetrol={customPetrol}
        onUpdateCustomPetrol={handleUpdateCustomPetrol}
      />

      {/* 4. Årlig Kørsel (km) */}
      <DrivingInputs 
        annualKm={annualKm} 
        onChangeKm={setAnnualKm} 
      />

      {/* 5. Forbrug: km/kWh og km/l */}
      <EnergyInputs
        kmPerKwh={kmPerKwh}
        onChangeKmPerKwh={setKmPerKwh}
        kmPerLitre={kmPerLitre}
        onChangeKmPerLitre={setKmPerLitre}
        evName={currentEv.name}
        petrolName={currentPetrol.name}
      />

      {/* 6. Priser: Benzin & Live DK1 Elpris med refusion */}
      <PriceInputs
        petrolPrice={petrolPrice}
        onChangePetrolPrice={handlePetrolPriceChange}
        defaultPetrolPrice={DEFAULT_STANDARDS.petrolPricePerLitre}
        isPetrolManual={isPetrolManual}
        onResetPetrolPrice={handleResetPetrolPrice}
        spotPriceDk1={spotPriceDk1}
        homePriceKwh={homeElectricityPrice}
        effectiveKwhPrice={effectiveKwhPrice}
        hasRefund={hasRefund}
        onToggleRefund={() => setHasRefund(!hasRefund)}
        homeSharePercent={homeSharePercent}
        onChangeHomeSharePercent={setHomeSharePercent}
        showHourlyChart={showHourlyChart}
        onToggleHourlyChart={() => setShowHourlyChart(!showHourlyChart)}
        isLiveLoading={isLiveLoading}
      />

      {/* 7. 24-timers elpris graf (fold-ud) */}
      {showHourlyChart && (
        <HourlyPriceChart hours={hourlyData} />
      )}

      {/* 8. Komplet TCO Breakdown (Samlet oversigt) */}
      <TcoBreakdown
        calculations={calculations}
        evName={currentEv.name}
        petrolName={currentPetrol.name}
      />

      {/* 9. Breakeven Modal */}
      <BreakevenModal
        isOpen={showBreakevenModal}
        onClose={() => setShowBreakevenModal(false)}
        calculations={calculations}
        evName={currentEv.name}
        petrolName={currentPetrol.name}
      />

      {/* 10. Sticky Bottom Verdict Bar for hurtig mobil-overblik */}
      <div className="sticky-verdict-bar">
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Årlig Besparelse
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#34d399' }}>
            {formatCurrency(calculations.savings.annualTotal)}
          </div>
        </div>

        <button
          onClick={() => setShowBreakevenModal(true)}
          style={{
            background: 'var(--ev-gradient)',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 16px',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px var(--ev-glow)'
          }}
        >
          <span>Se Breakeven</span>
          <ArrowRight size={15} />
        </button>
      </div>

    </div>
  );
}
