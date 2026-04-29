import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { Currency } from '../../types'

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props { currency: Currency }

const RATE = 339;

function cv(usdt: number, currency: Currency): string {
  if (currency === 'gold') return (usdt / RATE).toFixed(2);
  return usdt.toLocaleString();
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)', borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.6)',
  backdropFilter: 'blur(40px)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)', padding: 24,
};

const sources = [
  { label: 'Binary Commission', value: 2140, pct: 42, color: '#c8982a' },
  { label: 'Direct Bonus', value: 1520, pct: 30, color: '#dbb44a' },
  { label: 'Unilevel Commission', value: 1420, pct: 28, color: '#004746' },
];

export default function CommissionSources({ currency }: Props) {
  const unit = currency === 'usdt' ? 'USDT' : 'GOLD';

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(200,152,42,0.1), rgba(0,71,70,0.08))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          Commission Sources
        </div>
      </div>

      <div className="net-donut-layout">
        <div style={{ width: 150, height: 150, flexShrink: 0, position: 'relative' }}>
          <Doughnut
            data={{
              labels: sources.map(s => s.label),
              datasets: [{
                data: sources.map(s => s.value),
                backgroundColor: sources.map(s => s.color),
                borderWidth: 0,
                cutout: '72%',
              }],
            }}
            options={{
              responsive: true, maintainAspectRatio: true,
              plugins: { legend: { display: false }, tooltip: { enabled: true } },
            }}
          />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{cv(5080, currency)}</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 500 }}>{unit}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {sources.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{s.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                  {cv(s.value, currency)}
                  <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 400, marginLeft: 4 }}>({s.pct}%)</span>
                </div>
              </div>
              <div style={{
                height: 4, width: 60, borderRadius: 2,
                background: 'rgba(0,0,0,0.04)', overflow: 'hidden',
              }}>
                <div style={{ width: `${s.pct}%`, height: '100%', borderRadius: 2, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
