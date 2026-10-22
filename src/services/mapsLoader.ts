/// <reference types="google.maps" />
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export const MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyCZOIXWQFGl_TyCqBDwP0I7GiK3owBVHyI';

let optionsConfigured = false;
let googleMapsPromise: Promise<typeof google> | null = null;

export function getGoogleMapsLoader(): Promise<typeof google> {
  if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
    return Promise.resolve((window as any).google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  if (!optionsConfigured) {
    setOptions({
      key: MAPS_API_KEY,
      v: 'weekly',
    });
    optionsConfigured = true;
  }

  googleMapsPromise = (async () => {
    try {
      await importLibrary('maps');
      await importLibrary('marker');
      return (window as any).google;
    } catch (err: unknown) {
      console.warn('Google Maps JS API load notice:', err);
      throw err;
    }
  })();

  return googleMapsPromise;
}

// Clean aesthetic pastel map styling for Delhi NCR
export const PASTEL_MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#FAF9F6' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#434749' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#FAF9F6' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#E3E2E0' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#181F21' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#2D3436' }, { weight: 1.5 }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#EEF6F0' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#E5F2E9' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ECEAE6' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }, { weight: 2 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#F3F2EF' }, { weight: 3 }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#DCEBEB' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#63A7A5' }],
  },
];
