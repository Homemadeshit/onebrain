export interface SalePoint {
  lat: number;
  lng: number;
  amount: number;
}

export interface ChangeIndicator {
  v: number;
  d: 'up' | 'down';
  u?: string;
}

export interface Leader {
  name: string;
  country: string;
  revenue: number;
  color: string;
}

export interface SalesGeoData {
  period: string;
  total_volume: number;
  total_people: number;
  new_enrollments: number;
  volume_change: ChangeIndicator;
  people_change: ChangeIndicator;
  enroll_change: ChangeIndicator;
  points: SalePoint[];
  leaders: Leader[];
}

export type Period = '24h' | '7d' | '30d' | '90d';
export type Currency = 'usdt' | 'gold';
export type Status = 'all' | 'active' | 'inactive';
