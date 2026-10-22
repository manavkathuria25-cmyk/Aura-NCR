import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full bg-[#F4F3F1]/80 border-t border-black/5 mt-12 py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#036C4C]" />
          <span className="text-[12px] text-[#434749]">
            CPCB &amp; DPCC Continuous Ambient Air Monitoring System Telemetry Feed
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[12px] text-[#747879]">
            © 2025 Aura NCR • Mindful Clean Air Initiative
          </span>
        </div>
      </div>
    </footer>
  );
};
