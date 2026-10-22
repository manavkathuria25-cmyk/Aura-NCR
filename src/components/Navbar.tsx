import React, { useState } from 'react';
import { StationData } from '../types';

interface NavbarProps {
  activeTab: 'home-glance' | 'map-commute' | 'community-trends';
  setActiveTab: (tab: 'home-glance' | 'map-commute' | 'community-trends') => void;
  currentStation: StationData;
  allStations: StationData[];
  onSelectStation: (station: StationData) => void;
  hasGeofenceAlert: boolean;
  onOpenAlerts: () => void;
  onOpenPurifierHub: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentStation,
  allStations,
  onSelectStation,
  hasGeofenceAlert,
  onOpenAlerts,
  onOpenPurifierHub,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/85 backdrop-blur-xl border-b border-[#2D3436]/5 shadow-[0_1px_8px_rgba(45,52,54,0.03)]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Brand & Active Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div 
            onClick={() => setActiveTab('home-glance')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-[#E5F2E9] border border-[#9EF4CC] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px] text-[#036C4C]">
                air
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[17px] tracking-tight text-[#181F21] leading-none">
                Aura NCR
              </span>
              <span className="text-[11px] text-[#434749] font-medium mt-1">
                Delhi NCR Air Companion
              </span>
            </div>
          </div>

          {/* Location Selector Pill */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="flex items-center gap-1.5 bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-full border border-black/5 shadow-[0_2px_10px_rgba(45,52,54,0.03)] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#036C4C]">
                location_on
              </span>
              <span className="text-[12px] font-semibold text-[#181F21]">
                {currentStation.name}
              </span>
              <span className="text-[11px] text-[#747879]">•</span>
              <span className="text-[11px] text-[#434749]">
                {currentStation.lastUpdated}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#747879] ml-0.5">
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {showLocationPicker && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-black/5 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#747879] uppercase tracking-wider">
                  Select Delhi NCR Sanctuary
                </div>
                <div className="space-y-1 mt-1">
                  {allStations.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        onSelectStation(st);
                        setShowLocationPicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[13px] transition-colors ${
                        st.id === currentStation.id
                          ? 'bg-[#E5F2E9] text-[#036C4C] font-semibold'
                          : 'hover:bg-[#F4F3F1] text-[#181F21]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{st.shortName}</span>
                        <span className="text-[10px] text-[#747879]">{st.status}</span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          st.level === 'good'
                            ? 'bg-[#9EF4CC] text-[#036C4C]'
                            : st.level === 'moderate'
                            ? 'bg-[#FFE599] text-[#B38600]'
                            : 'bg-[#FFDAD6] text-[#BA1A1A]'
                        }`}
                      >
                        AQI {st.aqi}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Pill Nav Bar */}
        <nav className="hidden md:flex items-center p-1 bg-[#F4F3F1]/80 rounded-full border border-black/5 shadow-[0_1px_4px_rgba(45,52,54,0.03)]">
          <button
            onClick={() => setActiveTab('home-glance')}
            className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
              activeTab === 'home-glance'
                ? 'bg-[#2D3436] text-white shadow-[0_2px_8px_rgba(45,52,54,0.12)]'
                : 'text-[#434749] hover:bg-[#E9E8E5] hover:text-[#181F21]'
            }`}
          >
            Home / Glance
          </button>
          <button
            onClick={() => setActiveTab('map-commute')}
            className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
              activeTab === 'map-commute'
                ? 'bg-[#2D3436] text-white shadow-[0_2px_8px_rgba(45,52,54,0.12)]'
                : 'text-[#434749] hover:bg-[#E9E8E5] hover:text-[#181F21]'
            }`}
          >
            Map &amp; Commute
          </button>
          <button
            onClick={() => setActiveTab('community-trends')}
            className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
              activeTab === 'community-trends'
                ? 'bg-[#2D3436] text-white shadow-[0_2px_8px_rgba(45,52,54,0.12)]'
                : 'text-[#434749] hover:bg-[#E9E8E5] hover:text-[#181F21]'
            }`}
          >
            Community &amp; Trends
          </button>
        </nav>

        {/* Right Actions & Pilot Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Button with Geofence Ping */}
          <button
            onClick={onOpenAlerts}
            aria-label="Geofence alerts"
            className="relative p-2 rounded-full bg-white/90 hover:bg-[#F4F3F1] text-[#434749] hover:text-[#181F21] transition-all border border-black/5 shadow-[0_2px_8px_rgba(45,52,54,0.03)] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
            {hasGeofenceAlert && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#BA1A1A] ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Purifier Quick Launcher */}
          <button
            onClick={onOpenPurifierHub}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-[#F4F3F1] border border-black/5 text-[#181F21] text-[12px] font-semibold transition-all shadow-[0_2px_8px_rgba(45,52,54,0.03)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#036C4C]">
              tune
            </span>
            <span>Purifier Hub</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-1.5 bg-white/90 py-1 px-2 rounded-full border border-black/5 shadow-[0_2px_8px_rgba(45,52,54,0.03)]">
            <div className="w-7 h-7 rounded-full bg-[#181F21] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[16px]">
                person
              </span>
            </div>
            <span className="hidden xl:inline text-[12px] font-semibold text-[#181F21] px-1">
              Mindful Pilot
            </span>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/90 text-[#181F21] border border-black/5"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl px-6 py-4 border-b border-black/5 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setActiveTab('home-glance');
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl text-[12px] font-semibold text-center ${
                activeTab === 'home-glance'
                  ? 'bg-[#2D3436] text-white'
                  : 'bg-[#F4F3F1] text-[#434749]'
              }`}
            >
              Glance
            </button>
            <button
              onClick={() => {
                setActiveTab('map-commute');
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl text-[12px] font-semibold text-center ${
                activeTab === 'map-commute'
                  ? 'bg-[#2D3436] text-white'
                  : 'bg-[#F4F3F1] text-[#434749]'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => {
                setActiveTab('community-trends');
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl text-[12px] font-semibold text-center ${
                activeTab === 'community-trends'
                  ? 'bg-[#2D3436] text-white'
                  : 'bg-[#F4F3F1] text-[#434749]'
              }`}
            >
              Trends
            </button>
          </div>

          <div className="pt-2 border-t border-black/5 flex items-center justify-between">
            <span className="text-[12px] text-[#434749] font-medium">
              Current: <strong>{currentStation.shortName} (AQI {currentStation.aqi})</strong>
            </span>
            <button
              onClick={() => {
                onOpenPurifierHub();
                setMobileMenuOpen(false);
              }}
              className="text-[11px] bg-[#E5F2E9] text-[#036C4C] font-bold px-3 py-1 rounded-full"
            >
              Open Purifier Hub
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
