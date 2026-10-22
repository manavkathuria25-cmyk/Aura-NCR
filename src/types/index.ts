export type PollutionLevel = 'good' | 'moderate' | 'hazardous';

export interface StationData {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  aqi: number;
  level: PollutionLevel;
  pm25: number;
  pm10: number;
  no2?: number;
  temp?: number;
  humidity?: number;
  status: string;
  lastUpdated: string;
}

export interface IndoorSanctuaryData {
  roomName: string;
  purifierModel: string;
  aqi: number;
  level: PollutionLevel;
  pm25: number;
  humidity: number;
  fanSpeed: number; // 1-10
  mode: 'Auto' | 'Sleep' | 'Turbo' | 'Eco';
  powerOn: boolean;
  filterLifePercentage: number;
  vocLevel: number; // ppm
}

export interface CommunityPin {
  id: string;
  author: string;
  authorInitials: string;
  locality: string;
  lat: number;
  lng: number;
  category: 'spikes' | 'dust' | 'clean' | 'traffic';
  categoryLabel: string;
  aqi?: number;
  text: string;
  timeAgo: string;
  neighborsConfirmed: number;
  trustScore: number;
  role: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface RouteOption {
  id: 'routeA' | 'routeB';
  name: string;
  subtitle: string;
  durationMinutes: number;
  timeDiffBadge?: string;
  distanceKm: number;
  avgAqi: number;
  level: PollutionLevel;
  exposureBadge: string;
  acRecommendation: string;
  warningNote?: string;
  isRecommended: boolean;
  waypoints: [number, number][];
}

export interface HourlyForecast {
  time: string;
  aqi: number;
  level: PollutionLevel;
  label: string;
  weather: string;
}

export interface ArterialCorridor {
  name: string;
  aqi: number;
  level: PollutionLevel;
  delayMins: number;
  statusText: string;
}
