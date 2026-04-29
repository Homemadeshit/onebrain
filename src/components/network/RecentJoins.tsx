const JOINS = [
  { initials: 'AK', color: 'linear-gradient(135deg, #004746, #006564)', name: 'Ayanda K.', country: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}', time: '5m ago' },
  { initials: 'JR', color: 'linear-gradient(135deg, #a07820, #c8982a)', name: 'Juan R.', country: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', time: '18m ago' },
  { initials: 'NW', color: 'linear-gradient(135deg, #c8982a, #dbb44a)', name: 'Nina W.', country: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', time: '32m ago' },
  { initials: 'TL', color: 'linear-gradient(135deg, #b8882a, #9a7520)', name: 'Tan L.', country: 'Malaysia', flag: '\u{1F1F2}\u{1F1FE}', time: '1h ago' },
  { initials: 'PS', color: 'linear-gradient(135deg, #006564, #004746)', name: 'Priya S.', country: 'India', flag: '\u{1F1EE}\u{1F1F3}', time: '1h ago' },
];

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)', borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.6)',
  backdropFilter: 'blur(40px)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)', padding: 24,
};

export default function RecentJoins() {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Recent Joins</div>
        <div style={{
          padding: '3px 10px', borderRadius: 20,
          background: 'rgba(26,138,90,0.08)', color: 'var(--green)',
          fontSize: 10, fontWeight: 600,
        }}>+5 today</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
        {JOINS.map((j, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(0,71,70,0.02)',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: j.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>{j.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{j.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{j.flag} {j.country}</div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', flexShrink: 0 }}>{j.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
