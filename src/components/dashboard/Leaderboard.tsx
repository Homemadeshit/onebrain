import type { Leader, Period } from '../../types'

function fmtMoney(n: number): string {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + n.toLocaleString();
  return '$' + n.toLocaleString();
}

const PERIOD_LABELS: Record<Period, string> = {
  '24h': '24h',
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
};

interface LeaderboardProps {
  leaders: Leader[];
  period: Period;
}

export default function Leaderboard({ leaders, period }: LeaderboardProps) {
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3>Top Earners</h3>
        <span className="badge">{PERIOD_LABELS[period]}</span>
      </div>
      <div className="leaderboard-list">
        {leaders.map((l, i) => {
          const rankClass = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : 'rn';
          const initials = l.name.split(' ').map(w => w[0]).join('');
          return (
            <div key={l.name} className="lb-entry" style={{ animation: `fadeUp 0.3s ease ${i * 0.04}s both` }}>
              <div className={`lb-rank ${rankClass}`}>{i + 1}</div>
              <div className="lb-avatar" style={{ background: l.color }}>{initials}</div>
              <div className="lb-info">
                <div className="lb-name">{l.name}</div>
                <div className="lb-country">{l.country}</div>
              </div>
              <div className="lb-revenue">{fmtMoney(l.revenue)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
