/// <reference types="google.maps" />
import React, { useState, useEffect, useRef } from 'react';
import { CommunityPin, RouteOption, StationData } from '../types';
import { COMMUTE_ROUTES, CPCB_STATIONS } from '../data/mockData';
import { getGoogleMapsLoader, PASTEL_MAP_STYLES, MAPS_API_KEY } from '../services/mapsLoader';

interface MapCommuteProps {
  communityPins: CommunityPin[];
  onOpenReportModal: () => void;
  onSelectStation: (st: StationData) => void;
  onTriggerGeofenceAlert: (zone: string, aqi: number) => void;
}

export const MapCommute: React.FC<MapCommuteProps> = ({
  communityPins,
  onOpenReportModal,
  onSelectStation,
  onTriggerGeofenceAlert,
}) => {
  // Navigation & route state
  const [selectedRoute, setSelectedRoute] = useState<'routeA' | 'routeB'>('routeA');
  const [originText, setOriginText] = useState('Vasant Kunj, South West Delhi');
  const [destinationText, setDestinationText] = useState('DLF Cyber City, Gurugram');
  const [dynamicSmogRerouting, setDynamicSmogRerouting] = useState(true);
  const [navigating, setNavigating] = useState(false);

  // Map layer controls
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showCommunityPins, setShowCommunityPins] = useState(true);
  const [showIndustrialZones, setShowIndustrialZones] = useState(false);
  const [mapEngine, setMapEngine] = useState<'google' | 'vector'>('google');

  // Quick report popover
  const [quickReportOpen, setQuickReportOpen] = useState(false);

  // User location tracking
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 28.5244,
    lng: 77.1588,
  });
  const [locationTrackingActive, setLocationTrackingActive] = useState(false);
  const [activeZoneNotice, setActiveZoneNotice] = useState<string | null>(null);

  // Google Maps DOM container & instance refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  // Initialize or update Google Map
  useEffect(() => {
    if (mapEngine !== 'google' || !mapContainerRef.current) return;

    let isMounted = true;

    getGoogleMapsLoader()
      .then((google) => {
        if (!isMounted || !mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
          const map = new google.maps.Map(mapContainerRef.current, {
            center: { lat: 28.555, lng: 77.20 },
            zoom: 12,
            styles: PASTEL_MAP_STYLES,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            gestureHandling: 'greedy',
          });

          mapInstanceRef.current = map;

          // Traffic layer
          const traffic = new google.maps.TrafficLayer();
          trafficLayerRef.current = traffic;
          if (showTraffic) {
            traffic.setMap(map);
          }
        }

        renderGoogleMapsOverlays(google, mapInstanceRef.current);
      })
      .catch((err) => {
        console.warn('Google Maps falling back to artistic vector rendering:', err);
        setMapEngine('vector');
      });

    return () => {
      isMounted = false;
    };
  }, [mapEngine]);

  // Update Traffic Layer visibility
  useEffect(() => {
    if (trafficLayerRef.current && mapInstanceRef.current) {
      if (showTraffic) {
        trafficLayerRef.current.setMap(mapInstanceRef.current);
      } else {
        trafficLayerRef.current.setMap(null);
      }
    }
  }, [showTraffic]);

  // Update overlays when route or layers change
  useEffect(() => {
    if (mapEngine === 'google' && mapInstanceRef.current && (window as any).google) {
      renderGoogleMapsOverlays((window as any).google, mapInstanceRef.current);
    }
  }, [selectedRoute, showHeatmap, showCommunityPins, showIndustrialZones, communityPins]);

  const renderGoogleMapsOverlays = (google: any, map: google.maps.Map) => {
    // Clear old markers and lines
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    // 1. Draw Heatmap Zones as translucent pastel circles
    if (showHeatmap) {
      const hotspots = [
        { center: { lat: 28.6469, lng: 77.3160 }, radius: 3500, color: '#FFB4AB', aqi: 380, name: 'Anand Vihar' },
        { center: { lat: 28.5714, lng: 77.2588 }, radius: 2800, color: '#FFDAD6', aqi: 362, name: 'Ashram / DND' },
        { center: { lat: 28.5244, lng: 77.1588 }, radius: 3000, color: '#FFE599', aqi: 310, name: 'Vasant Kunj' },
        { center: { lat: 28.5983, lng: 77.1894 }, radius: 2600, color: '#9EF4CC', aqi: 85, name: 'Chanakyapuri' },
        { center: { lat: 28.6271, lng: 77.3619 }, radius: 3200, color: '#FFDAD6', aqi: 268, name: 'Noida Sec 62' },
        { center: { lat: 28.4950, lng: 77.0895 }, radius: 2900, color: '#FFE599', aqi: 215, name: 'Cyber City' },
      ];

      hotspots.forEach((h) => {
        const circle = new google.maps.Circle({
          strokeColor: h.color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: h.color,
          fillOpacity: 0.35,
          map,
          center: h.center,
          radius: h.radius,
        });
        circlesRef.current.push(circle);
      });
    }

    // 2. Draw Routes
    const routeA = COMMUTE_ROUTES[0];
    const routeB = COMMUTE_ROUTES[1];

    // Route A (Clean Green Line)
    const polyA = new google.maps.Polyline({
      path: routeA.waypoints.map(([lat, lng]) => ({ lat, lng })),
      geodesic: true,
      strokeColor: '#036C4C',
      strokeOpacity: selectedRoute === 'routeA' ? 0.95 : 0.4,
      strokeWeight: selectedRoute === 'routeA' ? 6 : 3,
      map,
    });
    polylinesRef.current.push(polyA);

    // Route B (NH-48 Corridor)
    const polyB = new google.maps.Polyline({
      path: routeB.waypoints.map(([lat, lng]) => ({ lat, lng })),
      geodesic: true,
      strokeColor: '#BA1A1A',
      strokeOpacity: selectedRoute === 'routeB' ? 0.95 : 0.4,
      strokeWeight: selectedRoute === 'routeB' ? 6 : 3,
      map,
    });
    polylinesRef.current.push(polyB);

    // 3. Draw Community Pins
    if (showCommunityPins) {
      communityPins.forEach((pin) => {
        const marker = new google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map,
          title: `${pin.locality}: ${pin.categoryLabel}`,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-family: Plus Jakarta Sans, sans-serif; padding: 4px; max-width: 200px;">
              <strong style="color: #181F21; font-size: 12px;">${pin.locality}</strong>
              <div style="color: #036C4C; font-weight: bold; font-size: 11px; margin-top: 2px;">${pin.categoryLabel} ${pin.aqi ? `(AQI ${pin.aqi})` : ''}</div>
              <p style="font-size: 11px; color: #434749; margin-top: 4px;">${pin.text}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }

    // 4. Origin & Destination Markers
    const startMarker = new google.maps.Marker({
      position: { lat: 28.5244, lng: 77.1588 },
      map,
      title: 'Start: Vasant Kunj',
      label: {
        text: 'A',
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    });
    markersRef.current.push(startMarker);

    const endMarker = new google.maps.Marker({
      position: { lat: 28.4950, lng: 77.0895 },
      map,
      title: 'End: DLF Cyber City',
      label: {
        text: 'B',
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    });
    markersRef.current.push(endMarker);
  };

  // Real browser geolocation or quick simulation
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      setLocationTrackingActive(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });

          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo({ lat, lng });
            mapInstanceRef.current.setZoom(13);
          }

          // Check proximity to Delhi high-pollution hotspots
          checkGeofenceAlert(lat, lng);
        },
        () => {
          // Fallback simulation in Vasant Kunj
          simulateLocation(28.5244, 77.1588, 'Vasant Kunj');
        }
      );
    } else {
      simulateLocation(28.5244, 77.1588, 'Vasant Kunj');
    }
  };

  const simulateLocation = (lat: number, lng: number, name: string) => {
    setUserLocation({ lat, lng });
    setOriginText(`${name}, Delhi NCR`);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat, lng });
      mapInstanceRef.current.setZoom(13);
    }
    checkGeofenceAlert(lat, lng, name);
  };

  const checkGeofenceAlert = (lat: number, lng: number, customName?: string) => {
    // If user is near Anand Vihar (28.64, 77.31) or Ashram (28.57, 77.25) or Vasant Kunj (28.52, 77.15)
    const distToAnandVihar = Math.hypot(lat - 28.6469, lng - 77.3160);
    const distToAshram = Math.hypot(lat - 28.5714, lng - 77.2588);

    if (distToAnandVihar < 0.08 || customName === 'Anand Vihar') {
      onTriggerGeofenceAlert(
        'Anand Vihar Route Cluster',
        380
      );
      setActiveZoneNotice('Entering Anand Vihar (AQI 380 • Severe). Roll up windows.');
    } else if (distToAshram < 0.08 || customName === 'Ashram Chowk') {
      onTriggerGeofenceAlert(
        'Ashram Chowk & DND Corridor',
        362
      );
      setActiveZoneNotice('Entering Ashram Idling Zone (AQI 362 • Hazardous).');
    } else {
      setActiveZoneNotice(null);
    }
  };

  const handleStartNavigation = () => {
    setNavigating(true);
    setTimeout(() => {
      setNavigating(false);
      alert('Clean navigation session started! Aura NCR is dynamically monitoring smog chokepoints along Mehrauli-Gurgaon Green Line.');
    }, 800);
  };

  const handleSwapLocations = () => {
    const temp = originText;
    setOriginText(destinationText);
    setDestinationText(temp);
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden bg-[#FAF9F6] select-none">
      {/* MAP CANVAS (Google Maps or Stylized Pastel Vector Map) */}
      {mapEngine === 'google' ? (
        <div ref={mapContainerRef} className="w-full h-full relative" />
      ) : (
        /* Stylized Pastel Vector Map (Image 4 representation) */
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          fill="none"
          viewBox="0 0 1440 880"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(680, 390) rotate(90) scale(160 210)"
              gradientUnits="userSpaceOnUse"
              id="heat-chanakyapuri"
              r="1"
            >
              <stop offset="0%" stopColor="#9ef4cc" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#9ef4cc" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#9ef4cc" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(610, 520) rotate(90) scale(150 180)"
              gradientUnits="userSpaceOnUse"
              id="heat-vasantkunj"
              r="1"
            >
              <stop offset="0%" stopColor="#FFE599" stopOpacity="0.8" />
              <stop offset="55%" stopColor="#FFE599" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFE599" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(860, 430) rotate(90) scale(170 240)"
              gradientUnits="userSpaceOnUse"
              id="heat-dnd-ashram"
              r="1"
            >
              <stop offset="0%" stopColor="#ffdad6" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#ffdad6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffdad6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(990, 290) rotate(90) scale(180 220)"
              gradientUnits="userSpaceOnUse"
              id="heat-anandvihar"
              r="1"
            >
              <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffdad6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffdad6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(480, 680) rotate(90) scale(180 230)"
              gradientUnits="userSpaceOnUse"
              id="heat-gurugramtoll"
              r="1"
            >
              <stop offset="0%" stopColor="#ffdad6" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#ffdad6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffdad6" stopOpacity="0" />
            </radialGradient>

            <filter height="140%" id="cleanGlow" width="140%" x="-20%" y="-20%">
              <feDropShadow dx="0" dy="2" floodColor="#036c4c" floodOpacity="0.25" stdDeviation="4" />
            </filter>
            <filter height="140%" id="hazardGlow" width="140%" x="-20%" y="-20%">
              <feDropShadow dx="0" dy="2" floodColor="#ba1a1a" floodOpacity="0.22" stdDeviation="4" />
            </filter>
          </defs>

          {/* Background Landmass */}
          <rect fill="#F9F8F6" height="880" width="1440" />

          {/* Green Reserves / Delhi Ridge */}
          <path
            d="M 640 280 C 660 320, 650 370, 620 420 C 590 470, 630 530, 660 560 C 690 590, 710 540, 700 480 C 690 420, 730 360, 710 300 Z"
            fill="#E5F2E9"
            opacity="0.9"
          />
          <circle cx="590" cy="530" fill="#E5F2E9" opacity="0.8" r="54" />
          <circle cx="730" cy="340" fill="#E5F2E9" opacity="0.7" r="42" />

          {/* Yamuna River */}
          <path
            d="M 880 -40 C 890 80, 870 190, 890 280 C 910 370, 935 440, 915 520 C 895 600, 920 720, 960 890"
            fill="none"
            stroke="#DCEBEB"
            strokeLinecap="round"
            strokeWidth="32"
          />
          <path
            d="M 880 -40 C 890 80, 870 190, 890 280 C 910 370, 935 440, 915 520 C 895 600, 920 720, 960 890"
            fill="none"
            stroke="#CAE4E4"
            strokeLinecap="round"
            strokeWidth="12"
          />

          {/* Minimal Roads */}
          <path d="M 120 180 L 1380 260" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="7" />
          <path d="M 80 430 L 1400 420" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="8" />
          <path d="M 160 690 L 1360 670" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="7" />
          <path d="M 740 20 L 760 860" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="9" />
          <circle cx="730" cy="330" fill="none" opacity="0.95" r="140" stroke="#FFFFFF" strokeWidth="12" />

          {/* Heatmap Overlay */}
          {showHeatmap && (
            <g id="heatmapLayer">
              <rect fill="url(#heat-chanakyapuri)" height="320" width="420" x="470" y="230" />
              <rect fill="url(#heat-vasantkunj)" height="300" width="360" x="430" y="370" />
              <rect fill="url(#heat-dnd-ashram)" height="340" width="480" x="620" y="260" />
              <rect fill="url(#heat-anandvihar)" height="360" width="400" x="790" y="110" />
              <rect fill="url(#heat-gurugramtoll)" height="360" width="400" x="280" y="500" />
            </g>
          )}

          {/* Route B: Hazard Corridor */}
          <path
            d="M 590 530 L 530 580 L 490 640 L 450 710"
            fill="none"
            filter="url(#hazardGlow)"
            stroke="#ffdad6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={selectedRoute === 'routeB' ? 10 : 4}
          />
          <path
            d="M 590 530 L 530 580 L 490 640 L 450 710"
            fill="none"
            stroke="#ba1a1a"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.5"
          />

          {/* Route A: Mindful Clean Route */}
          <path
            d="M 590 530 C 620 570, 600 620, 560 660 L 470 705 L 450 710"
            fill="none"
            filter="url(#cleanGlow)"
            stroke="#9ef4cc"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={selectedRoute === 'routeA' ? 12 : 5}
          />
          <path
            d="M 590 530 C 620 570, 600 620, 560 660 L 470 705 L 450 710"
            fill="none"
            stroke="#036c4c"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.5"
          />

          {/* Landmarks */}
          <g opacity="0.85">
            <text fill="#434749" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" letterSpacing="0.08em" textAnchor="middle" x="730" y="280">
              CONNAUGHT PLACE
            </text>
            <circle cx="730" cy="290" fill="#181f21" r="3" />
            <text fill="#005139" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" x="690" y="380">
              Chanakyapuri Embassy Area
            </text>
            <text fill="#036c4c" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" x="690" y="394">
              AQI 85 • Good
            </text>
            <text fill="#93000a" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" x="965" y="255">
              Anand Vihar ISBT
            </text>
            <text fill="#ba1a1a" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" x="965" y="269">
              AQI 410 • Severe
            </text>
            <text fill="#93000a" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" x="910" y="420">
              DND / Ashram Flyway
            </text>
            <text fill="#ba1a1a" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" x="910" y="434">
              AQI 340 • Very Poor
            </text>
          </g>

          {/* Origin Marker */}
          <g transform="translate(590, 530)">
            <circle cx="0" cy="0" fill="#181f21" fillOpacity="0.12" r="14" />
            <circle cx="0" cy="0" fill="#181f21" r="7" />
            <circle cx="0" cy="0" fill="#FAF9F6" r="3" />
            <rect fill="#FAF9F6" fillOpacity="0.95" height="28" rx="14" width="138" x="14" y="-14" />
            <text fill="#181f21" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="26" y="4">
              Start: Vasant Kunj
            </text>
          </g>

          {/* Destination Marker */}
          <g transform="translate(450, 710)">
            <circle cx="0" cy="0" fill="#036c4c" fillOpacity="0.18" r="16" />
            <circle cx="0" cy="0" fill="#036c4c" r="8" />
            <circle cx="0" cy="0" fill="#FAF9F6" r="3.5" />
            <rect fill="#FAF9F6" fillOpacity="0.95" height="28" rx="14" width="146" x="-160" y="-14" />
            <text fill="#181f21" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="-148" y="4">
              End: DLF CyberCity
            </text>
          </g>
        </svg>
      )}

      {/* Floating Active Zone Proximity Notice if triggered */}
      {activeZoneNotice && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-[#FFDAD6] text-[#BA1A1A] px-4 py-2 rounded-full font-bold text-[12px] shadow-lg flex items-center gap-2 border border-[#BA1A1A]/20 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>{activeZoneNotice}</span>
          <button
            onClick={() => setActiveZoneNotice(null)}
            className="ml-2 hover:opacity-75"
          >
            ×
          </button>
        </div>
      )}

      {/* Top Floating Filter & Overlay Controls Capsule */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-xl p-1.5 rounded-full shadow-[0_12px_32px_rgba(45,52,54,0.08)] border border-black/5 max-w-[95vw] overflow-x-auto">
        {/* Heatmap Toggle */}
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer shrink-0 ${
            showHeatmap
              ? 'bg-[#2D3436] text-white shadow-sm'
              : 'bg-[#F4F3F1] text-[#434749] hover:bg-[#E9E8E5]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-[#9EF4CC]">
            blur_on
          </span>
          <span>AQI Pastel Heatmap</span>
        </button>

        {/* Traffic Layer Toggle */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer shrink-0 ${
            showTraffic
              ? 'bg-[#2D3436] text-white shadow-sm'
              : 'bg-[#F4F3F1] text-[#434749] hover:bg-[#E9E8E5]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            traffic
          </span>
          <span>Google Maps Traffic v2</span>
        </button>

        {/* Community Reports Toggle */}
        <button
          onClick={() => setShowCommunityPins(!showCommunityPins)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer shrink-0 ${
            showCommunityPins
              ? 'bg-[#2D3436] text-white shadow-sm'
              : 'bg-[#F4F3F1] text-[#434749] hover:bg-[#E9E8E5]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-[#036C4C]">
            share_location
          </span>
          <span>Aura Community ({communityPins.length} nearby)</span>
        </button>

        {/* Map Engine Switcher (Google Maps / Pastel Vector) */}
        <button
          onClick={() => setMapEngine(mapEngine === 'google' ? 'vector' : 'google')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5F2E9] text-[#036C4C] text-[12px] font-bold hover:bg-[#9EF4CC] transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">
            map
          </span>
          <span>{mapEngine === 'google' ? 'Using Google Maps API' : 'Using Pastel Vector'}</span>
        </button>
      </div>

      {/* Floating Left Panel: Clean Commute Route Planner */}
      <aside className="absolute top-4 left-4 z-20 w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-7rem)] flex flex-col bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(45,52,54,0.08)] border border-white/80 overflow-hidden">
        {/* Panel Header & Waypoints Form */}
        <div className="p-5 pb-3 bg-white/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#036C4C] text-[22px]">
                alt_route
              </span>
              <h1 className="text-[20px] font-bold text-[#181F21] leading-tight">
                Clean Commute
              </h1>
            </div>
            <span className="text-[11px] text-[#036C4C] bg-[#E5F2E9] px-2.5 py-0.5 rounded-full font-bold">
              Live Pilot
            </span>
          </div>

          {/* Waypoint Input Capsule Container */}
          <div className="flex flex-col gap-2 bg-[#F4F3F1]/80 p-2 rounded-2xl relative border border-black/5">
            {/* Connector line */}
            <div className="absolute left-[26px] top-[24px] bottom-[24px] w-[2px] bg-[#C3C7C8]/70" />

            {/* Origin */}
            <div className="flex items-center gap-2.5 bg-white/95 px-3 py-2 rounded-xl shadow-sm relative z-10">
              <div className="w-3.5 h-3.5 rounded-full bg-[#181F21] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FAF9F6]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] text-[#747879] uppercase font-semibold">Origin</span>
                <input
                  type="text"
                  value={originText}
                  onChange={(e) => setOriginText(e.target.value)}
                  className="text-[13px] font-semibold text-[#181F21] truncate bg-transparent focus:outline-none"
                />
              </div>
              <button
                onClick={handleLocateMe}
                title="Track my real location"
                className="text-[#434749] hover:text-[#036C4C] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  my_location
                </span>
              </button>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-2.5 bg-white/95 px-3 py-2 rounded-xl shadow-sm relative z-10">
              <div className="w-3.5 h-3.5 rounded-full bg-[#036C4C] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FAF9F6]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] text-[#747879] uppercase font-semibold">Destination</span>
                <input
                  type="text"
                  value={destinationText}
                  onChange={(e) => setDestinationText(e.target.value)}
                  className="text-[13px] font-semibold text-[#181F21] truncate bg-transparent focus:outline-none"
                />
              </div>
              <button
                onClick={handleSwapLocations}
                title="Swap routes"
                className="text-[#434749] hover:text-[#181F21] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  swap_vert
                </span>
              </button>
            </div>
          </div>

          {/* Quick presets for commute destinations */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none">
            {[
              { label: 'Cyber City', lat: 28.4950, lng: 77.0895 },
              { label: 'Anand Vihar (High Smog)', lat: 28.6469, lng: 77.3160 },
              { label: 'Chanakyapuri (Clean)', lat: 28.5983, lng: 77.1894 },
              { label: 'Noida Sec 62', lat: 28.6271, lng: 77.3619 },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDestinationText(`${p.label}, Delhi NCR`);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.panTo({ lat: p.lat, lng: p.lng });
                  }
                  checkGeofenceAlert(p.lat, p.lng, p.label);
                }}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF9F6] hover:bg-[#E9E8E5] text-[#434749] shrink-0 border border-black/5"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Route Cards Scroll Area */}
        <div className="p-5 pt-2 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-23rem)]">
          {/* Route A (Clean Route - Recommended) */}
          <div
            onClick={() => setSelectedRoute('routeA')}
            className={`group cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${
              selectedRoute === 'routeA'
                ? 'bg-white shadow-[0_6px_24px_rgba(3,108,76,0.12)] border-[#9EF4CC]'
                : 'bg-[#F4F3F1]/70 hover:bg-white border-transparent'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E5F2E9] text-[#036C4C] text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">eco</span>
                Recommended Clean Route
              </span>
              <span className="text-[13px] text-[#036C4C] font-bold">48 mins</span>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-[17px] text-[#181F21] font-bold tracking-tight">
                  Mehrauli-Gurgaon Green Line
                </span>
                <span className="text-[12px] text-[#747879]">
                  19.2 km • via Sultanpur Bio-pocket
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#747879] block">Avg Exposure</span>
                <span className="text-[12px] text-[#B38600] font-bold bg-[#FFE599]/60 px-2 py-0.5 rounded-md">
                  AQI 145
                </span>
              </div>
            </div>

            {/* Atmospheric Benefits Badges */}
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 bg-[#9EF4CC]/30 text-[#005139] px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[16px] text-[#036C4C]">
                  air
                </span>
                <span className="text-[11px] font-semibold">
                  32% Lower PM2.5 Inhalation Exposure
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#434749] px-1">
                <span className="material-symbols-outlined text-[16px] text-[#036C4C]">
                  mode_fan
                </span>
                <span className="text-[11px]">
                  AC Recirculation recommended for 6 mins only
                </span>
              </div>
            </div>
          </div>

          {/* Route B (Fastest Route - High Inhalation Risk) */}
          <div
            onClick={() => setSelectedRoute('routeB')}
            className={`group cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${
              selectedRoute === 'routeB'
                ? 'bg-white shadow-[0_6px_24px_rgba(186,26,26,0.12)] border-[#FFDAD6]'
                : 'bg-[#F4F3F1]/70 hover:bg-white border-transparent'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E9E8E5] text-[#434749] text-[11px] font-semibold">
                Fastest Route
              </span>
              <span className="text-[13px] text-[#181F21] font-semibold">
                42 mins <span className="text-[11px] text-[#036C4C]">(-6m)</span>
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-[17px] text-[#181F21] font-bold tracking-tight">
                  NH-48 via Sirhaul Border
                </span>
                <span className="text-[12px] text-[#747879]">
                  17.8 km • Diesel truck freight corridor
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#747879] block">Avg Exposure</span>
                <span className="text-[12px] text-[#BA1A1A] font-bold bg-[#FFDAD6]/70 px-2 py-0.5 rounded-md">
                  AQI 335
                </span>
              </div>
            </div>

            {/* Toxic Hazard Warning Note */}
            <div className="mt-3 bg-[#FFDAD6]/50 p-2.5 rounded-xl text-[#93000A] flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#BA1A1A] mt-0.5 shrink-0">
                warning
              </span>
              <span className="text-[11px] leading-tight">
                High diesel exhaust idling near Sirhaul Toll. <strong>+6 mins saved vs 2.4x toxic fine particulate load.</strong>
              </span>
            </div>
          </div>

          {/* Live Adaptive Reroute Toggle Capsule */}
          <div className="flex items-center justify-between p-3 bg-[#F4F3F1]/80 rounded-2xl border border-black/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#036C4C] text-[20px]">
                sync
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#181F21]">
                  Dynamic Smog Rerouting
                </span>
                <span className="text-[10px] text-[#747879]">
                  Auto-divert if AQI spikes &gt; 50 pts ahead
                </span>
              </div>
            </div>

            <button
              onClick={() => setDynamicSmogRerouting(!dynamicSmogRerouting)}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                dynamicSmogRerouting ? 'bg-[#036C4C]' : 'bg-[#C3C7C8]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  dynamicSmogRerouting ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 pt-2 bg-white/70 border-t border-black/5 flex flex-col gap-2">
          <button
            onClick={handleStartNavigation}
            disabled={navigating}
            className="w-full py-3 px-6 rounded-full bg-[#181F21] hover:bg-[#2D3436] text-white font-bold text-[13px] transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">navigation</span>
            <span>
              {navigating
                ? 'Calibrating Sensors...'
                : `Start Navigation (${selectedRoute === 'routeA' ? 'Clean Route' : 'Fast Route'})`}
            </span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[#747879] pt-1 text-[11px]">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Filters: Prefer parks • Avoid diesel jams</span>
          </div>
        </div>
      </aside>

      {/* Bottom Center: Nordic Heatmap & Sensor Telemetry Legend Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col md:flex-row items-center gap-3 bg-white/90 backdrop-blur-xl px-5 py-2 rounded-full shadow-[0_12px_36px_rgba(45,52,54,0.08)] border border-black/5 max-w-[90vw]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#9EF4CC] shadow-sm" />
            <span className="text-[11px] font-bold text-[#181F21]">0-100 Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FFE599] shadow-sm" />
            <span className="text-[11px] font-bold text-[#181F21]">101-250 Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FFDAD6] shadow-sm" />
            <span className="text-[11px] font-bold text-[#181F21]">251-500+ Hazardous</span>
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-4 bg-[#C3C7C8]/60" />

        <div className="flex items-center gap-1.5 text-[#434749]">
          <span className="material-symbols-outlined text-[16px] text-[#036C4C]">
            verified
          </span>
          <span className="text-[11px] font-medium">
            Correlated with Google Maps Traffic API v2 &amp; CPCB Sensors
          </span>
        </div>
      </div>

      {/* Bottom Right: Floating Action Button & Micro-Report Trigger */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2.5">
        {/* Quick Report Drawer Modal Preview */}
        {quickReportOpen && (
          <div className="w-80 bg-white/95 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-white/80 flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#036C4C] text-[20px]">
                  add_location_alt
                </span>
                <span className="text-[13px] font-bold text-[#181F21]">
                  Report Local Anomaly
                </span>
              </div>
              <button
                onClick={() => setQuickReportOpen(false)}
                className="text-[#747879] hover:text-[#181F21]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#434749] leading-relaxed">
              Manually report local dust, crop residual burn, or heavy diesel jam to calibrate Delhi’s live neural map.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => {
                  setQuickReportOpen(false);
                  onOpenReportModal();
                }}
                className="p-2 text-left rounded-xl bg-[#F4F3F1] hover:bg-[#E9E8E5] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#BA1A1A] block mb-0.5">
                  construction
                </span>
                <span className="text-[11px] font-bold text-[#181F21]">
                  Dust / Building
                </span>
              </button>

              <button
                onClick={() => {
                  setQuickReportOpen(false);
                  onOpenReportModal();
                }}
                className="p-2 text-left rounded-xl bg-[#F4F3F1] hover:bg-[#E9E8E5] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#BA1A1A] block mb-0.5">
                  local_fire_department
                </span>
                <span className="text-[11px] font-bold text-[#181F21]">
                  Open Burning
                </span>
              </button>

              <button
                onClick={() => {
                  setQuickReportOpen(false);
                  onOpenReportModal();
                }}
                className="p-2 text-left rounded-xl bg-[#F4F3F1] hover:bg-[#E9E8E5] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#434749] block mb-0.5">
                  airport_shuttle
                </span>
                <span className="text-[11px] font-bold text-[#181F21]">
                  Diesel Truck Jam
                </span>
              </button>

              <button
                onClick={() => {
                  setQuickReportOpen(false);
                  onOpenReportModal();
                }}
                className="p-2 text-left rounded-xl bg-[#E5F2E9] hover:bg-[#9EF4CC] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#036C4C] block mb-0.5">
                  park
                </span>
                <span className="text-[11px] font-bold text-[#002115]">
                  Clean Sanctuary
                </span>
              </button>
            </div>

            <button
              onClick={() => {
                setQuickReportOpen(false);
                onOpenReportModal();
              }}
              className="w-full mt-1 py-2 bg-[#181F21] text-white rounded-full text-[12px] font-bold hover:bg-[#2D3436] transition-all cursor-pointer"
            >
              Pin Current Location (+50 Karma)
            </button>
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setQuickReportOpen(!quickReportOpen)}
          className="group flex items-center gap-2.5 bg-[#181F21] hover:bg-[#2D3436] text-white px-5 py-3 rounded-full shadow-[0_12px_28px_rgba(24,31,33,0.24)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#9EF4CC] text-[#002115] flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
          </div>
          <span className="text-[13px] font-bold tracking-wide">
            Contribute Pin / Report Spike
          </span>
        </button>
      </div>

      {/* Map Utility Floating Controls (Zoom, Geolocation, Layers) */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
        <div className="flex flex-col bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_24px_rgba(45,52,54,0.06)] overflow-hidden border border-black/5">
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 12) + 1);
              }
            }}
            aria-label="Zoom in"
            className="w-10 h-10 flex items-center justify-center text-[#181F21] hover:bg-[#F4F3F1] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className="w-6 h-[1px] bg-[#C3C7C8]/40 mx-auto" />
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 12) - 1);
              }
            }}
            aria-label="Zoom out"
            className="w-10 h-10 flex items-center justify-center text-[#181F21] hover:bg-[#F4F3F1] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>

        <button
          onClick={handleLocateMe}
          aria-label="Re-center location"
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#181F21] hover:bg-[#F4F3F1] shadow-[0_8px_24px_rgba(45,52,54,0.06)] border border-black/5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-[#036C4C]">
            near_me
          </span>
        </button>
      </div>
    </div>
  );
};
