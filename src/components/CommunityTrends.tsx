import React, { useState } from 'react';
import { CommunityPin } from '../types';
import { ARTERIAL_CORRIDORS } from '../data/mockData';

interface CommunityTrendsProps {
  communityPins: CommunityPin[];
  onUpvotePin: (pinId: string) => void;
  onOpenReportModal: () => void;
  onNavigateToMap: () => void;
}

export const CommunityTrends: React.FC<CommunityTrendsProps> = ({
  communityPins,
  onUpvotePin,
  onOpenReportModal,
  onNavigateToMap,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'spikes' | 'dust' | 'clean' | 'verified'>('all');
  const [selectedPinForMap, setSelectedPinForMap] = useState<CommunityPin | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const filteredPins = communityPins.filter((pin) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'spikes') return pin.category === 'spikes';
    if (activeFilter === 'dust') return pin.category === 'dust';
    if (activeFilter === 'clean') return pin.category === 'clean';
    if (activeFilter === 'verified') return pin.trustScore >= 80;
    return true;
  });

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      {/* Page Header & Ambient Context */}
      <section className="pt-2 pb-2">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#E9E8E5] px-3.5 py-1 rounded-full mb-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#036C4C] animate-pulse" />
              <span className="text-[11px] text-[#036C4C] uppercase tracking-wider font-bold">
                Active Telemetry Sync
              </span>
              <span className="text-[11px] text-[#747879]">•</span>
              <span className="text-[11px] text-[#434749]">Live NCR Network</span>
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-bold text-[#181F21] tracking-tight">
              Delhi NCR Air Quality Intelligence &amp; Ground Truth
            </h1>
            <p className="text-[15px] text-[#434749] mt-1">
              A community of 14,280 mindful residents verifying localized micro-climates across capital corridors.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleRefresh}
              className="bg-[#F4F3F1] hover:bg-[#E9E8E5] text-[#181F21] px-4 py-2 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                sync
              </span>
              <span>Refresh Feeds</span>
            </button>
            <button
              onClick={onOpenReportModal}
              className="bg-[#181F21] text-white px-5 py-2 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-md hover:bg-[#2D3436] transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
              <span>Submit Ground Pin</span>
            </button>
          </div>
        </div>

        {/* 3 Quick KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* KPI 1 */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#747879] uppercase tracking-wider font-bold">
                Observation Density
              </span>
              <div className="w-8 h-8 rounded-full bg-[#E5F2E9] flex items-center justify-center text-[#036C4C]">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-[26px] font-bold text-[#181F21] leading-tight">
                142 Today
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center text-[#036C4C] text-[12px] font-bold">
                  <span className="material-symbols-outlined text-[14px] mr-0.5">check_circle</span>
                  91% verified
                </span>
                <span className="text-[12px] text-[#747879]">by localized BAM sensors</span>
              </div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#747879] uppercase tracking-wider font-bold">
                Traffic Idling Stress (TIPI)
              </span>
              <div className="w-8 h-8 rounded-full bg-[#FFDAD6] flex items-center justify-center text-[#BA1A1A]">
                <span className="material-symbols-outlined text-[18px]">traffic</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-[26px] font-bold text-[#181F21] flex items-baseline gap-1 leading-tight">
                74<span className="text-[14px] text-[#747879] font-normal">/ 100</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-[#BA1A1A]" />
                <span className="text-[12px] text-[#434749]">
                  Severe Idling Peak at Ring Road &amp; DND
                </span>
              </div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#747879] uppercase tracking-wider font-bold">
                Atmospheric Window
              </span>
              <div className="w-8 h-8 rounded-full bg-[#9EF4CC] flex items-center justify-center text-[#002115]">
                <span className="material-symbols-outlined text-[18px]">air</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-[26px] font-bold text-[#181F21] leading-tight">
                Improving after 3 PM
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-[16px] text-[#036C4C]">
                  explore
                </span>
                <span className="text-[12px] text-[#434749]">
                  Westerly Breeze 14 km/h dispersing particulates
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Analytic & Live Feed Grid */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Traffic vs PM2.5 Analytics (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Primary Dual-Trace Analytics Card */}
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#036C4C] text-[20px]">
                      query_stats
                    </span>
                    <h2 className="text-[20px] font-bold text-[#181F21]">
                      Traffic Congestion vs. PM2.5 Exposure Correlation
                    </h2>
                  </div>
                  <p className="text-[13px] text-[#434749] mt-1">
                    Overlaying real-time delay indexes with continuous CPCB BAM PM2.5 sensors on Delhi arterials.
                  </p>
                </div>

                {/* Legend Indicators */}
                <div className="flex items-center gap-4 bg-[#F4F3F1] px-3.5 py-1.5 rounded-full shrink-0 border border-black/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#BA1A1A]" />
                    <span className="text-[11px] font-semibold text-[#181F21]">
                      PM2.5 (μg/m³)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2D3436]" />
                    <span className="text-[11px] font-semibold text-[#181F21]">
                      Delay (Mins)
                    </span>
                  </div>
                </div>
              </div>

              {/* Correlation Insight Pill */}
              <div className="mt-4 bg-[#F4F3F1]/80 p-3 rounded-2xl flex items-center justify-between border border-black/5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#036C4C] text-[20px] shrink-0">
                    insights
                  </span>
                  <span className="text-[12px] font-semibold text-[#181F21] truncate">
                    Strong r = 0.84 Pearson correlation between stop-and-go congestion &amp; localized PM2.5 spikes.
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[11px] bg-white text-[#434749] px-2.5 py-0.5 rounded-full shrink-0 shadow-sm border border-black/5 font-semibold">
                  p &lt; 0.001
                </span>
              </div>

              {/* Responsive Dual Line Chart SVG */}
              <div className="mt-6 w-full relative">
                <div className="w-full h-64 relative">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
                    {/* Background Grid Lines */}
                    <line className="text-[#E3E2E0]/70" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="680" y1="30" y2="30" />
                    <line className="text-[#E3E2E0]/70" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="680" y1="80" y2="80" />
                    <line className="text-[#E3E2E0]/70" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="680" y1="130" y2="130" />
                    <line className="text-[#E3E2E0]/70" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="680" y1="180" y2="180" />
                    <line className="text-[#C3C7C8]/80" stroke="currentColor" strokeWidth="1" x1="40" x2="680" y1="210" y2="210" />

                    {/* Left Y-Axis Labels */}
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="end" x="32" y="34">350</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="end" x="32" y="84">250</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="end" x="32" y="134">150</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="end" x="32" y="184">50</text>

                    {/* Rush Hour Shaded Bands */}
                    <rect fill="#E9E8E5" fillOpacity="0.45" height="190" rx="4" width="115" x="145" y="20" />
                    <rect fill="#E9E8E5" fillOpacity="0.45" height="190" rx="4" width="125" x="445" y="20" />

                    <text className="text-[9px] fill-[#747879] uppercase font-bold" textAnchor="middle" x="202" y="16">
                      Morning Rush
                    </text>
                    <text className="text-[9px] fill-[#747879] uppercase font-bold" textAnchor="middle" x="507" y="16">
                      Evening Rush
                    </text>

                    <defs>
                      <linearGradient id="trafficGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2D3436" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#2D3436" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="pmGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#BA1A1A" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#BA1A1A" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Line 2: Traffic Delay Index (Slate Fill & Line) */}
                    <path
                      d="M 50,190 C 90,188 120,180 150,130 C 180,75 220,95 260,160 C 300,185 360,188 420,175 C 460,110 500,60 540,85 C 580,140 620,175 670,185 L 670,210 L 50,210 Z"
                      fill="url(#trafficGrad)"
                    />
                    <path
                      d="M 50,190 C 90,188 120,180 150,130 C 180,75 220,95 260,160 C 300,185 360,188 420,175 C 460,110 500,60 540,85 C 580,140 620,175 670,185"
                      fill="none"
                      stroke="#2D3436"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    />

                    {/* Line 1: PM2.5 Microgram Line (Coral Red) */}
                    <path
                      d="M 50,175 C 90,170 120,160 160,85 C 190,45 225,65 265,145 C 310,170 370,165 425,150 C 465,80 505,38 545,55 C 585,120 630,150 670,165 L 670,210 L 50,210 Z"
                      fill="url(#pmGrad)"
                    />
                    <path
                      d="M 50,175 C 90,170 120,160 160,85 C 190,45 225,65 265,145 C 310,170 370,165 425,150 C 465,80 505,38 545,55 C 585,120 630,150 670,165"
                      fill="none"
                      stroke="#BA1A1A"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    />

                    {/* Interactive High Watermark Data Nodes */}
                    <circle cx="190" cy="45" fill="#FAF9F6" r="4.5" stroke="#BA1A1A" strokeWidth="2.5" />
                    <circle cx="180" cy="75" fill="#FAF9F6" r="4.5" stroke="#2D3436" strokeWidth="2.5" />
                    <circle cx="505" cy="38" fill="#FAF9F6" r="4.5" stroke="#BA1A1A" strokeWidth="2.5" />
                    <circle cx="500" cy="60" fill="#FAF9F6" r="4.5" stroke="#2D3436" strokeWidth="2.5" />

                    {/* X-Axis Timestamps */}
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="middle" x="50" y="228">04:00</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="middle" x="150" y="228">08:00</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="middle" x="260" y="228">12:00</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="middle" x="370" y="228">15:00</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="middle" x="480" y="228">18:00</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="middle" x="580" y="228">21:00</text>
                    <text className="text-[10px] fill-[#747879] font-medium" textAnchor="middle" x="670" y="228">24:00</text>
                  </svg>

                  {/* Micro Callout */}
                  <div className="absolute top-4 left-[26%] bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1 shadow-md pointer-events-none hidden sm:flex items-center gap-1.5 border border-black/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A]" />
                    <span className="text-[11px] text-[#181F21] font-bold">
                      Peak 328 μg/m³ (+26m delay)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Arterial Corridor Breakdown */}
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[17px] font-bold text-[#181F21]">
                    Key Arterial Corridor Observations
                  </h3>
                  <p className="text-[13px] text-[#747879]">
                    Live comparison across frequent commute sectors
                  </p>
                </div>
                <span className="text-[11px] bg-[#E9E8E5] text-[#434749] px-3 py-1 rounded-full font-semibold">
                  4 Monitored Arterials
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARTERIAL_CORRIDORS.map((corridor, idx) => (
                  <div
                    key={idx}
                    onClick={onNavigateToMap}
                    className="p-4 rounded-2xl bg-[#F4F3F1]/80 hover:bg-white transition-all cursor-pointer border border-black/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#181F21]">
                        {corridor.name}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                          corridor.level === 'hazardous'
                            ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                            : corridor.level === 'good'
                            ? 'bg-[#E5F2E9] text-[#036C4C]'
                            : 'bg-[#FFE599]/60 text-[#B38600]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            corridor.level === 'hazardous'
                              ? 'bg-[#BA1A1A]'
                              : corridor.level === 'good'
                              ? 'bg-[#036C4C]'
                              : 'bg-[#B38600]'
                          }`}
                        />
                        {corridor.statusText}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#E3E2E0]/60">
                      <div>
                        <span className="text-[10px] text-[#747879] block">Avg AQI</span>
                        <span
                          className={`text-[20px] font-bold leading-none ${
                            corridor.level === 'hazardous'
                              ? 'text-[#BA1A1A]'
                              : corridor.level === 'good'
                              ? 'text-[#036C4C]'
                              : 'text-[#181F21]'
                          }`}
                        >
                          {corridor.aqi}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#747879] block">Traffic Delay</span>
                        <span className="text-[20px] font-bold text-[#181F21] leading-none">
                          +{corridor.delayMins}m
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambient Photo Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm h-48 bg-[#E9E8E5]">
              <div
                className="bg-cover bg-center w-full h-full"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsHHc2Yh8zdxEJtfKo9QBQxs-wj0QzVVpKg5v14P6wsxA2zbrItAbdDYm2olSHgrVxXpRdKVsNeiNCHSNDVHNDVxRhYBzOINKhvX_ZF-OONWclRrMoy5bs6uObBEwhGif3y13LA_pyuCs6wPxiUIf2_McwGmpEuYzAMTP3nYtxd3SMoyAPvkEAhCh7v-pp4PDpoDZYmgOd_qklstKAHZTTWuqHqDD1u00Q7KB05ybQLRBCPn76evCt')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#181F21]/80 via-[#181F21]/40 to-transparent flex flex-col justify-end p-5">
                <span className="text-[11px] text-[#9EF4CC] font-bold uppercase tracking-wider">
                  Localized Field Research
                </span>
                <p className="text-[18px] text-white font-bold max-w-sm mt-0.5 leading-snug">
                  Trees cut fine particulates by up to 28% in central Lutyens avenues.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Community Ground Truth Feed (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Contribute Pin Action Banner */}
            <div className="bg-gradient-to-br from-[#9EF4CC]/30 via-[#F4F3F1] to-white/90 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#036C4C] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    add_location
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-bold text-[#181F21]">
                    Contribute Ground Pin
                  </h3>
                  <p className="text-[12px] text-[#434749] mt-0.5 leading-relaxed">
                    Noticed heavy local burning or dust? Report in 15 seconds to alert neighbors and municipal marshals.
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={onOpenReportModal}
                      className="bg-[#036C4C] hover:bg-[#025239] text-white px-4 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      Pin Incident Now
                    </button>
                    <span className="text-[11px] text-[#747879] font-medium">
                      +50 Aura Karma
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#181F21]">
                  Live Community Pins ({filteredPins.length})
                </span>
                <span className="text-[11px] text-[#036C4C] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#036C4C] animate-ping" />
                  Real-time
                </span>
              </div>

              {/* Scrollable Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All Reports' },
                  { id: 'spikes', label: 'Spikes & Burning' },
                  { id: 'dust', label: 'Construction Dust' },
                  { id: 'clean', label: 'Clean Havens' },
                  { id: 'verified', label: 'Verified (>80%)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id as any)}
                    className={`px-3.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                      activeFilter === f.id
                        ? 'bg-[#181F21] text-white shadow-sm'
                        : 'bg-[#F4F3F1] text-[#434749] hover:bg-[#E9E8E5]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed List Deck */}
            <div className="flex flex-col gap-3">
              {filteredPins.map((pin) => (
                <article
                  key={pin.id}
                  className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm transition-all hover:shadow-md"
                >
                  {/* Header: User & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#F4F3F1] border border-black/5 flex items-center justify-center text-[12px] text-[#181F21] font-bold shrink-0">
                        {pin.authorInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[#181F21] truncate">
                            {pin.author}
                          </span>
                          <span className="text-[11px] text-[#747879]">•</span>
                          <span className="text-[12px] text-[#434749] truncate">
                            {pin.locality}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-[#036C4C] font-semibold">
                            Trust {pin.trustScore}% ★
                          </span>
                          <span className="text-[11px] text-[#747879]">• {pin.role}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                        pin.category === 'spikes'
                          ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                          : pin.category === 'dust'
                          ? 'bg-[#E9E8E5] text-[#181F21]'
                          : 'bg-[#E5F2E9] text-[#036C4C]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          pin.category === 'spikes'
                            ? 'bg-[#BA1A1A] animate-pulse'
                            : pin.category === 'dust'
                            ? 'bg-[#747879]'
                            : 'bg-[#036C4C]'
                        }`}
                      />
                      {pin.categoryLabel}
                    </span>
                  </div>

                  {/* Notes Content */}
                  <p className="text-[13px] text-[#181F21] mt-3 leading-relaxed">
                    {pin.text}
                  </p>

                  {/* Verification Metadata */}
                  <div className="mt-3 flex items-center gap-2 text-[#747879] text-[11px]">
                    <span className="material-symbols-outlined text-[15px] text-[#036C4C]">
                      verified
                    </span>
                    <span>{pin.timeAgo}</span>
                    <span>•</span>
                    <span className="text-[#036C4C] font-semibold">
                      {pin.neighborsConfirmed} neighbors confirmed
                    </span>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-2 border-t border-[#F4F3F1] flex items-center justify-between">
                    <button
                      onClick={() => onUpvotePin(pin.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                        pin.hasUpvoted
                          ? 'bg-[#9EF4CC] text-[#002115]'
                          : 'bg-[#F4F3F1] hover:bg-[#E5F2E9] text-[#434749]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        thumb_up
                      </span>
                      <span>Helpful ({pin.upvotes})</span>
                    </button>

                    <button
                      onClick={() => setSelectedPinForMap(pin)}
                      className="flex items-center gap-1 text-[#181F21] hover:text-[#036C4C] text-[12px] font-bold transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">place</span>
                      <span>Triangulate Sensor</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination note */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[12px] text-[#747879]">
                Showing {filteredPins.length} verified reports
              </span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-full bg-[#F4F3F1] flex items-center justify-center text-[#747879] hover:bg-[#E9E8E5]">
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <span className="text-[11px] font-bold text-[#181F21] px-2">1 / 1</span>
                <button className="w-7 h-7 rounded-full bg-[#F4F3F1] flex items-center justify-center text-[#747879] hover:bg-[#E9E8E5]">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sensor Triangulation Flyout Drawer */}
      {selectedPinForMap && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/80 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F4F3F1]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#036C4C] text-[18px]">
                map
              </span>
              <span className="text-[12px] text-[#181F21] font-bold">
                Sensor Triangulation: {selectedPinForMap.locality}
              </span>
            </div>
            <button
              onClick={() => setSelectedPinForMap(null)}
              className="w-6 h-6 rounded-full hover:bg-[#F4F3F1] flex items-center justify-center text-[#747879]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div
            className="w-full h-36 bg-cover bg-center rounded-2xl relative overflow-hidden border border-black/5"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEk1hIQQU7A3NWPnrG7KxcxBK1v0surcU2WUF5_qao1vuGyQK2K6_lTKAjAMZhHJx8pQu00vWz9DPy-jWNvbmpfFamRmQ3uZ8KppAFN2F0uKUTtIbxQ6PSwzlCrWU9HGBbt46-YkhxHevNnQzKmQu-TpluB9tJYLuaCHFd6oNM54EhDIQM7hTj2VMSFmu7iiJ2__Dm2oAFYpfNqvGGpyAr8Cl9FPqCLA5mqIQ_r-KoOz8peja-mBIJ')`,
            }}
          >
            <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
              <div className="bg-white/95 px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 text-[#181F21] text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#036C4C] animate-ping" />
                Active BAM Station 450m away
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[#747879] text-[11px]">
            <span>Continuous CPCB Telemetry</span>
            <span className="text-[#036C4C] font-bold">Live Confirmed</span>
          </div>

          <button
            onClick={() => {
              setSelectedPinForMap(null);
              onNavigateToMap();
            }}
            className="w-full mt-3 py-2 rounded-full bg-[#181F21] text-white text-[11px] font-bold hover:bg-[#2D3436] transition-colors"
          >
            Open on Google Maps Canvas
          </button>
        </div>
      )}
    </div>
  );
};
