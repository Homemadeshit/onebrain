import type { SalesGeoData, Period } from '../types';

const CITY_CLUSTERS = [
  { lat: 40.71, lng: -74.00, spread: 1.8, weight: 1.0 },
  { lat: 42.36, lng: -71.06, spread: 1.2, weight: 0.7 },
  { lat: 39.95, lng: -75.17, spread: 1.2, weight: 0.6 },
  { lat: 38.91, lng: -77.04, spread: 1.0, weight: 0.55 },
  { lat: 29.76, lng: -95.37, spread: 2.0, weight: 1.4 },
  { lat: 32.78, lng: -96.80, spread: 2.0, weight: 1.3 },
  { lat: 29.42, lng: -98.49, spread: 1.5, weight: 1.1 },
  { lat: 30.27, lng: -97.74, spread: 1.2, weight: 1.0 },
  { lat: 32.45, lng: -100.45, spread: 2.5, weight: 0.7 },
  { lat: 31.76, lng: -106.44, spread: 1.0, weight: 0.65 },
  { lat: 40.76, lng: -111.89, spread: 1.5, weight: 1.3 },
  { lat: 40.23, lng: -111.66, spread: 1.0, weight: 1.0 },
  { lat: 41.22, lng: -111.97, spread: 0.8, weight: 0.8 },
  { lat: 37.10, lng: -113.58, spread: 0.8, weight: 0.6 },
  { lat: 25.76, lng: -80.19, spread: 1.5, weight: 0.9 },
  { lat: 28.54, lng: -81.38, spread: 1.2, weight: 0.7 },
  { lat: 33.75, lng: -84.39, spread: 1.5, weight: 0.75 },
  { lat: 35.23, lng: -80.84, spread: 1.0, weight: 0.55 },
  { lat: 36.16, lng: -86.78, spread: 1.0, weight: 0.5 },
  { lat: 34.05, lng: -118.24, spread: 2.0, weight: 0.9 },
  { lat: 37.77, lng: -122.42, spread: 1.2, weight: 0.7 },
  { lat: 32.72, lng: -117.16, spread: 1.0, weight: 0.6 },
  { lat: 47.61, lng: -122.33, spread: 1.2, weight: 0.55 },
  { lat: 33.45, lng: -112.07, spread: 1.5, weight: 0.7 },
  { lat: 36.17, lng: -115.14, spread: 1.2, weight: 0.65 },
  { lat: 39.74, lng: -104.99, spread: 1.2, weight: 0.6 },
  { lat: 41.88, lng: -87.63, spread: 1.5, weight: 0.65 },
  { lat: 44.98, lng: -93.27, spread: 1.0, weight: 0.5 },
  { lat: 39.10, lng: -94.58, spread: 1.0, weight: 0.45 },
  { lat: 49.28, lng: -123.12, spread: 1.0, weight: 0.3 },
  { lat: 43.65, lng: -79.38, spread: 1.2, weight: 0.4 },
  { lat: 19.43, lng: -99.13, spread: 2.0, weight: 0.6 },
  { lat: 51.51, lng: -0.13, spread: 1.5, weight: 0.7 },
  { lat: 48.86, lng: 2.35, spread: 1.2, weight: 0.6 },
  { lat: 52.52, lng: 13.41, spread: 1.2, weight: 0.55 },
  { lat: 59.33, lng: 18.07, spread: 1.0, weight: 0.85 },
  { lat: 46.06, lng: 14.51, spread: 0.5, weight: 0.5 },
  { lat: 41.39, lng: 2.17, spread: 1.0, weight: 0.4 },
  { lat: 45.46, lng: 9.19, spread: 1.0, weight: 0.35 },
  { lat: 35.68, lng: 139.69, spread: 1.5, weight: 0.5 },
  { lat: 28.61, lng: 77.21, spread: 2.5, weight: 0.7 },
  { lat: 19.08, lng: 72.88, spread: 2.0, weight: 0.65 },
  { lat: 1.35, lng: 103.82, spread: 0.5, weight: 0.35 },
  { lat: 31.23, lng: 121.47, spread: 2.0, weight: 0.4 },
  { lat: 3.14, lng: 101.69, spread: 1.5, weight: 1.3 },
  { lat: 5.41, lng: 100.34, spread: 1.0, weight: 0.9 },
  { lat: 1.49, lng: 110.35, spread: 1.0, weight: 0.7 },
  { lat: 3.80, lng: 103.33, spread: 1.0, weight: 0.75 },
  { lat: 1.46, lng: 103.76, spread: 0.8, weight: 0.85 },
  { lat: 5.98, lng: 116.07, spread: 0.8, weight: 0.6 },
  { lat: 6.52, lng: 3.38, spread: 2.0, weight: 0.45 },
  { lat: -1.29, lng: 36.82, spread: 1.5, weight: 0.25 },
  { lat: -26.20, lng: 28.04, spread: 1.8, weight: 1.4 },
  { lat: -33.93, lng: 18.42, spread: 1.5, weight: 1.2 },
  { lat: -29.86, lng: 31.02, spread: 1.2, weight: 1.0 },
  { lat: -25.75, lng: 28.19, spread: 1.0, weight: 0.9 },
  { lat: -33.96, lng: 25.60, spread: 0.8, weight: 0.6 },
  { lat: -29.12, lng: 26.21, spread: 0.7, weight: 0.5 },
  { lat: -23.55, lng: -46.63, spread: 2.5, weight: 1.3 },
  { lat: -22.91, lng: -43.17, spread: 2.0, weight: 1.1 },
  { lat: -34.60, lng: -58.38, spread: 2.0, weight: 1.0 },
  { lat: -12.97, lng: -38.51, spread: 1.5, weight: 0.85 },
  { lat: -15.79, lng: -47.88, spread: 1.5, weight: 0.8 },
  { lat: -3.72, lng: -38.53, spread: 1.5, weight: 0.75 },
  { lat: -25.43, lng: -49.27, spread: 1.2, weight: 0.7 },
  { lat: 4.71, lng: -74.07, spread: 1.8, weight: 0.9 },
  { lat: -33.45, lng: -70.67, spread: 1.5, weight: 0.8 },
  { lat: -12.05, lng: -77.04, spread: 1.5, weight: 0.75 },
  { lat: 10.48, lng: -66.90, spread: 1.2, weight: 0.6 },
  { lat: -0.18, lng: -78.47, spread: 1.0, weight: 0.5 },
  { lat: -33.87, lng: 151.21, spread: 1.5, weight: 0.35 },
];

const PERIOD_MULTIPLIERS: Record<Period, number> = { '24h': 1, '7d': 3, '30d': 8, '90d': 18 };
const PERIOD_POINT_COUNTS: Record<Period, number> = { '24h': 600, '7d': 1000, '30d': 1500, '90d': 2000 };

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export async function fetchSalesGeo(period: Period): Promise<SalesGeoData> {
  const mult = PERIOD_MULTIPLIERS[period];
  const numPoints = PERIOD_POINT_COUNTS[period];
  const points = [];

  const totalWeight = CITY_CLUSTERS.reduce((s, c) => s + c.weight, 0);

  for (let i = 0; i < numPoints; i++) {
    let r = Math.random() * totalWeight;
    let cluster = CITY_CLUSTERS[0];
    for (const c of CITY_CLUSTERS) {
      r -= c.weight;
      if (r <= 0) { cluster = c; break; }
    }
    const lat = cluster.lat + gaussianRandom() * cluster.spread;
    const lng = cluster.lng + gaussianRandom() * cluster.spread;
    const amount = Math.round((100 + Math.random() * 2000) * cluster.weight * mult);
    points.push({ lat, lng, amount });
  }

  const kpis: Record<Period, { total_volume: number; total_people: number; new_enrollments: number; vc: { v: number; d: 'up' | 'down' }; pc: { v: number; d: 'up' | 'down' }; ec: { v: number; d: 'up' | 'down' } }> = {
    '24h': { total_volume: 84320, total_people: 12480, new_enrollments: 187, vc: { v: 12.4, d: 'up' }, pc: { v: 342, d: 'up' }, ec: { v: 8.2, d: 'up' } },
    '7d':  { total_volume: 412800, total_people: 12480, new_enrollments: 1340, vc: { v: 9.1, d: 'up' }, pc: { v: 1240, d: 'up' }, ec: { v: 6.7, d: 'up' } },
    '30d': { total_volume: 1680000, total_people: 12480, new_enrollments: 4210, vc: { v: 15.3, d: 'up' }, pc: { v: 3820, d: 'up' }, ec: { v: 11.5, d: 'up' } },
    '90d': { total_volume: 4920000, total_people: 12480, new_enrollments: 9870, vc: { v: 2.1, d: 'down' }, pc: { v: 8100, d: 'up' }, ec: { v: 3.4, d: 'down' } },
  };
  const k = kpis[period];

  const leaders = [
    { name: 'Marcus Reeves', country: 'United States', revenue: Math.round(12400 * mult), color: '#c8982a' },
    { name: 'Sofia Lindqvist', country: 'Sweden', revenue: Math.round(9870 * mult), color: '#a07820' },
    { name: 'Raj Patel', country: 'India', revenue: Math.round(8320 * mult), color: '#b8882a' },
    { name: 'Emma Dubois', country: 'France', revenue: Math.round(7150 * mult), color: '#dbb44a' },
    { name: 'Carlos Mendez', country: 'Mexico', revenue: Math.round(6900 * mult), color: '#006564' },
    { name: 'Yuki Tanaka', country: 'Japan', revenue: Math.round(5440 * mult), color: '#004746' },
    { name: 'Lena Fischer', country: 'Germany', revenue: Math.round(4890 * mult), color: '#9a7520' },
    { name: 'David Okonkwo', country: 'Nigeria', revenue: Math.round(4320 * mult), color: '#7a5c18' },
  ].sort((a, b) => b.revenue - a.revenue);

  return {
    period,
    total_volume: k.total_volume,
    total_people: k.total_people,
    new_enrollments: k.new_enrollments,
    volume_change: k.vc,
    people_change: k.pc,
    enroll_change: k.ec,
    points,
    leaders,
  };
}
