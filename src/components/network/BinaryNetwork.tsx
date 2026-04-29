import { useState } from 'react'
import type { Currency } from '../../types'

interface Props { currency: Currency }

const RATE = 339;

function cv(usdt: number, currency: Currency): string {
  if (currency === 'gold') return (usdt / RATE).toFixed(2);
  return usdt.toLocaleString();
}

function fmtVal(usdt: number, currency: Currency): string {
  if (currency === 'gold') return `${(usdt / RATE).toFixed(2)} GOLD`;
  return `$${usdt.toLocaleString()}`;
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)', borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.6)',
  backdropFilter: 'blur(40px)', overflow: 'hidden',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)', padding: 24,
};

const statStyle: React.CSSProperties = {
  padding: '16px 18px', borderRadius: 14,
  background: 'linear-gradient(135deg, rgba(0,71,70,0.04), rgba(200,152,42,0.04))',
  border: '1px solid rgba(0,71,70,0.06)',
};

export default function BinaryNetwork({ currency }: Props) {
  const [expanded, setExpanded] = useState(false);
  const unit = currency === 'usdt' ? 'USDT' : 'GOLD';

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(0,71,70,0.1), rgba(200,152,42,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round"><path d="M16 3h5v5M8 3H3v5M3 16v5h5M21 16v5h-5M12 12l4-4M12 12l-4-4M12 12l4 4M12 12l-4 4"/></svg>
            </div>
            Binary Network
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2, marginLeft: 44 }}>Left & right leg volume</div>
        </div>
        <div style={{
          padding: '5px 12px', borderRadius: 20,
          background: 'rgba(26,138,90,0.08)', color: 'var(--green)',
          fontSize: 11, fontWeight: 600,
        }}>Balanced</div>
      </div>

      <div className="net-stat-grid-3">
        <div style={statStyle}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 8 }}>Left Leg</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>{cv(18420, currency)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{unit}</div>
        </div>
        <div style={statStyle}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 8 }}>Right Leg</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>{cv(14870, currency)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{unit}</div>
        </div>
        <div style={{ ...statStyle, background: 'linear-gradient(135deg, rgba(200,152,42,0.08), rgba(200,152,42,0.04))' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gold)', fontWeight: 600, marginBottom: 8 }}>Earnings</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: 'var(--teal)' }}>{cv(2140, currency)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{unit}</div>
        </div>
      </div>

      {/* Tree */}
      <div className="net-tree-wrap">
        {/* Level 0 */}
        <TreeNode initials="MR" name="Marcus R." vol={fmtVal(33290, currency)} level="you" />

        <svg width="400" height="32" viewBox="0 0 400 32" style={{ display: 'block' }}>
          <line x1="200" y1="2" x2="120" y2="30" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4"/>
          <line x1="200" y1="2" x2="280" y2="30" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4"/>
        </svg>

        {/* Level 1 */}
        <div style={{ display: 'flex', gap: 60 }}>
          <TreeNode initials="SL" name="Sofia L." vol={fmtVal(18420, currency)} level="l1" />
          <TreeNode initials="RP" name="Raj P." vol={fmtVal(14870, currency)} level="l1" />
        </div>

        <svg width="500" height="32" viewBox="0 0 500 32" style={{ display: 'block' }}>
          <line x1="145" y1="2" x2="85" y2="30" stroke="var(--teal)" strokeWidth="1" strokeDasharray="4 3" opacity="0.25"/>
          <line x1="145" y1="2" x2="205" y2="30" stroke="var(--teal)" strokeWidth="1" strokeDasharray="4 3" opacity="0.25"/>
          <line x1="355" y1="2" x2="295" y2="30" stroke="var(--teal)" strokeWidth="1" strokeDasharray="4 3" opacity="0.25"/>
          <line x1="355" y1="2" x2="415" y2="30" stroke="var(--teal)" strokeWidth="1" strokeDasharray="4 3" opacity="0.25"/>
        </svg>

        {/* Level 2 */}
        <div style={{ display: 'flex', gap: 16 }}>
          <TreeNode initials="ED" name="Emma D." vol={fmtVal(9100, currency)} level="l2" />
          <TreeNode initials="CM" name="Carlos M." vol={fmtVal(9320, currency)} level="l2" />
          <TreeNode initials="YT" name="Yuki T." vol={fmtVal(7440, currency)} level="l2" />
          <TreeNode initials="LF" name="Lena F." vol={fmtVal(7430, currency)} level="l2" />
        </div>

        {expanded && (
          <>
            <svg width="700" height="32" viewBox="0 0 700 32" style={{ display: 'block' }}>
              {[112, 232, 352, 472].map(x => (
                <g key={x}>
                  <line x1={x+25} y1="2" x2={x-5} y2="30" stroke="var(--teal)" strokeWidth="1" strokeDasharray="4 3" opacity="0.15"/>
                  <line x1={x+25} y1="2" x2={x+55} y2="30" stroke="var(--teal)" strokeWidth="1" strokeDasharray="4 3" opacity="0.15"/>
                </g>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { i: 'AL', n: 'Alex L.', v: 4200 }, { i: 'MK', n: 'Maya K.', v: 4900 },
                { i: 'TS', n: 'Tom S.', v: 4520 }, { i: 'JH', n: 'Jin H.', v: 4800 },
                { i: 'RN', n: 'Rosa N.', v: 3720 }, { i: 'KW', n: 'Kim W.', v: 3720 },
                { i: 'AS', n: 'Amir S.', v: 3640 }, { i: 'LP', n: 'Lily P.', v: 3790 },
              ].map(n => <TreeNode key={n.i} initials={n.i} name={n.n} vol={fmtVal(n.v, currency)} level="l3" />)}
            </div>
          </>
        )}

        <button onClick={() => setExpanded(!expanded)} style={{
          padding: '8px 24px', borderRadius: 20, marginTop: 16,
          border: '1px solid rgba(0,71,70,0.1)', background: 'rgba(0,71,70,0.04)',
          color: 'var(--teal)', fontSize: 11, fontWeight: 600,
          fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
        }}>
          {expanded ? 'Show Less' : 'Show More Levels'}
        </button>
      </div>
    </div>
  );
}

function TreeNode({ initials, name, vol, level }: { initials: string; name: string; vol: string; level: 'you' | 'l1' | 'l2' | 'l3' }) {
  const avatarStyles: Record<string, React.CSSProperties> = {
    you: { background: 'linear-gradient(135deg, var(--teal), var(--teal-light))', width: 48, height: 48, fontSize: 15, boxShadow: '0 4px 12px rgba(0,71,70,0.25)' },
    l1: { background: 'linear-gradient(135deg, #c8982a, #a07820)', boxShadow: '0 2px 8px rgba(200,152,42,0.2)' },
    l2: { background: 'linear-gradient(135deg, #9a7520, #7a5c18)' },
    l3: { background: 'linear-gradient(135deg, #6b5020, #5a4218)' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 12px', minWidth: 80 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 5,
        transition: 'transform 0.2s',
        ...avatarStyles[level],
      }}>{initials}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', textAlign: 'center' }}>{name}</div>
      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{vol}</div>
    </div>
  );
}
