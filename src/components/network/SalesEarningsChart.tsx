import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CHART_DATA = {
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sales: [1200, 1900, 1500, 2200, 1800, 2400, 1100],
    earnings: [400, 620, 510, 740, 580, 810, 360],
  },
  weekly: {
    labels: ['W1', 'W2', 'W3', 'W4'],
    sales: [8400, 9200, 10100, 8800],
    earnings: [2800, 3100, 3400, 2900],
  },
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    sales: [32000, 38000, 35000, 42000, 39000, 45000],
    earnings: [10600, 12700, 11700, 14000, 13000, 15000],
  },
};

type ChartPeriod = 'daily' | 'weekly' | 'monthly';

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)', borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.6)',
  backdropFilter: 'blur(40px)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)', padding: 24,
};

export default function SalesEarningsChart() {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('daily');
  const d = CHART_DATA[chartPeriod];

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(0,71,70,0.1), rgba(200,152,42,0.08))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          Sales & Earnings
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['daily', 'weekly', 'monthly'] as ChartPeriod[]).map(p => (
            <button key={p} onClick={() => setChartPeriod(p)} style={{
              padding: '5px 14px', borderRadius: 20, border: 'none',
              background: chartPeriod === p ? 'var(--teal)' : 'rgba(0,71,70,0.04)',
              color: chartPeriod === p ? '#fff' : 'var(--text-dim)',
              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-dim)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} /> Sales
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-dim)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} /> Earnings
        </div>
      </div>

      <div style={{ height: 220 }}>
        <Bar
          data={{
            labels: d.labels,
            datasets: [
              { label: 'Sales', data: d.sales, backgroundColor: '#004746', borderRadius: 6, barPercentage: 0.55 },
              { label: 'Earnings', data: d.earnings, backgroundColor: '#c8982a', borderRadius: 6, barPercentage: 0.55 },
            ],
          }}
          options={{
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#5a6670' } },
              y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 10 }, color: '#5a6670', callback: (v) => '$' + v }, border: { display: false } },
            },
          }}
        />
      </div>
    </div>
  );
}
