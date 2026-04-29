const ACTIVITIES = [
  { initials: 'SL', color: 'linear-gradient(135deg, #c8982a, #a07820)', text: 'Sofia L.', action: 'upgraded to Premium', time: '2m ago', icon: '↑' },
  { initials: 'CM', color: 'linear-gradient(135deg, #006564, #004746)', text: 'Carlos M.', action: 'made a sale — $420', time: '8m ago', icon: '$' },
  { initials: 'ED', color: 'linear-gradient(135deg, #b8882a, #9a7520)', text: 'Emma D.', action: 'reached Builder rank', time: '23m ago', icon: '★' },
  { initials: 'YT', color: 'linear-gradient(135deg, #9a7520, #7a5c18)', text: 'Yuki T.', action: 'enrolled 2 new reps', time: '1h ago', icon: '+' },
  { initials: 'DO', color: 'linear-gradient(135deg, #7a5c18, #5a4218)', text: 'David O.', action: 'purchased Elite pack', time: '2h ago', icon: '◆' },
];

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)', borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.6)',
  backdropFilter: 'blur(40px)',
  boxShadow: '0 2px 20px rgba(0,0,0,0.08)', padding: 24,
};

export default function ActivityFeed() {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Activity</div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 500 }}>Live</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
        {ACTIVITIES.map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(0,71,70,0.02)', transition: 'background 0.15s',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: a.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>{a.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--text)' }}>
                <span style={{ fontWeight: 600 }}>{a.text}</span>{' '}{a.action}
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', flexShrink: 0, whiteSpace: 'nowrap' }}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
