import { DEMO_SITES } from '../../data/demo/heritage-sites';

export interface LocationResult { latitude: number; longitude: number; accuracy: number; isDemo: boolean; }

const DEMO_LOCATION: LocationResult = { latitude: 13.0827, longitude: 80.2707, accuracy: 100, isDemo: true };

export async function getUserLocation(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(DEMO_LOCATION); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, isDemo: false }),
      () => resolve(DEMO_LOCATION),
      { timeout: 8000, maximumAge: 60000 }
    );
  });
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearbySites(userLat: number, userLon: number, maxKm = 500) {
  return DEMO_SITES.map((site) => ({ ...site, distance: calculateDistance(userLat, userLon, site.latitude, site.longitude) }))
    .filter((s) => s.distance <= maxKm)
    .sort((a, b) => a.distance - b.distance);
}
