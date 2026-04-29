import TaskIcon from './icons'
import { DASHBOARDS, PILLARS, type AgentTask } from './data'

interface KpiProps {
  label: string
  value: string
  delta: string
  negative?: boolean
}

function KPI({ label, value, delta, negative }: KpiProps) {
  return (
    <div className="ob-kpi">
      <div className="ob-mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ob-ink-2)' }}>{label}</div>
      <div className="ob-serif ob-kpi-value">{value}</div>
      <div style={{
        marginTop: 6, fontSize: 11.5,
        color: negative ? '#b8643a' : '#4a6b3f',
        fontWeight: 500,
      }}>{delta} vs. last period</div>
    </div>
  )
}

function SparkChart({ color, pts }: { color: string; pts: number[] }) {
  const w = 720, h = 200, pad = 8
  const max = Math.max(...pts), min = Math.min(...pts)
  const sx = (i: number) => pad + (i / (pts.length - 1)) * (w - pad * 2)
  const sy = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
  const path = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i)} ${sy(v)}`).join(' ')
  const area = `${path} L ${sx(pts.length - 1)} ${h - pad} L ${sx(0)} ${h - pad} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 220 }}>
      <defs>
        <linearGradient id="ob-sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1={pad} x2={w - pad}
          y1={pad + i * (h - pad * 2) / 3}
          y2={pad + i * (h - pad * 2) / 3}
          stroke="var(--ob-rule)" strokeDasharray="2 4"/>
      ))}
      <path d={area} fill="url(#ob-sparkfill)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((v, i) => (
        <circle key={i} cx={sx(i)} cy={sy(v)} r={i === pts.length - 1 ? 4 : 0} fill={color}/>
      ))}
    </svg>
  )
}

interface OneBrainDashboardProps {
  task: AgentTask
  onBack: () => void
}

export default function OneBrainDashboard({ task, onBack }: OneBrainDashboardProps) {
  const pillar = PILLARS[task.pillar]
  const data = DASHBOARDS[task.id] || DASHBOARDS['anomaly']

  return (
    <div className="ob-dash" style={{
      position: 'absolute', inset: 0,
      background: 'var(--ob-bg)',
      zIndex: 20,
      display: 'flex', flexDirection: 'column',
      animation: 'wq-dash-in 320ms cubic-bezier(.2,.7,.2,1)',
      overflow: 'hidden',
    }}>
      <div className="ob-dash-topbar">
        <div className="ob-dash-topbar-left">
          <button className="ob-dash-back" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            <span className="ob-dash-back-label">Back to OneBrain</span>
          </button>
          <div className="ob-dash-divider"/>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: pillar.soft, color: pillar.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TaskIcon name={task.icon} size={18} color={pillar.color}/>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="ob-mono ob-dash-pillar-tag" style={{ color: pillar.color }}>
                {pillar.name} · {pillar.subtitle}
              </span>
            </div>
            <div className="ob-serif ob-dash-title">{task.label}</div>
          </div>
        </div>
        <div className="ob-dash-status">
          <span className="ob-dash-live">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a6b3f' }}/>
            Live
          </span>
          <span className="ob-mono ob-dash-updated">
            UPDATED 2m AGO
          </span>
        </div>
      </div>

      <div className="ob-dash-body">
        <KPI {...data.kpis[0]}/>
        <KPI {...data.kpis[1]}/>
        <KPI {...data.kpis[2]}/>
        <KPI {...data.kpis[3]}/>

        <div className="ob-dash-chart">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div className="ob-mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ob-ink-2)' }}>{data.chartLabel}</div>
              <div className="ob-serif" style={{ fontSize: 20, marginTop: 4 }}>Last 90 days</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['7D', '30D', '90D', 'YTD'] as const).map((p, i) => (
                <button key={p} style={{
                  padding: '5px 10px', borderRadius: 8,
                  border: '1px solid var(--ob-rule)',
                  background: i === 2 ? pillar.color : 'transparent',
                  color: i === 2 ? '#fff' : 'var(--ob-ink-2)',
                  fontSize: 11, fontFamily: 'inherit', cursor: 'pointer',
                }}>{p}</button>
              ))}
            </div>
          </div>
          <SparkChart color={pillar.color} pts={data.pts}/>
        </div>

        <div className="ob-dash-side">
          <div className="ob-mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ob-ink-2)' }}>About</div>
          <div className="ob-serif" style={{ fontSize: 20, marginTop: 4, marginBottom: 10 }}>What this agent does</div>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ob-ink-2)', margin: 0, marginBottom: 18 }}>
            {task.blurb}
          </p>
          <div className="ob-mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ob-ink-2)', marginBottom: 8 }}>Inputs</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {data.inputs.map(s => (
              <span key={s} style={{
                padding: '4px 10px', borderRadius: 999,
                background: 'var(--ob-bg-2)', fontSize: 11, color: 'var(--ob-ink-2)',
              }}>{s}</span>
            ))}
          </div>
          <button style={{
            width: '100%', padding: '11px 14px', borderRadius: 10,
            border: 'none', background: pillar.color, color: '#fff',
            fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>Open in workspace →</button>
        </div>

        <div className="ob-dash-activity">
          <div className="ob-mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ob-ink-2)' }}>Recent</div>
          <div className="ob-serif" style={{ fontSize: 20, marginTop: 4, marginBottom: 14 }}>Latest from this agent</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.rows.map((r, i) => (
              <div key={i} className="ob-row" style={{
                borderTop: i === 0 ? 'none' : '1px solid var(--ob-rule)',
              }}>
                <span className="ob-mono ob-row-time">{r.time}</span>
                <span className="ob-row-text">{r.text}</span>
                <span className="ob-row-tag" style={{ color: pillar.color, background: pillar.soft }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: pillar.color }}/>
                  {r.tag}
                </span>
                <span className="ob-row-score">{r.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
