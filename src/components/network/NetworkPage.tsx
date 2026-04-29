import { useState } from 'react'
import RankProgress from './RankProgress'
import BinaryNetwork from './BinaryNetwork'
import UnilevelNetwork from './UnilevelNetwork'
import SalesEarningsChart from './SalesEarningsChart'
import CommissionSources from './CommissionSources'
import ActivityFeed from './ActivityFeed'
import RecentJoins from './RecentJoins'
import CountriesInNetwork from './CountriesInNetwork'
import type { Currency } from '../../types'

export default function NetworkPage() {
  const [currency, setCurrency] = useState<Currency>('usdt');
  const [rep, setRep] = useState('marcus');

  const RATE = 339;
  const usdtBal = 4230;
  const goldBal = 12.48;

  const kpis = [
    { label: 'Total Earnings', value: currency === 'usdt' ? '$5,080' : `${(5080/RATE).toFixed(2)}`, unit: currency === 'usdt' ? 'USDT' : 'GOLD', change: '+12.4%', up: true },
    { label: 'Network Size', value: '1,247', unit: 'members', change: '+342', up: true },
    { label: 'Active Rate', value: '71.5%', unit: 'of network', change: '+2.1%', up: true },
    { label: 'Direct Referrals', value: '24', unit: 'people', change: '+3', up: true },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: '#fff' }}>
          My Network <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400, fontSize: 13, marginLeft: 12 }}>Rep Overview</span>
        </h1>
      </div>

      <div className="net-top-bar">
        <div className="net-top-bar-left">
          <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>Viewing Rep</label>
          <select className="rep-select" value={rep} onChange={e => setRep(e.target.value)}>
            <option value="org">Organization (All)</option>
            <option value="marcus">Marcus Reeves</option>
            <option value="sofia">Sofia Lindqvist</option>
            <option value="raj">Raj Patel</option>
            <option value="emma">Emma Dubois</option>
            <option value="carlos">Carlos Mendez</option>
            <option value="yuki">Yuki Tanaka</option>
            <option value="lena">Lena Fischer</option>
            <option value="david">David Okonkwo</option>
          </select>
        </div>
        <div className="net-top-bar-right">
          <div className="net-balance-pill">
            {currency === 'usdt' ? `$${usdtBal.toLocaleString()}` : goldBal.toFixed(2)} <span style={{ opacity: 0.6 }}>{currency === 'usdt' ? 'USDT' : 'GOLD'}</span>
          </div>
          <div className="currency-toggle">
            <button className={`currency-btn ${currency === 'usdt' ? 'active' : ''}`}
              onClick={() => setCurrency('usdt')}>USDT</button>
            <button className={`currency-btn ${currency === 'gold' ? 'active' : ''}`}
              onClick={() => setCurrency('gold')}>GOLD</button>
          </div>
        </div>
      </div>

      <div className="net-kpi-row">
        {kpis.map(k => (
          <div className="glass-card" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 30 }}>{k.value}
              <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 500, marginLeft: 6 }}>{k.unit}</span>
            </div>
            <div className={`kpi-change ${k.up ? 'up' : 'down'}`}>
              {k.up ? '↑' : '↓'} {k.change} vs prior period
            </div>
          </div>
        ))}
      </div>

      <RankProgress currency={currency} />

      <div className="net-section">
        <BinaryNetwork currency={currency} />
        <UnilevelNetwork currency={currency} />
      </div>

      <div className="net-section">
        <SalesEarningsChart />
        <CommissionSources currency={currency} />
      </div>

      <div className="net-section-3">
        <ActivityFeed />
        <RecentJoins />
        <CountriesInNetwork />
      </div>
    </>
  );
}
