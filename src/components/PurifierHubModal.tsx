import React from 'react';
import { IndoorSanctuaryData } from '../types';
import { ROOM_PRESETS } from '../data/mockData';

interface PurifierHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  indoorData: IndoorSanctuaryData;
  setIndoorData: React.Dispatch<React.SetStateAction<IndoorSanctuaryData>>;
  outdoorAqi: number;
}

export const PurifierHubModal: React.FC<PurifierHubModalProps> = ({
  isOpen,
  onClose,
  indoorData,
  setIndoorData,
  outdoorAqi,
}) => {
  if (!isOpen) return null;

  const handleRoomSelect = (roomName: string) => {
    const preset = ROOM_PRESETS[roomName];
    if (preset) {
      setIndoorData((prev) => ({
        ...prev,
        ...preset,
      }));
    }
  };

  const handleFanSpeedChange = (speed: number) => {
    // Dynamically adjust indoor AQI and PM2.5 based on purifier power
    const newAqi = Math.max(12, Math.round(55 - speed * 3.8));
    const newPm25 = Math.max(3, Math.round(newAqi * 0.22));

    setIndoorData((prev) => ({
      ...prev,
      fanSpeed: speed,
      aqi: newAqi,
      pm25: newPm25,
      level: newAqi <= 50 ? 'good' : 'moderate',
    }));
  };

  const handleModeChange = (mode: IndoorSanctuaryData['mode']) => {
    let speed = indoorData.fanSpeed;
    if (mode === 'Turbo') speed = 9;
    if (mode === 'Sleep') speed = 2;
    if (mode === 'Eco') speed = 3;
    if (mode === 'Auto') speed = 5;

    handleFanSpeedChange(speed);
    setIndoorData((prev) => ({ ...prev, mode }));
  };

  const cleanlinessRatio = (outdoorAqi / Math.max(indoorData.aqi, 1)).toFixed(1);
  const particulateShield = Math.min(99, Math.round((1 - indoorData.aqi / outdoorAqi) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-white/80 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4F3F1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5F2E9] flex items-center justify-center text-[#036C4C]">
              <span className="material-symbols-outlined text-[22px]">mode_fan</span>
            </div>
            <div>
              <h3 className="font-bold text-[18px] text-[#181F21]">
                Indoor Atmospheric Hub
              </h3>
              <p className="text-[12px] text-[#747879]">
                Continuous HEPA filtration &amp; microclimate regulator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F4F3F1] flex items-center justify-center text-[#747879] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Room Presets */}
        <div className="mt-5">
          <label className="text-[11px] font-bold text-[#747879] uppercase tracking-wider block mb-2">
            Active Sanctuary Zone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(ROOM_PRESETS).map((rName) => (
              <button
                key={rName}
                onClick={() => handleRoomSelect(rName)}
                className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  indoorData.roomName === rName
                    ? 'bg-[#E5F2E9] border-[#9EF4CC] text-[#036C4C] shadow-sm font-semibold'
                    : 'bg-[#F4F3F1]/70 border-transparent text-[#434749] hover:bg-[#E9E8E5]'
                }`}
              >
                <div className="text-[12px] font-bold truncate">{rName}</div>
                <div className="text-[10px] text-[#747879] mt-0.5">
                  AQI {ROOM_PRESETS[rName]?.aqi}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Indoor Telemetry Metrics */}
        <div className="mt-5 grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F4F3F1]/70 border border-black/5">
          <div className="text-center">
            <span className="text-[11px] text-[#747879] block font-medium">Indoor AQI</span>
            <span className="text-[28px] font-bold text-[#036C4C] leading-none block mt-1">
              {indoorData.aqi}
            </span>
            <span className="text-[10px] text-[#036C4C] font-semibold uppercase">Optimal Clean</span>
          </div>

          <div className="text-center border-x border-[#E3E2E0]">
            <span className="text-[11px] text-[#747879] block font-medium">PM 2.5 Density</span>
            <span className="text-[28px] font-bold text-[#181F21] leading-none block mt-1">
              {indoorData.pm25}
            </span>
            <span className="text-[10px] text-[#747879]">µg/m³</span>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-[#747879] block font-medium">Particulate Shield</span>
            <span className="text-[28px] font-bold text-[#036C4C] leading-none block mt-1">
              {cleanlinessRatio}×
            </span>
            <span className="text-[10px] text-[#747879]">{particulateShield}% blocked</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-5">
          <label className="text-[11px] font-bold text-[#747879] uppercase tracking-wider block mb-2">
            Filtration Algorithm Mode
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Auto', 'Sleep', 'Turbo', 'Eco'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`py-2 px-3 rounded-xl text-center text-[12px] font-semibold transition-all cursor-pointer ${
                  indoorData.mode === mode
                    ? 'bg-[#2D3436] text-white shadow-md'
                    : 'bg-[#F4F3F1] text-[#434749] hover:bg-[#E9E8E5]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Fan Speed Slider */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-semibold text-[#181F21]">
              HEPA Fan Speed
            </span>
            <span className="text-[12px] font-bold text-[#036C4C] bg-[#E5F2E9] px-2 py-0.5 rounded-full">
              Level {indoorData.fanSpeed} / 10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={indoorData.fanSpeed}
            onChange={(e) => handleFanSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-[#E3E2E0] rounded-lg appearance-none cursor-pointer accent-[#036C4C]"
          />
          <div className="flex justify-between text-[10px] text-[#747879] mt-1">
            <span>Whisper Quiet (Level 1)</span>
            <span>Balanced</span>
            <span>Max CADR Velocity (Level 10)</span>
          </div>
        </div>

        {/* Filter Health & VOC indicators */}
        <div className="mt-5 pt-4 border-t border-[#F4F3F1] grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E5F2E9] text-[#036C4C] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <div className="text-[11px] text-[#747879]">HEPA Filter Life</div>
              <div className="text-[13px] font-bold text-[#181F21]">
                {indoorData.filterLifePercentage}% Remaining
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E5F2E9] text-[#036C4C] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
            </div>
            <div>
              <div className="text-[11px] text-[#747879]">VOC &amp; Humidity</div>
              <div className="text-[13px] font-bold text-[#181F21]">
                {indoorData.vocLevel} ppm • {indoorData.humidity}% RH
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#2D3436] hover:bg-[#181F21] text-white text-[13px] font-semibold transition-all shadow-md cursor-pointer"
          >
            Apply &amp; Keep Sanctuary Active
          </button>
        </div>
      </div>
    </div>
  );
};
