import React, { useState } from 'react';
import { StationData, IndoorSanctuaryData } from '../types';
import { HOURLY_AIR_TRAJECTORY } from '../data/mockData';

interface HomeGlanceProps {
  currentStation: StationData;
  indoorData: IndoorSanctuaryData;
  allStations: StationData[];
  onSelectStation: (st: StationData) => void;
  onOpenPurifierHub: () => void;
  onNavigateToCommute: () => void;
}

export const HomeGlance: React.FC<HomeGlanceProps> = ({
  currentStation,
  indoorData,
  allStations,
  onSelectStation,
  onOpenPurifierHub,
  onNavigateToCommute,
}) => {
  const [selectedAdvisory, setSelectedAdvisory] = useState<string | null>(null);

  // Calculate dynamic indoor vs outdoor ratio
  const cleanlinessRatio = (currentStation.aqi / Math.max(indoorData.aqi, 1)).toFixed(1);
  const particulateShield = Math.min(99, Math.max(0, Math.round((1 - indoorData.aqi / currentStation.aqi) * 100)));

  // Outdoor circle stroke calculation
  const outdoorOffset = Math.max(20, Math.round(314.159 - (Math.min(currentStation.aqi, 500) / 500) * 314.159));
  const indoorOffset = Math.max(20, Math.round(314.159 - (Math.min(indoorData.aqi, 200) / 200) * 314.159));

  // Determine colors based on AQI
  const outdoorLevelColor =
    currentStation.aqi <= 100
      ? 'text-[#036C4C]'
      : currentStation.aqi <= 250
      ? 'text-[#B38600]'
      : 'text-[#BA1A1A]';

  const outdoorRingStroke =
    currentStation.aqi <= 100
      ? 'text-[#036C4C]'
      : currentStation.aqi <= 250
      ? 'text-[#FFE599]'
      : 'text-[#BA1A1A]';

  const outdoorTagBg =
    currentStation.aqi <= 100
      ? 'bg-[#E5F2E9] text-[#036C4C]'
      : currentStation.aqi <= 250
      ? 'bg-[#FFE599]/60 text-[#B38600]'
      : 'bg-[#FFDAD6]/80 text-[#BA1A1A]';

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
      {/* Header & Greeting Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-[#434749]">
            <span className="text-[11px] tracking-widest text-[#747879] uppercase font-semibold">
              Thursday, Oct 22
            </span>
            <span className="text-[#747879] text-[11px]">•</span>
            <span className="text-[11px] text-[#036C4C] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#036C4C] animate-pulse" />
              Sensors Synchronized
            </span>
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#181F21] tracking-tight mt-1">
            Good morning, Raghav.
          </h1>
          <p className="text-[15px] text-[#434749] mt-0.5">
            Here is your calm atmospheric sanctuary summary across South Delhi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-black/5 shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-[#036C4C]">
              explore
            </span>
            <span className="text-[12px] font-bold text-[#181F21]">
              {currentStation.shortName} Sanctuary
            </span>
            <span className="text-[#747879] text-[11px]">•</span>
            <span className="text-[11px] text-[#434749]">Sub-station 4A</span>
          </div>

          <button
            onClick={onOpenPurifierHub}
            className="flex items-center gap-2 bg-[#2D3436] hover:bg-[#181F21] text-white px-4 py-2 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span className="text-[12px] font-semibold">Purifier Hub</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Comparison Centerpiece (Bento Split) */}
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgba(45,52,54,0.04)] p-6 lg:p-8 overflow-hidden">
        {/* Ambient Backdrops */}
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#9EF4CC]/25 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-[#FFDAD6]/35 blur-[100px] pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Wing: Indoor Sanctuary */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-[#F4F3F1]/60 border border-black/5">
            {/* Circular Ring: Indoor */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  className="text-[#E3E2E0]/60"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-[#036C4C] transition-all duration-1000"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="50"
                  stroke="currentColor"
                  strokeDasharray="314.159"
                  strokeDashoffset={indoorOffset}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[28px] font-bold text-[#181F21] leading-none">
                  {indoorData.aqi}
                </span>
                <span className="text-[11px] text-[#036C4C] font-bold uppercase mt-1">
                  US AQI
                </span>
              </div>
            </div>

            {/* Indoor Telemetry Details */}
            <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 self-center sm:self-start bg-[#E5F2E9] px-3 py-0.5 rounded-full mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#036C4C]" />
                <span className="text-[11px] text-[#036C4C] font-bold">
                  Optimal Clean
                </span>
              </div>
              <h2 className="text-[22px] font-bold text-[#181F21] tracking-tight">
                Indoor Sanctuary
              </h2>
              <p className="text-[13px] text-[#434749] mt-0.5">
                {indoorData.roomName} • {indoorData.purifierModel}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-[#E3E2E0]/60">
                <div>
                  <span className="text-[11px] text-[#747879] block">PM 2.5</span>
                  <span className="text-[15px] text-[#181F21] font-bold">
                    {indoorData.pm25} <span className="text-[11px] font-normal text-[#434749]">µg/m³</span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#747879] block">Humidity</span>
                  <span className="text-[15px] text-[#181F21] font-bold">
                    {indoorData.humidity}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Bridge Metric */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-2">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#434749] mb-1 border border-black/5">
              <span className="material-symbols-outlined text-[22px]">
                compare_arrows
              </span>
            </div>
            <span className="text-[34px] text-[#036C4C] tracking-tight font-extrabold leading-none">
              {cleanlinessRatio}×
            </span>
            <span className="text-[13px] text-[#181F21] font-bold mt-1">
              Cleaner Indoors
            </span>
            <span className="text-[11px] text-[#747879] mt-0.5">
              {particulateShield}% Particulate Shield
            </span>
            <div className="mt-3 w-full max-w-[120px] h-1.5 rounded-full bg-[#EFEEEB] overflow-hidden">
              <div
                className="h-full bg-[#036C4C] rounded-full transition-all duration-700"
                style={{ width: `${particulateShield}%` }}
              />
            </div>
          </div>

          {/* Right Wing: Outdoor Atmosphere */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-[#F4F3F1]/60 border border-black/5">
            {/* Circular Ring: Outdoor */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  className="text-[#E3E2E0]/60"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className={`${outdoorRingStroke} transition-all duration-1000`}
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="50"
                  stroke="currentColor"
                  strokeDasharray="314.159"
                  strokeDashoffset={outdoorOffset}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-[28px] font-bold ${outdoorLevelColor} leading-none`}>
                  {currentStation.aqi}
                </span>
                <span className={`text-[11px] font-bold uppercase mt-1 ${outdoorLevelColor}`}>
                  {currentStation.aqi <= 100
                    ? 'Good'
                    : currentStation.aqi <= 250
                    ? 'Moderate'
                    : 'Very Poor'}
                </span>
              </div>
            </div>

            {/* Outdoor Telemetry Details */}
            <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
              <div className={`inline-flex items-center gap-1.5 self-center sm:self-start ${outdoorTagBg} px-3 py-0.5 rounded-full mb-1.5`}>
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentStation.aqi <= 100
                      ? 'bg-[#036C4C]'
                      : currentStation.aqi <= 250
                      ? 'bg-[#B38600]'
                      : 'bg-[#BA1A1A]'
                  }`}
                />
                <span className="text-[11px] font-bold">
                  {currentStation.aqi <= 100
                    ? 'Safe Air Pocket'
                    : currentStation.aqi <= 250
                    ? 'Moderate Caution'
                    : 'Caution Advised'}
                </span>
              </div>
              <h2 className="text-[22px] font-bold text-[#181F21] tracking-tight">
                {currentStation.name}
              </h2>
              <p className="text-[13px] text-[#434749] mt-0.5">
                {currentStation.status}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-[#E3E2E0]/60">
                <div>
                  <span className="text-[11px] text-[#747879] block">PM 2.5</span>
                  <span className={`text-[15px] font-bold ${outdoorLevelColor}`}>
                    {currentStation.pm25} <span className="text-[11px] font-normal text-[#434749]">µg/m³</span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#747879] block">PM 10</span>
                  <span className="text-[15px] text-[#181F21] font-bold">
                    {currentStation.pm10} <span className="text-[11px] font-normal text-[#434749]">µg/m³</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Context & Real-Time Inversion Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dynamics */}
        <div className="lg:col-span-8 rounded-3xl bg-white/80 backdrop-blur-md p-6 sm:p-7 border border-white/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#003A39]">
                  insights
                </span>
                <span className="text-[11px] text-[#434749] uppercase font-bold tracking-wider">
                  Atmospheric Dynamics &amp; Traffic Correlation
                </span>
              </div>
              <h3 className="text-[22px] font-bold text-[#181F21]">
                Outer Ring Road Transit Inversion Spike
              </h3>
            </div>
            <span className="text-[11px] bg-[#EFEEEB] px-3 py-1 rounded-full text-[#434749] font-medium shrink-0">
              Settles by 11:30 AM
            </span>
          </div>

          <p className="text-[15px] text-[#434749] mt-4 leading-relaxed">
            Dense vehicular transit combined with shallow morning surface temperature inversion along Outer Ring Road is generating a{' '}
            <strong className="text-[#181F21]">25% localized surge in PM2.5</strong>. Regional winds from the North-West are forecast to freshen by midday, breaking the inversion layer.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#E9E8E5]">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#747879]">Vs 7-Day Average</span>
              <span className="text-[15px] text-[#036C4C] font-bold mt-0.5">
                ↓ 14% Lower
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#747879]">Wind Velocity</span>
              <span className="text-[15px] text-[#181F21] font-bold mt-0.5">
                6.4 km/h NW
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#747879]">Boundary Layer</span>
              <span className="text-[15px] text-[#181F21] font-bold mt-0.5">
                420m Rising
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Clarity & Delhi Ridge */}
        <div className="lg:col-span-4 rounded-3xl bg-white/80 backdrop-blur-md p-6 sm:p-7 border border-white/70 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#747879] uppercase font-bold tracking-wider">
                Visual Clarity Index
              </span>
              <span className="text-[11px] text-[#036C4C] font-semibold bg-[#E5F2E9] px-2.5 py-0.5 rounded-full">
                Haze Index: 3.2
              </span>
            </div>

            <div className="mt-4 rounded-2xl overflow-hidden relative h-36 border border-black/5">
              <img
                className="w-full h-full object-cover"
                alt="Delhi Ridge forest near Vasant Kunj at morning light"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdAgKuA59Ja651rpE16I5xSDpzVgEGQFLk8OfGisGF114y8WqMp8rsgfdN7udQgMBxRldRxoSF7MjcbuC8IiS-0tgOhBzIsbalTXC-FSpuC2ztDib4f6Ds2lA8LFEnHaGWa9EvQvzevjgawVzgHOukhhGB4UemNIZdol05LlBhzBLq2M1J8-kKLTpuEtpMuIR8Q5icRi3ipWvf67esJNVRPzdElmAjgvf0FQIMzOgJrfIo9ErQNhTl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181F21]/80 via-transparent to-transparent flex items-end p-3">
                <div className="text-white flex items-center justify-between w-full">
                  <span className="text-[12px] font-medium">Sanjay Van Ridge Canopy</span>
                  <span className="text-[12px] font-bold">Visibility 1.8 km</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[13px] text-[#434749] mt-4">
            Ridge greenery is providing a natural 400m particulate buffer zone for Sector C and D colonies.
          </p>
        </div>
      </div>

      {/* Actionable Advisories Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[22px] font-bold text-[#181F21]">
              Actionable Advisories
            </h3>
            <p className="text-[13px] text-[#434749]">
              Grounded precautions tailored to {currentStation.shortName}&apos;s {currentStation.aqi} AQI profile.
            </p>
          </div>
          <span className="text-[11px] text-[#747879] hidden sm:inline">
            Active until 12:00 PM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Advisory 1: Masking */}
          <div
            onClick={() => setSelectedAdvisory('mask')}
            className="rounded-2xl bg-white/80 backdrop-blur-md p-5 border border-white/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#FFDAD6]/70 text-[#BA1A1A] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px]">masks</span>
              </div>
              <h4 className="font-bold text-[15px] text-[#181F21]">N95 Mask Advised</h4>
              <p className="text-[13px] text-[#434749] mt-1.5 leading-relaxed">
                Recommended for outdoor walking, cycling, or transit around Vasant Kunj malls and Nelson Mandela Marg.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFEEEB]">
              <span className="text-[11px] text-[#BA1A1A] font-bold">
                High Particulate Load
              </span>
            </div>
          </div>

          {/* Advisory 2: Air Purifiers */}
          <div
            onClick={onOpenPurifierHub}
            className="rounded-2xl bg-white/80 backdrop-blur-md p-5 border border-white/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#E5F2E9] text-[#036C4C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">air</span>
              </div>
              <h4 className="font-bold text-[15px] text-[#181F21]">Purifiers on Level 3</h4>
              <p className="text-[13px] text-[#434749] mt-1.5 leading-relaxed">
                Maintain auto or steady medium filtration. Seal northern-facing balcony doors against dust drafts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFEEEB] flex items-center justify-between">
              <span className="text-[11px] text-[#036C4C] font-bold">
                Indoor Air Stable
              </span>
              <span className="text-[11px] text-[#036C4C] underline">Adjust Hub</span>
            </div>
          </div>

          {/* Advisory 3: Outdoor Exercise */}
          <div
            onClick={() => setSelectedAdvisory('exercise')}
            className="rounded-2xl bg-white/80 backdrop-blur-md p-5 border border-white/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#E9E8E5] text-[#434749] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px]">fitness_center</span>
              </div>
              <h4 className="font-bold text-[15px] text-[#181F21]">Pause Outdoor Cardio</h4>
              <p className="text-[13px] text-[#434749] mt-1.5 leading-relaxed">
                Reschedule morning trail runs in Sanjay Van. Switch to mindful indoor yoga or gym workouts until 4 PM.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFEEEB]">
              <span className="text-[11px] text-[#747879] font-medium">
                Safe Window: 4:30 PM
              </span>
            </div>
          </div>

          {/* Advisory 4: Cabin Recirculation */}
          <div
            onClick={onNavigateToCommute}
            className="rounded-2xl bg-white/80 backdrop-blur-md p-5 border border-white/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#E5F2E9] text-[#036C4C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">directions_car</span>
              </div>
              <h4 className="font-bold text-[15px] text-[#181F21]">Cabin Recirculation</h4>
              <p className="text-[13px] text-[#434749] mt-1.5 leading-relaxed">
                Engage internal AC loop before merging into Mehrauli-Mahipalpur Road or airport arterial routes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFEEEB] flex items-center justify-between">
              <span className="text-[11px] text-[#036C4C] font-bold">
                HEPA Cabin Protection
              </span>
              <span className="text-[11px] text-[#036C4C] underline">Plan Commute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Micro-Forecast: 6-Hour Projection Trajectory */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-md p-6 lg:p-8 border border-white/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#036C4C]">
                trending_down
              </span>
              <span className="text-[11px] text-[#036C4C] uppercase font-bold tracking-wider">
                Predicted Dispersion
              </span>
            </div>
            <h3 className="text-[22px] font-bold text-[#181F21] mt-0.5">
              6-Hour Hourly Air Trajectory
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[12px] text-[#434749]">
              <span className="w-3 h-3 rounded-full bg-[#FFDAD6] border border-[#BA1A1A]/30" />
              <span>Coral (Hazardous)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#434749]">
              <span className="w-3 h-3 rounded-full bg-[#AAEFEC] border border-[#036C4C]/30" />
              <span>Buttercup/Sage (Moderate/Clean)</span>
            </div>
          </div>
        </div>

        {/* Trend Sparkline SVG Projection */}
        <div className="w-full h-24 mb-6 px-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 80">
            <defs>
              <linearGradient id="auraGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#FFDAD6" />
                <stop offset="35%" stopColor="#FFDAD6" />
                <stop offset="60%" stopColor="#AAEFEC" />
                <stop offset="100%" stopColor="#9EF4CC" />
              </linearGradient>
              <linearGradient id="auraFill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#AAEFEC" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FAF9F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0,15 Q 120,25 240,48 T 480,62 L 600,68 L 600,80 L 0,80 Z"
              fill="url(#auraFill)"
            />
            <path
              d="M 0,15 Q 120,25 240,48 T 480,62 L 600,68"
              fill="none"
              stroke="url(#auraGradient)"
              strokeLinecap="round"
              strokeWidth="3.5"
            />
            {/* Node Dots */}
            <circle className="fill-[#BA1A1A] stroke-white" cx="0" cy="15" r="4.5" strokeWidth="2" />
            <circle className="fill-[#BA1A1A] stroke-white" cx="120" cy="25" r="4.5" strokeWidth="2" />
            <circle className="fill-[#003A39] stroke-white" cx="240" cy="48" r="4.5" strokeWidth="2" />
            <circle className="fill-[#036C4C] stroke-white" cx="360" cy="56" r="4.5" strokeWidth="2" />
            <circle className="fill-[#036C4C] stroke-white" cx="480" cy="62" r="4.5" strokeWidth="2" />
            <circle className="fill-[#036C4C] stroke-white" cx="600" cy="68" r="4.5" strokeWidth="2" />
          </svg>
        </div>

        {/* Hourly Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {HOURLY_AIR_TRAJECTORY.map((h, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#F4F3F1]/80 flex flex-col justify-between text-center relative overflow-hidden group hover:bg-[#E9E8E5] transition-all border border-black/5"
            >
              <div
                className={`w-full h-1.5 rounded-full mb-2 ${
                  h.level === 'hazardous'
                    ? 'bg-[#BA1A1A]'
                    : h.aqi > 150
                    ? 'bg-[#8ED3D0]'
                    : 'bg-[#036C4C]'
                }`}
              />
              <span className="text-[12px] font-semibold text-[#181F21]">
                {h.time}
              </span>
              <div className="my-2">
                <span
                  className={`text-[24px] font-bold leading-none ${
                    h.level === 'hazardous'
                      ? 'text-[#BA1A1A]'
                      : h.aqi > 150
                      ? 'text-[#002322]'
                      : 'text-[#036C4C]'
                  }`}
                >
                  {h.aqi}
                </span>
                <span className="block text-[11px] text-[#747879] mt-0.5">AQI</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#181F21] font-bold block">
                  {h.label}
                </span>
                <span className="text-[10px] text-[#747879] block">
                  {h.weather}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Telemetry Ribbon (NCR Regional Stations Comparison) */}
      <div className="rounded-2xl bg-[#F4F3F1]/80 p-4 border border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-[#434749]">
          <span className="material-symbols-outlined text-[20px] text-[#036C4C]">
            share_location
          </span>
          <span className="text-[12px] font-bold text-[#181F21]">
            Regional Station Network:
          </span>
          <span className="text-[12px] text-[#434749]">
            48 Active CPCB Monitoring Hubs Live
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {allStations.slice(0, 5).map((st) => (
            <button
              key={st.id}
              onClick={() => onSelectStation(st)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                st.id === currentStation.id
                  ? 'bg-white border-[#036C4C] shadow-sm font-semibold'
                  : 'bg-white/80 border-black/5 hover:bg-white text-[#181F21]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  st.level === 'good'
                    ? 'bg-[#036C4C]'
                    : st.level === 'moderate'
                    ? 'bg-[#B38600]'
                    : 'bg-[#BA1A1A]'
                }`}
              />
              <span className="text-[11px]">
                {st.shortName}: <strong>{st.aqi}</strong>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
