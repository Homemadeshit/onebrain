const COUNTRIES = [
  { flag: '\u{1F1FF}\u{1F1E6}', name: 'South Africa', count: 342, pct: 27.4 },
  { flag: '\u{1F1FA}\u{1F1F8}', name: 'United States', count: 287, pct: 23.0 },
  { flag: '\u{1F1F2}\u{1F1FE}', name: 'Malaysia', count: 198, pct: 15.9 },
  { flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil', count: 156, pct: 12.5 },
  { flag: '\u{1F1EE}\u{1F1F3}', name: 'India', count: 124, pct: 9.9 },
  { flag: '\u{1F1F8}\u{1F1EA}', name: 'Sweden', count: 82, pct: 6.6 },
  { flag: '\u{1F1F8}\u{1F1EE}', name: 'Slovenia', count: 58, pct: 4.7 },
];

const total = COUNTRIES.reduce((s, c) => s + c.count, 0);

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)', borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.6)',
  backdropFilter: 'blur(40px)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)', padding: 24,
};

export default function CountriesInNetwork() {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Countries</div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>{total.toLocaleString()} members</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {COUNTRIES.map(c => (
          <div key={c.name} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 10,
            background: 'rgba(0,71,70,0.02)',
          }}>
            <span style={{ fontSize: 18 }}>{c.flag}</span>
            <span style={{ fontSize: 12, fontWeight: 500, flex: 1, color: 'var(--text)' }}>{c.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{c.count}</span>
            <div style={{ width: 40 }}>
              <div style={{
                height: 4, borderRadius: 2, background: 'rgba(0,71,70,0.06)', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${c.pct}%`, height: '100%', borderRadius: 2,
                  background: 'linear-gradient(90deg, var(--teal), var(--gold))',
                }} />
              </div>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-dim)', width: 32, textAlign: 'right' }}>{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
