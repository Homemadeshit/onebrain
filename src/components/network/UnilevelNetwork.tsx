import type { Currency } from '../../types'

interface Props { currency: Currency }

const RATE = 339;

function cv(usdt: number, currency: Currency): string {
  if (currency === 'gold') return (usdt / RATE).toFixed(2);
  return usdt.toLocaleString();
}

const LEVELS = [
  { level: 1, members: 24, active: 22, label: 'Level 1' },
  { level: 2, members: 68, active: 54, label: 'Level 2' },
  { level: 3, members: 142, active: 118, label: 'Level 3' },
  { level: 4, members: 198, active: 152, label: 'Level 4' },
  { level: 5, members: 224, active: 168, label: 'Level 5' },
  { level: 6, members: 187, active: 132, label: 'Level 6' },
  { level: 7, members: 156, active: 98, label: 'Level 7' },
  { level: 8, members: 112, active: 72, label: 'Level 8' },
  { level: 9, members: 82, active: 48, label: 'Level 9' },
  { level: 10, members: 54, active: 28, label: 'Level 10' },
];

const maxMembers = Math.max(...LEVELS.map(l => l.members));

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)', borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.6)',
  backdropFilter: 'blur(40px)', overflow: 'hidden',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)', padding: 24,
};

export default function UnilevelNetwork({ currency }: Props) {
  const unit = currency === 'usdt' ? 'USDT' : 'GOLD';
  const totalMembers = LEVELS.reduce((s, l) => s + l.members, 0);
  const totalActive = LEVELS.reduce((s, l) => s + l.active, 0);

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(200,152,42,0.1), rgba(0,71,70,0.08))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            Unilevel Network
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2, marginLeft: 44 }}>10 levels deep</div>
        </div>
        <div style={{
          padding: '5px 12px', borderRadius: 20,
          background: 'rgba(200,152,42,0.08)', color: 'var(--gold)',
          fontSize: 11, fontWeight: 600,
        }}>{totalMembers.toLocaleString()} total</div>
      </div>

      {/* Summary stats */}
      <div className="net-stat-grid-3">
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(0,71,70,0.04), rgba(200,152,42,0.04))',
          border: '1px solid rgba(0,71,70,0.06)',
        }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 6 }}>Active</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>{totalActive}</div>
          <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 2, fontWeight: 500 }}>{((totalActive / totalMembers) * 100).toFixed(0)}% rate</div>
        </div>
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(0,71,70,0.04), rgba(200,152,42,0.04))',
          border: '1px solid rgba(0,71,70,0.06)',
        }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 6 }}>Direct</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>24</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>referrals</div>
        </div>
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(200,152,42,0.08), rgba(200,152,42,0.04))',
          border: '1px solid rgba(200,152,42,0.08)',
        }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gold)', fontWeight: 600, marginBottom: 6 }}>Earnings</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: 'var(--teal)' }}>{cv(6840, currency)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{unit}</div>
        </div>
      </div>

      {/* Level bars */}
      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 14, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>Members by Level</div>
      {LEVELS.map(l => {
        const pct = (l.members / maxMembers) * 100;
        const activePct = (l.active / l.members) * 100;
        return (
          <div key={l.level} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 24, fontSize: 11, color: 'var(--text-dim)', textAlign: 'right', fontWeight: 600 }}>{l.level}</div>
            <div style={{ flex: 1, height: 10, borderRadius: 5, background: 'rgba(0,71,70,0.05)', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: 5,
                background: 'linear-gradient(90deg, var(--teal), var(--gold))',
                transition: 'width 0.6s ease',
                opacity: 0.85,
              }} />
            </div>
            <div style={{ width: 36, fontSize: 12, fontWeight: 700, color: 'var(--text)', textAlign: 'right' }}>{l.members}</div>
            <div style={{ width: 36, fontSize: 10, color: 'var(--green)', textAlign: 'right', fontWeight: 500 }}>{activePct.toFixed(0)}%</div>
          </div>
        );
      })}
    </div>
  );
}
