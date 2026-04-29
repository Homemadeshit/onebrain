import type { Currency } from '../../types'

interface Props { currency: Currency }

export default function RankProgress({ currency }: Props) {
  return (
    <div className="glass-card net-rank-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--gold), #a07820)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: '#fff', fontWeight: 800,
          boxShadow: '0 4px 16px rgba(200,152,42,0.3)',
        }}>L</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Leader</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Level 4</div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>
          <span>Progress to Director</span>
          <span style={{ fontWeight: 700, color: 'var(--accent)' }}>68%</span>
        </div>
        <div style={{
          height: 10, borderRadius: 5,
          background: 'rgba(0,71,70,0.08)', overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            width: '68%', height: '100%', borderRadius: 5,
            background: 'linear-gradient(90deg, var(--teal), var(--gold))',
            transition: 'width 0.6s ease',
            boxShadow: '0 0 12px rgba(200,152,42,0.3)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>15,200 / 22,500 volume required</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)' }}>7,300 remaining</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '0 12px' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-dim)', fontWeight: 600 }}>Next Rank</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>Director</div>
      </div>
    </div>
  );
}
