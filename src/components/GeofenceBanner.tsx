import React from 'react';

interface GeofenceBannerProps {
  zoneName: string;
  aqi: number;
  recommendation: string;
  onDismiss: () => void;
  onViewOnMap?: () => void;
}

export const GeofenceBanner: React.FC<GeofenceBannerProps> = ({
  zoneName,
  aqi,
  recommendation,
  onDismiss,
  onViewOnMap,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#FFDAD6]/45 backdrop-blur-md p-4 sm:p-5 border border-[#FFDAD6] shadow-sm transition-all duration-300">
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#FFDAD6] flex items-center justify-center shrink-0 text-[#BA1A1A] shadow-inner">
            <span className="material-symbols-outlined text-[22px]">
              fmd_bad
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#BA1A1A] tracking-wider uppercase">
                Geofence Proximity Alert
              </span>
              <span className="text-[11px] text-[#747879]">•</span>
              <span className="text-[12px] text-[#434749] font-medium">
                {zoneName}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#BA1A1A] text-white">
                AQI {aqi} • Soft Coral
              </span>
            </div>

            <p className="text-[14px] text-[#181F21] mt-1 leading-snug">
              Entering {zoneName}. {recommendation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onViewOnMap && (
            <button
              onClick={onViewOnMap}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#181F21] font-semibold text-[12px] transition-all shadow-sm border border-black/5"
            >
              Route Bypass
            </button>
          )}
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-full bg-white/90 text-[#434749] hover:text-[#181F21] hover:bg-white font-medium text-[12px] transition-all shadow-sm border border-black/5 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
