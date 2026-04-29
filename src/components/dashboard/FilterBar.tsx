import type { Period, Status } from '../../types'

interface FilterBarProps {
  period: Period;
  status: Status;
  country: string;
  region: string;
  rank: string;
  product: string;
  onPeriodChange: (p: Period) => void;
  onStatusChange: (s: Status) => void;
  onCountryChange: (v: string) => void;
  onRegionChange: (v: string) => void;
  onRankChange: (v: string) => void;
  onProductChange: (v: string) => void;
  onReset: () => void;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
];

const STATUSES: { value: Status; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const COUNTRIES = [
  { value: 'all', label: 'All Countries' },
  { value: 'US', label: 'United States' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'SE', label: 'Sweden' },
  { value: 'IN', label: 'India' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'MX', label: 'Mexico' },
  { value: 'JP', label: 'Japan' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CL', label: 'Chile' },
  { value: 'AR', label: 'Argentina' },
];

const REGIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'na', label: 'North America' },
  { value: 'sa', label: 'South America' },
  { value: 'eu', label: 'Europe' },
  { value: 'af', label: 'Africa' },
  { value: 'as', label: 'Asia' },
  { value: 'oc', label: 'Oceania' },
];

const RANKS = [
  { value: 'all', label: 'All Ranks' },
  { value: 'starter', label: 'Starter' },
  { value: 'builder', label: 'Builder' },
  { value: 'leader', label: 'Leader' },
  { value: 'director', label: 'Director' },
  { value: 'ambassador', label: 'Ambassador' },
  { value: 'diamond', label: 'Diamond' },
];

const PRODUCTS = [
  { value: 'all', label: 'All Products' },
  { value: 'starter-pack', label: 'Starter Pack' },
  { value: 'premium', label: 'Premium' },
  { value: 'elite', label: 'Elite' },
  { value: 'vip', label: 'VIP Bundle' },
];

function SelectArrow() {
  return (
    <svg className="select-arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
  );
}

export default function FilterBar({
  period, status, country, region, rank, product,
  onPeriodChange, onStatusChange, onCountryChange, onRegionChange, onRankChange, onProductChange, onReset,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Period</label>
        <div className="filter-options">
          {PERIODS.map(p => (
            <button key={p.value} className={`filter-btn ${period === p.value ? 'active' : ''}`}
              onClick={() => onPeriodChange(p.value)}>{p.label}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Country</label>
        <div className="filter-select-wrap">
          <select className="filter-select" value={country} onChange={e => onCountryChange(e.target.value)}>
            {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <SelectArrow />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Region</label>
        <div className="filter-select-wrap">
          <select className="filter-select" value={region} onChange={e => onRegionChange(e.target.value)}>
            {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <SelectArrow />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Rank</label>
        <div className="filter-select-wrap">
          <select className="filter-select" value={rank} onChange={e => onRankChange(e.target.value)}>
            {RANKS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <SelectArrow />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Product</label>
        <div className="filter-select-wrap">
          <select className="filter-select" value={product} onChange={e => onProductChange(e.target.value)}>
            {PRODUCTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <SelectArrow />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <div className="filter-options">
          {STATUSES.map(s => (
            <button key={s.value} className={`filter-btn ${status === s.value ? 'active' : ''}`}
              onClick={() => onStatusChange(s.value)}>{s.label}</button>
          ))}
        </div>
      </div>

      <button className="filter-reset" onClick={onReset}>
        <svg viewBox="0 0 24 24" width="14" height="14"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3v5h5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Reset
      </button>
    </div>
  );
}
