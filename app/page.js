'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ModelSelector from '../components/ModelSelector';
import LicensePlateLookup from '../components/LicensePlateLookup';
import DrivingInputs from '../components/DrivingInputs';
import EnergyInputs from '../components/EnergyInputs';
import PriceInputs from '../components/PriceInputs';
import SmartChargingAdvisor from '../components/SmartChargingAdvisor';
import HourlyPriceChart from '../components/HourlyPriceChart';
import VerdictCard from '../components/VerdictCard';
import TcoBreakdown from '../components/TcoBreakdown';
import BreakevenModal from '../components/BreakevenModal';
import TripCostCalculator from '../components/TripCostCalculator';
import QuickNavPills from '../components/QuickNavPills';
import SectionHeader from '../components/SectionHeader';
import PetrolPriceInput from '../components/PetrolPriceInput';

import { PRESET_EV_CARS, PRESET_PETROL_CARS, DEFAULT_STANDARDS } from '../data/cars';
import {
  calculateHomeElectricityPrice,
  calculateEffectiveElectricityPrice,
  calculateAnnualRunningCosts
} from '../utils/calculator';
import { formatCurrency, formatPricePerKm } from '../utils/formatters';
import { Sparkles, ArrowRight, Zap, Fuel, Car, Navigation, BarChart3, Award } from 'lucide-react';

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

  // 3. Priser & Elpris (DK1 / DK2)
  const [petrolPrice, setPetrolPrice] = useState(DEFAULT_STANDARDS.petrolPricePerLitre);
  const [isPetrolManual, setIsPetrolManual] = useState(false);

  const [priceArea, setPriceArea] = useState('DK1');
  const [spotPriceDk1, setSpotPriceDk1] = useState(0.00);
  const [liveSpotPrice, setLiveSpotPrice] = useState(0.00);
  const [isSpotManual, setIsSpotManual] = useState(false);
  const [hourlyData, setHourlyData] = useState([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);
  const [homeSharePercent, setHomeSharePercent] = useState(DEFAULT_STANDARDS.homeChargingPercent);
  const [showHourlyChart, setShowHourlyChart] = useState(false);
  const [showBreakevenModal, setShowBreakevenModal] = useState(false);

  // Hent live elpris (DK1 el. DK2) automatisk ved indlæsning og område-skift
  useEffect(() => {
    async function fetchLiveElpris() {
      try {
        setIsLiveLoading(true);
        const res = await fetch(`/api/elpris?area=${priceArea}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.currentPrice?.spotKwh !== undefined) {
            const liveKwh = Number(data.currentPrice.spotKwh);
            setLiveSpotPrice(liveKwh);
            if (!isSpotManual) {
              setSpotPriceDk1(liveKwh);
            }
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
  }, [priceArea]);

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

  const handleSpotPriceChange = (val) => {
    setSpotPriceDk1(Number(val));
    setIsSpotManual(true);
  };

  const handleResetSpotPrice = () => {
    setSpotPriceDk1(liveSpotPrice);
    setIsSpotManual(false);
  };

  const handlePriceAreaChange = (newArea) => {
    setPriceArea(newArea);
    setIsSpotManual(false);
  };

  const handleSelectHourPrice = (selectedSpot) => {
    setSpotPriceDk1(Number(selectedSpot));
    setIsSpotManual(true);
  };

  // Når brugeren slår en bil op via nummerplade
  const handleApplyCarFromPlate = (car) => {
    if (car.type === 'ev') {
      setActiveTab('ev');
      setIsCustomEv(true);
      setCustomEv({
        id: `plate_${car.plate}`,
        name: car.name,
        type: 'ev',
        price: car.price,
        kmPerKwh: car.kmPerKwh || 5.8,
        halfYearTax: car.halfYearTax || 420,
        annualService: car.annualService || 2000,
        insuranceYear: car.insuranceYear || 7000,
        icon: car.icon || '⚡',
        badge: car.plate
      });
      setKmPerKwh(car.kmPerKwh || 5.8);
    } else {
      setActiveTab('petrol');
      setIsCustomPetrol(true);
      setCustomPetrol({
        id: `plate_${car.plate}`,
        name: car.name,
        type: 'petrol',
        price: car.price,
        kmPerLitre: car.kmPerLitre || 18.0,
        halfYearTax: car.halfYearTax || 680,
        annualService: car.annualService || 4200,
        insuranceYear: car.insuranceYear || 6500,
        icon: car.icon || '⛽',
        badge: car.plate
      });
      setKmPerLitre(car.kmPerLitre || 18.0);
    }
  };

  // Nuværende valgte biler (enten forudindstillet eller egen tilpasset bil)
  const currentEv = isCustomEv ? customEv : selectedEv;
  const currentPetrol = isCustomPetrol ? customPetrol : selectedPetrol;

  // 4. BEREGNINGER
  const homeElectricityPrice = calculateHomeElectricityPrice(
    spotPriceDk1,
    DEFAULT_STANDARDS.netTariffKwh,
    DEFAULT_STANDARDS.stateTaxKwh
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '30px' }}>
      
      {/* 1. App Header */}
      <Header dk1Price={spotPriceDk1} isLiveLoading={isLiveLoading} priceArea={priceArea} />

      {/* 2. Hurtig-hop Navigationsbar */}
      <QuickNavPills />

      {/* OVERBLIK: Hovedresultat / Verdict Hero Card */}
      <section id="section-verdict" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <VerdictCard 
          calculations={calculations}
          evName={currentEv.name}
          petrolName={currentPetrol.name}
          onOpenBreakeven={() => setShowBreakevenModal(true)}
        />
      </section>

      {/* TRIN 1: Biler & Nummerpladeopslag (Kongeblå / Indigo) */}
      <section id="section-cars" className="section-wrapper-indigo">
        <SectionHeader
          step="01"
          badge="Trin 1 · Biler"
          title="Biler & Nummerplade"
          subtitle="Vælg dine biler eller søg automatisk via nummerplade i Motorregistret"
          icon={Car}
          color="#818cf8"
        />

        <LicensePlateLookup 
          onApplyCar={handleApplyCarFromPlate} 
          activeTab={activeTab} 
        />

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
      </section>

      {/* TRIN 2: Kørsel, Rute & Forbrug (Havblå / Cyan) */}
      <section id="section-driving" className="section-wrapper-cyan">
        <SectionHeader
          step="02"
          badge="Trin 2 · Kørsel"
          title="Kørsel & Ruteberegner"
          subtitle="Årlig distance, forbrug og specifik kørsel fra A til B via OpenStreetMap"
          icon={Navigation}
          color="#22d3ee"
        />

        <DrivingInputs 
          annualKm={annualKm} 
          onChangeKm={setAnnualKm} 
        />

        <EnergyInputs
          kmPerKwh={kmPerKwh}
          onChangeKmPerKwh={setKmPerKwh}
          kmPerLitre={kmPerLitre}
          onChangeKmPerLitre={setKmPerLitre}
          evName={currentEv.name}
          petrolName={currentPetrol.name}
        />

        {/* Benzinpris vælger placeret ergonomisk i Trin 2 */}
        <PetrolPriceInput
          petrolPrice={petrolPrice}
          onChangePetrolPrice={handlePetrolPriceChange}
          defaultPetrolPrice={DEFAULT_STANDARDS.petrolPricePerLitre}
          isPetrolManual={isPetrolManual}
          onResetPetrolPrice={handleResetPetrolPrice}
        />

        <TripCostCalculator
          currentEv={currentEv}
          currentPetrol={currentPetrol}
          kmPerKwh={kmPerKwh}
          kmPerLitre={kmPerLitre}
          petrolPrice={petrolPrice}
          homeElectricityPrice={homeElectricityPrice}
        />
      </section>

      {/* TRIN 3: Elpriser & Smart Opladning (Gylden Amber / Varm Solgul) */}
      <section id="section-electricity" className="section-wrapper-amber">
        <SectionHeader
          step="03"
          badge="Trin 3 · Elpris"
          title="Elpriser & Opladning"
          subtitle="Live DK1 spotpris, forbrugerpris i stikkontakten og smart ladeanbefaling"
          icon={Zap}
          color="#fbbf24"
        />

        <PriceInputs
          spotPriceDk1={spotPriceDk1}
          homePriceKwh={homeElectricityPrice}
          effectiveKwhPrice={effectiveKwhPrice}
          homeSharePercent={homeSharePercent}
          onChangeHomeSharePercent={setHomeSharePercent}
          isLiveLoading={isLiveLoading}
          priceArea={priceArea}
          onChangePriceArea={handlePriceAreaChange}
          onSpotPriceChange={handleSpotPriceChange}
          isSpotManual={isSpotManual}
          onResetSpotPrice={handleResetSpotPrice}
          liveSpotPrice={liveSpotPrice}
        />

        <SmartChargingAdvisor
          hours={hourlyData}
          onToggleChart={() => setShowHourlyChart(prev => !prev)}
          isChartOpen={showHourlyChart}
        />

        {showHourlyChart && (
          <HourlyPriceChart 
            hours={hourlyData} 
            onSelectHourPrice={handleSelectHourPrice}
            priceArea={priceArea}
          />
        )}
      </section>

      {/* TRIN 4: Samlet TCO Regnskab (Dyb Lilla / Violet) */}
      <section id="section-tco" className="section-wrapper-purple">
        <SectionHeader
          step="04"
          badge="Trin 4 · Økonomi"
          title="Samlet TCO Regnskab"
          subtitle="Total Cost of Ownership over 5 år inkl. værditab, service og faste udgifter"
          icon={BarChart3}
          color="#c084fc"
        />

        <TcoBreakdown
          calculations={calculations}
          evName={currentEv.name}
          petrolName={currentPetrol.name}
        />
      </section>

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
