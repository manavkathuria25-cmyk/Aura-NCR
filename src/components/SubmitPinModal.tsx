import React, { useState } from 'react';
import { CommunityPin } from '../types';

interface SubmitPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: CommunityPin) => void;
  defaultLocality?: string;
  defaultCoords?: [number, number];
}

export const SubmitPinModal: React.FC<SubmitPinModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultLocality = 'Vasant Kunj, South West Delhi',
  defaultCoords = [28.5244, 77.1588],
}) => {
  const [category, setCategory] = useState<'dust' | 'spikes' | 'traffic' | 'clean'>('spikes');
  const [locality, setLocality] = useState(defaultLocality);
  const [aqiInput, setAqiInput] = useState<string>('320');
  const [authorName, setAuthorName] = useState('Raghav (You)');
  const [sensorDetails, setSensorDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedAqi = parseInt(aqiInput, 10) || (category === 'clean' ? 85 : 310);

    let categoryLabel = 'Biomass Smoke';
    if (category === 'dust') categoryLabel = 'Construction Dust';
    if (category === 'traffic') categoryLabel = 'Heavy Idling Jam';
    if (category === 'clean') categoryLabel = 'Clean Haven';

    const newPin: CommunityPin = {
      id: `pin-${Date.now()}`,
      author: authorName || 'Anonymous Neighbor',
      authorInitials: (authorName || 'AN')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      locality: locality || 'Delhi NCR Locality',
      lat: defaultCoords[0] + (Math.random() - 0.5) * 0.02,
      lng: defaultCoords[1] + (Math.random() - 0.5) * 0.02,
      category,
      categoryLabel,
      aqi: parsedAqi,
      text:
        sensorDetails ||
        (category === 'clean'
          ? 'Dense micro-canopy clean air pocket observed. Ideal for walking.'
          : 'High particulate density observed on localized commute route.'),
      timeAgo: 'Just now',
      neighborsConfirmed: 1,
      trustScore: 95,
      role: 'Verified Commuter',
      upvotes: 1,
      hasUpvoted: true,
    };

    setTimeout(() => {
      onSubmit(newPin);
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-white/80 relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#F4F3F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E5F2E9] text-[#036C4C] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                add_location_alt
              </span>
            </div>
            <div>
              <h3 className="font-bold text-[17px] text-[#181F21]">
                Log Ground Air Observation
              </h3>
              <p className="text-[12px] text-[#747879]">
                Calibrate Delhi NCR&apos;s live atmospheric neural map (+50 Karma)
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
          {/* Observation Type */}
          <div>
            <label className="text-[11px] font-bold text-[#747879] uppercase tracking-wider block mb-2">
              Observation Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCategory('dust')}
                className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  category === 'dust'
                    ? 'bg-[#F4F3F1] border-[#2D3436] font-bold'
                    : 'bg-[#FAF9F6] border-black/5 text-[#434749]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#2D3436]">
                  grain
                </span>
                <span className="text-[11px] mt-1">Dust / Ash</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('spikes')}
                className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  category === 'spikes'
                    ? 'bg-[#FFDAD6]/70 border-[#BA1A1A] font-bold text-[#BA1A1A]'
                    : 'bg-[#FAF9F6] border-black/5 text-[#434749]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#BA1A1A]">
                  local_fire_department
                </span>
                <span className="text-[11px] mt-1">Biomass Smoke</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('traffic')}
                className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  category === 'traffic'
                    ? 'bg-[#FFE599]/60 border-[#B38600] font-bold text-[#B38600]'
                    : 'bg-[#FAF9F6] border-black/5 text-[#434749]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#B38600]">
                  traffic
                </span>
                <span className="text-[11px] mt-1">Idling Jam</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('clean')}
                className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  category === 'clean'
                    ? 'bg-[#E5F2E9] border-[#036C4C] font-bold text-[#036C4C]'
                    : 'bg-[#FAF9F6] border-black/5 text-[#434749]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#036C4C]">
                  park
                </span>
                <span className="text-[11px] mt-1">Clean Haven</span>
              </button>
            </div>
          </div>

          {/* Location in NCR */}
          <div>
            <label className="text-[11px] font-bold text-[#747879] uppercase tracking-wider block mb-1">
              Pin Location in NCR
            </label>
            <div className="relative">
              <span className="material-symbols-outlined text-[18px] text-[#747879] absolute left-3 top-2.5">
                location_on
              </span>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Ring Road near Lajpat Nagar Flyover"
                required
                className="w-full bg-[#F4F3F1] pl-9 pr-3 py-2 rounded-xl text-[#181F21] text-[13px] border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#036C4C]/30"
              />
            </div>
          </div>

          {/* AQI Reading */}
          <div>
            <label className="text-[11px] font-bold text-[#747879] uppercase tracking-wider block mb-1">
              Observed / Sensor AQI (US AQI Scale)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="999"
                value={aqiInput}
                onChange={(e) => setAqiInput(e.target.value)}
                className="w-32 bg-[#F4F3F1] px-3 py-2 rounded-xl text-[#181F21] font-bold text-[14px] border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#036C4C]/30"
              />
              <span className="text-[12px] text-[#747879]">
                (Temtop / Laser Egg / Sensirion or estimated from visual clarity)
              </span>
            </div>
          </div>

          {/* Observer Notes */}
          <div>
            <label className="text-[11px] font-bold text-[#747879] uppercase tracking-wider block mb-1">
              Details &amp; Field Context
            </label>
            <textarea
              rows={3}
              value={sensorDetails}
              onChange={(e) => setSensorDetails(e.target.value)}
              placeholder="Describe smoke density, odor, construction trucks, traffic idling, or canopy effect..."
              className="w-full bg-[#F4F3F1] p-3 rounded-xl text-[#181F21] text-[13px] border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#036C4C]/30 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[12px] font-medium text-[#434749] hover:bg-[#F4F3F1] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#181F21] hover:bg-[#2D3436] text-white px-6 py-2 rounded-full text-[12px] font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing Pin...' : 'Publish Pin to Google Maps'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
