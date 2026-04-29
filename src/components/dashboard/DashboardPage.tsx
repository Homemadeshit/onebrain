import { useState, useEffect, useCallback } from 'react'
import FilterBar from './FilterBar'
import KpiCards from './KpiCards'
import Globe from './Globe'
import Leaderboard from './Leaderboard'
import { fetchSalesGeo } from '../../data/mockData'
import type { Period, Status, SalesGeoData } from '../../types'

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('24h');
  const [status, setStatus] = useState<Status>('all');
  const [country, setCountry] = useState('all');
  const [region, setRegion] = useState('all');
  const [rank, setRank] = useState('all');
  const [product, setProduct] = useState('all');
  const [data, setData] = useState<SalesGeoData | null>(null);

  const loadData = useCallback(async () => {
    const result = await fetchSalesGeo(period);
    setData(result);
  }, [period, status, country, region, rank, product]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReset = () => {
    setPeriod('24h');
    setStatus('all');
    setCountry('all');
    setRegion('all');
    setRank('all');
    setProduct('all');
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: '#fff' }}>
          Dashboard <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, fontSize: 14, marginLeft: 12 }}>Global Overview</span>
        </h1>
      </div>
      <FilterBar
        period={period} status={status} country={country}
        region={region} rank={rank} product={product}
        onPeriodChange={setPeriod} onStatusChange={setStatus}
        onCountryChange={setCountry} onRegionChange={setRegion}
        onRankChange={setRank} onProductChange={setProduct}
        onReset={handleReset}
      />
      <KpiCards data={data} />
      <div className="main-grid">
        <Globe points={data?.points ?? []} />
        <Leaderboard leaders={data?.leaders ?? []} period={period} />
      </div>
    </>
  );
}
