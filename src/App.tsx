import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GeofenceBanner } from './components/GeofenceBanner';
import { HomeGlance } from './components/HomeGlance';
import { MapCommute } from './components/MapCommute';
import { CommunityTrends } from './components/CommunityTrends';
import { PurifierHubModal } from './components/PurifierHubModal';
import { SubmitPinModal } from './components/SubmitPinModal';
import { Footer } from './components/Footer';
import { CPCB_STATIONS, INITIAL_COMMUNITY_PINS, INITIAL_INDOOR_SANCTUARY } from './data/mockData';
import { StationData, CommunityPin, IndoorSanctuaryData } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home-glance' | 'map-commute' | 'community-trends'>('home-glance');
  const [currentStation, setCurrentStation] = useState<StationData>(CPCB_STATIONS[0]); // Vasant Kunj
  const [indoorData, setIndoorData] = useState<IndoorSanctuaryData>(INITIAL_INDOOR_SANCTUARY);
  const [communityPins, setCommunityPins] = useState<CommunityPin[]>(INITIAL_COMMUNITY_PINS);

  // Modals & Banners
  const [isPurifierHubOpen, setIsPurifierHubOpen] = useState(false);
  const [isSubmitPinOpen, setIsSubmitPinOpen] = useState(false);
  const [geofenceDismissed, setGeofenceDismissed] = useState(false);
  const [activeAlertZone, setActiveAlertZone] = useState<{ name: string; aqi: number; recommendation: string }>({
    name: 'Anand Vihar Route Cluster',
    aqi: 380,
    recommendation: 'Recommend sealing car cabin windows and switching AC to internal recirculation.',
  });

  const handleSelectStation = (st: StationData) => {
    setCurrentStation(st);
    if (st.aqi >= 250) {
      setActiveAlertZone({
        name: st.name,
        aqi: st.aqi,
        recommendation: 'Recommend sealing car cabin windows and switching AC to internal recirculation.',
      });
      setGeofenceDismissed(false);
    }
  };

  const handleTriggerGeofenceAlert = (zoneName: string, aqi: number) => {
    setActiveAlertZone({
      name: zoneName,
      aqi,
      recommendation: 'High particulate density detected ahead. Recommend sealing windows and engaging cabin recirculation.',
    });
    setGeofenceDismissed(false);
  };

  const handleUpvotePin = (pinId: string) => {
    setCommunityPins((prev) =>
      prev.map((pin) => {
        if (pin.id === pinId) {
          const nextVoted = !pin.hasUpvoted;
          return {
            ...pin,
            hasUpvoted: nextVoted,
            upvotes: nextVoted ? pin.upvotes + 1 : Math.max(0, pin.upvotes - 1),
          };
        }
        return pin;
      })
    );
  };

  const handleAddCommunityPin = (newPin: CommunityPin) => {
    setCommunityPins((prev) => [newPin, ...prev]);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1A1C1A] min-h-screen relative selection:bg-[#9EF4CC] selection:text-[#002115] flex flex-col font-sans">
      {/* Ambient Scandinavian Nordic Mist Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#9EF4CC]/20 blur-[100px]" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-[#AAEFEC]/25 blur-[90px]" />
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-[#FFDAD6]/20 blur-[110px]" />
      </div>

      {/* Top Fixed Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStation={currentStation}
        allStations={CPCB_STATIONS}
        onSelectStation={handleSelectStation}
        hasGeofenceAlert={!geofenceDismissed}
        onOpenAlerts={() => setGeofenceDismissed(false)}
        onOpenPurifierHub={() => setIsPurifierHubOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full pt-20 flex-1 flex flex-col">
        {/* Dismissible Geofence Proximity Alert Banner across all screens */}
        {!geofenceDismissed && (
          <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <GeofenceBanner
              zoneName={activeAlertZone.name}
              aqi={activeAlertZone.aqi}
              recommendation={activeAlertZone.recommendation}
              onDismiss={() => setGeofenceDismissed(true)}
              onViewOnMap={() => {
                setActiveTab('map-commute');
              }}
            />
          </div>
        )}

        {/* Tab 1: Home / Glance */}
        {activeTab === 'home-glance' && (
          <HomeGlance
            currentStation={currentStation}
            indoorData={indoorData}
            allStations={CPCB_STATIONS}
            onSelectStation={handleSelectStation}
            onOpenPurifierHub={() => setIsPurifierHubOpen(true)}
            onNavigateToCommute={() => setActiveTab('map-commute')}
          />
        )}

        {/* Tab 2: Map & Commute */}
        {activeTab === 'map-commute' && (
          <MapCommute
            communityPins={communityPins}
            onOpenReportModal={() => setIsSubmitPinOpen(true)}
            onSelectStation={handleSelectStation}
            onTriggerGeofenceAlert={handleTriggerGeofenceAlert}
          />
        )}

        {/* Tab 3: Community & Trends */}
        {activeTab === 'community-trends' && (
          <CommunityTrends
            communityPins={communityPins}
            onUpvotePin={handleUpvotePin}
            onOpenReportModal={() => setIsSubmitPinOpen(true)}
            onNavigateToMap={() => setActiveTab('map-commute')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Purifier Hub Modal */}
      <PurifierHubModal
        isOpen={isPurifierHubOpen}
        onClose={() => setIsPurifierHubOpen(false)}
        indoorData={indoorData}
        setIndoorData={setIndoorData}
        outdoorAqi={currentStation.aqi}
      />

      {/* Contribute Ground Pin Modal */}
      <SubmitPinModal
        isOpen={isSubmitPinOpen}
        onClose={() => setIsSubmitPinOpen(false)}
        onSubmit={handleAddCommunityPin}
        defaultLocality={currentStation.name}
        defaultCoords={[currentStation.lat, currentStation.lng]}
      />
    </div>
  );
}
