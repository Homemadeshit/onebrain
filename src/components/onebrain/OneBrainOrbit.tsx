import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import TaskIcon from './icons'
import { PILLARS, TASKS, type AgentTask, type PillarId } from './data'

interface OrbitTweaks {
  radius: number
  bubbleSize: number
  drift: boolean
  driftSpeed: number
  bubbleMotion: boolean
  pulse: boolean
}

const DEFAULT_TWEAKS: OrbitTweaks = {
  radius: 0.3,
  bubbleSize: 110,
  drift: false,
  driftSpeed: 1,
  bubbleMotion: true,
  pulse: true,
}

interface BubbleSeed {
  bobAmp: number; bobFreq: number; bobPhase: number
  swayAmp: number; swayFreq: number; swayPhase: number
  scaleAmp: number; scaleFreq: number; scalePhase: number
  driftLag: number
}

function useResponsiveSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState({ w: 1000, h: 700 })
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function getBubblePositions(
  count: number, w: number, h: number, cx: number, cy: number,
  radiusScale = 0.42, rotation = 0
) {
  const r = Math.min(w, h) * radiusScale
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2 + rotation
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      angle,
    }
  })
}

function useBubbleSeeds(count: number): BubbleSeed[] {
  return useMemo(() => Array.from({ length: count }, (_, i) => {
    const r = (s: number) => {
      const x = Math.sin(i * 9301 + s * 49297) * 233280
      return x - Math.floor(x)
    }
    return {
      bobAmp: 4 + r(1) * 6,
      bobFreq: 0.05 + r(2) * 0.07,
      bobPhase: r(3) * Math.PI * 2,
      swayAmp: 3 + r(4) * 5,
      swayFreq: 0.035 + r(5) * 0.055,
      swayPhase: r(6) * Math.PI * 2,
      scaleAmp: 0.015 + r(7) * 0.025,
      scaleFreq: 0.06 + r(8) * 0.08,
      scalePhase: r(9) * Math.PI * 2,
      driftLag: r(10) * 0.4,
    }
  }), [count])
}

interface BubbleProps {
  task: AgentTask
  x: number; y: number
  cx: number; cy: number
  size: number
  seed?: BubbleSeed
  time: number
  motionEnabled: boolean
  isHover: boolean
  isActive: boolean
  isDimmed: boolean
  forceLabelBelow: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}

function Bubble({
  task, x, y, cx, cy, size, seed, time, motionEnabled,
  isHover, isActive, isDimmed, forceLabelBelow, onHover, onLeave, onClick,
}: BubbleProps) {
  const pillar = PILLARS[task.pillar]

  // Drag state: pointer can grab and toss the bubble; on release it springs
  // back to its base orbit position with a tiny overshoot.
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [releasing, setReleasing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ px: number; py: number; sx: number; sy: number; moved: boolean } | null>(null)
  const releaseTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (releaseTimerRef.current !== null) clearTimeout(releaseTimerRef.current)
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    if (releaseTimerRef.current !== null) {
      clearTimeout(releaseTimerRef.current)
      releaseTimerRef.current = null
    }
    setReleasing(false)
    dragStartRef.current = {
      px: e.clientX, py: e.clientY,
      sx: dragOffset.x, sy: dragOffset.y,
      moved: false,
    }
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragStartRef.current
    if (!s) return
    const nx = e.clientX - s.px + s.sx
    const ny = e.clientY - s.py + s.sy
    if (!s.moved && Math.hypot(e.clientX - s.px, e.clientY - s.py) > 4) {
      s.moved = true
      setIsDragging(true)
    }
    if (s.moved) setDragOffset({ x: nx, y: ny })
  }
  const handlePointerUp = () => {
    const s = dragStartRef.current
    if (!s) return
    const wasDrag = s.moved
    dragStartRef.current = null
    setIsDragging(false)
    if (wasDrag) {
      setReleasing(true)
      setDragOffset({ x: 0, y: 0 })
      releaseTimerRef.current = window.setTimeout(() => {
        setReleasing(false)
        releaseTimerRef.current = null
      }, 460)
    } else {
      onClick()
    }
  }

  let dx = 0, dy = 0, wobbleScale = 1
  if (motionEnabled && seed) {
    dx = Math.cos(time * seed.swayFreq * Math.PI * 2 + seed.swayPhase) * seed.swayAmp
    dy = Math.sin(time * seed.bobFreq * Math.PI * 2 + seed.bobPhase) * seed.bobAmp
    wobbleScale = 1 + Math.sin(time * seed.scaleFreq * Math.PI * 2 + seed.scalePhase) * seed.scaleAmp
  }

  const interactScale = isActive ? 1.08 : isDragging ? 1.1 : isHover ? 1.05 : 1
  const finalScale = interactScale * wobbleScale

  const dxR = x - cx, dyR = y - cy
  const dist = Math.sqrt(dxR * dxR + dyR * dyR) || 1
  const ux = dxR / dist, uy = dyR / dist
  const labelOffset = size / 2 + 10
  let labelX: number, labelY: number, labelTransform: string
  let labelAlign: 'flex-start' | 'flex-end' | 'center'

  if (forceLabelBelow) {
    // Phone mode: label always sits directly below the bubble. Avoids
    // horizontal clipping on side-of-orbit bubbles on small viewports.
    labelX = 0
    labelY = labelOffset
    labelTransform = 'translate(-50%, 0)'
    labelAlign = 'center'
  } else {
    labelX = ux * labelOffset
    labelY = uy * labelOffset
    const verticalDominant = Math.abs(uy) > Math.abs(ux)
    if (verticalDominant) {
      labelTransform = uy < 0 ? 'translate(-50%, -100%)' : 'translate(-50%, 0)'
      labelAlign = 'center'
    } else {
      labelTransform = ux > 0 ? 'translate(0, -50%)' : 'translate(-100%, -50%)'
      labelAlign = ux > 0 ? 'flex-start' : 'flex-end'
    }
  }

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'absolute',
        left: x + dx,
        top: y + dy,
        width: 0,
        height: 0,
        zIndex: isDragging ? 6 : isActive ? 5 : isHover ? 4 : 1,
        opacity: isDimmed ? 0.34 : 1,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
        transition: releasing
          ? 'transform 460ms cubic-bezier(.34,1.56,.64,1), opacity 240ms'
          : 'opacity 240ms',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      <button
        tabIndex={-1}
        style={{
          position: 'absolute',
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          border: `1.5px solid ${pillar.color}`,
          background: isActive
            ? `radial-gradient(circle at 32% 28%, ${pillar.color} 0%, ${pillar.color} 55%, ${pillar.color}dd 100%)`
            : `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 22%, ${pillar.soft} 60%, ${pillar.soft} 100%)`,
          color: isActive ? '#fff' : pillar.color,
          cursor: 'pointer',
          transition: 'background 240ms, color 240ms, box-shadow 240ms, border-color 240ms',
          transform: `scale(${finalScale})`,
          boxShadow: isActive
            ? `0 14px 32px -10px ${pillar.color}90, 0 2px 6px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.35)`
            : isHover
            ? `0 8px 20px -6px ${pillar.color}66, 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.7)`
            : `0 3px 10px -3px ${pillar.color}33, 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 1px rgba(255,255,255,0.7)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          outline: 'none',
        }}
      >
        <span aria-hidden style={{
          position: 'absolute',
          top: '10%', left: '16%',
          width: '38%', height: '26%',
          borderRadius: '50%',
          background: isActive
            ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.45), rgba(255,255,255,0) 70%)'
            : 'radial-gradient(ellipse at center, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
          filter: 'blur(0.5px)',
        }}/>
        <TaskIcon name={task.icon} size={28} color={isActive ? '#fff' : pillar.color}/>
      </button>

      <div style={{
        position: 'absolute',
        left: labelX,
        top: labelY,
        transform: labelTransform,
        display: 'flex',
        flexDirection: 'column',
        alignItems: labelAlign,
        gap: 1,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        {!forceLabelBelow && (
          <div className="ob-mono" style={{
            fontSize: 8.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: pillar.color,
            opacity: 0.75,
            lineHeight: 1,
          }}>
            {pillar.name}
          </div>
        )}
        <div style={{
          fontSize: forceLabelBelow ? 11 : 12.5,
          fontWeight: 600,
          color: 'var(--ob-ink)',
          letterSpacing: '-0.005em',
          lineHeight: 1.2,
        }}>
          {task.label}
        </div>
      </div>
    </div>
  )
}

function OrbitRing({ w, h, cx, cy, radiusScale }: { w: number; h: number; cx: number; cy: number; radiusScale: number }) {
  return (
    <svg width={w} height={h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <circle
        cx={cx} cy={cy}
        r={Math.min(w, h) * radiusScale}
        fill="none"
        stroke="var(--ob-rule)"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.55"
      />
    </svg>
  )
}

interface CenterLogoProps {
  pulse: boolean
  cx: number; cy: number
  isActive: boolean
  onTap: () => void
  onHold: () => void
  dimmed: boolean
  size?: number
  showCaption?: boolean
}

function CenterLogo({
  pulse, cx, cy, isActive, onTap, onHold, dimmed,
  size = 132, showCaption = true,
}: CenterLogoProps) {
  const SIZE = size
  const holdTimerRef = useRef<number | null>(null)
  const heldRef = useRef(false)

  const startPress = () => {
    heldRef.current = false
    holdTimerRef.current = window.setTimeout(() => {
      heldRef.current = true
      onHold()
    }, 280)
  }
  const endPress = () => {
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    if (!heldRef.current) onTap()
  }
  const cancelPress = () => {
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    heldRef.current = false
  }
  return (
    <div style={{
      position: 'absolute',
      left: cx,
      top: cy,
      transform: 'translate(-50%, -50%)',
      width: SIZE, height: SIZE,
      zIndex: 6,
      pointerEvents: 'auto',
      opacity: dimmed ? 0.25 : 1,
      transition: 'opacity 280ms, transform 320ms cubic-bezier(.2,.7,.2,1)',
    }}>
      {pulse && !isActive && (
        <>
          <div style={{
            position: 'absolute', inset: -28, borderRadius: '50%',
            border: '1px solid rgba(184,138,58,0.35)',
            animation: 'wq-ring 3.2s ease-out infinite',
            pointerEvents: 'none',
          }}/>
          <div style={{
            position: 'absolute', inset: -28, borderRadius: '50%',
            border: '1px solid rgba(184,138,58,0.25)',
            animation: 'wq-ring 3.2s ease-out infinite 1.6s',
            pointerEvents: 'none',
          }}/>
        </>
      )}
      <div style={{
        position: 'absolute', inset: -40, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,138,58,0.18), transparent 65%)',
        animation: pulse ? 'wq-pulse 4s ease-in-out infinite' : 'none',
        pointerEvents: 'none',
      }}/>
      <button
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={cancelPress}
        onTouchStart={(e) => { e.preventDefault(); startPress() }}
        onTouchEnd={(e) => { e.preventDefault(); endPress() }}
        onTouchCancel={cancelPress}
        aria-label="Tap to ask, hold to speak"
        style={{
          position: 'absolute', inset: 0,
          width: SIZE, height: SIZE,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 30%, #3a5478 0%, #2f4a6b 40%, #1a2332 100%)',
          border: '1px solid rgba(184,138,58,0.45)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 18px 44px -16px rgba(20,30,50,0.55), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.18)',
          color: '#fff',
          padding: 0,
          transition: 'transform 220ms cubic-bezier(.2,.7,.2,1)',
          transform: isActive ? 'scale(0.92)' : 'scale(1)',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
        }}
      >
        <span aria-hidden style={{
          position: 'absolute',
          top: '12%', left: '18%',
          width: '36%', height: '24%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4), rgba(255,255,255,0) 70%)',
          filter: 'blur(2px)',
        }}/>
        <svg width="64" height="64" viewBox="0 0 80 80">
          <path d="M16 28 L24 56 L32 38 L40 56 L48 28" fill="none" stroke="#f4f1ea" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="58" cy="46" r="9" fill="none" stroke="#b88a3a" strokeWidth="3.4"/>
          <path d="M64 52 L70 58" stroke="#b88a3a" strokeWidth="3.4" strokeLinecap="round"/>
        </svg>
      </button>
      {showCaption && (
        <div style={{
          position: 'absolute',
          top: SIZE + 12,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          opacity: isActive ? 0 : 1,
          transition: 'opacity 200ms',
          pointerEvents: 'none',
        }}>
          <div className="ob-mono" style={{
            fontSize: 9.5,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ob-ink-2)',
            lineHeight: 1.4,
          }}>
            Tap to ask · Hold to speak
          </div>
        </div>
      )}
    </div>
  )
}

interface ChatOverlayProps {
  open: boolean
  cx: number; cy: number
  onClose: () => void
  isPhone: boolean
  initialVoiceMode: boolean
}

function ChatOverlay({ open, cx, cy, onClose, isPhone, initialVoiceMode }: ChatOverlayProps) {
  const [voiceMode, setVoiceMode] = useState(initialVoiceMode)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Each time the overlay opens, sync voice mode to the initial intent.
  useEffect(() => {
    if (open) setVoiceMode(initialVoiceMode)
  }, [open, initialVoiceMode])

  useEffect(() => {
    if (open && !voiceMode) {
      const t = setTimeout(() => inputRef.current?.focus(), 240)
      return () => clearTimeout(t)
    }
  }, [open, voiceMode])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(20, 25, 35, 0.42)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 11,
          animation: 'wq-fade-in 240ms ease-out',
          cursor: 'pointer',
        }}
      />
      <div style={{
        position: 'absolute',
        left: cx,
        top: cy + (isPhone ? 70 : 100),
        transform: 'translate(-50%, 0)',
        zIndex: 12,
        pointerEvents: 'auto',
        animation: 'wq-chat-in 320ms cubic-bezier(.2,.7,.2,1)',
        width: isPhone ? 'calc(100vw - 24px)' : 'auto',
      }}>
        <div style={{
          width: isPhone ? '100%' : 560,
          maxWidth: isPhone ? 'none' : 'calc(100vw - 32px)',
          background: 'var(--ob-card)',
          border: '1px solid var(--ob-rule)',
          borderRadius: isPhone ? 18 : 24,
          padding: voiceMode ? '20px 22px' : (isPhone ? '10px 12px' : '14px 16px'),
          boxShadow: '0 24px 60px -22px rgba(20,30,50,0.32), 0 4px 10px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: isPhone ? 8 : 12,
          transition: 'padding 240ms',
        }}>
          {!voiceMode ? (
            <>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'radial-gradient(circle at 32% 30%, #3a5478, #1a2332)',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 80 80">
                  <path d="M16 28 L24 56 L32 38 L40 56 L48 28" fill="none" stroke="#f4f1ea" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                ref={inputRef}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Ask OneBrain — show me at-risk distributors, draft a reply, forecast Q3 AUM…"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  color: 'var(--ob-ink)',
                  padding: '6px 0',
                }}
              />
              <button
                onClick={() => setVoiceMode(true)}
                title="Voice mode"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid var(--ob-rule)',
                  background: 'var(--ob-bg-2)',
                  color: 'var(--ob-ink)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="3" width="6" height="12" rx="3"/>
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>
                </svg>
              </button>
              <button
                onClick={() => value && setValue('')}
                title="Send"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: 'none',
                  background: value ? 'var(--ob-ink)' : 'var(--ob-bg-2)',
                  color: value ? '#fff' : 'var(--ob-ink-2)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 200ms',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>
            </>
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4, height: 32,
                flex: 1, justifyContent: 'center',
              }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} style={{
                    width: 3,
                    height: '100%',
                    borderRadius: 2,
                    background: 'var(--ob-sees)',
                    animation: `wq-wave 1.${4 + (i % 4)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.07}s`,
                    transformOrigin: 'center',
                  }}/>
                ))}
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
                fontSize: 12, color: 'var(--ob-ink-2)',
              }}>
                <span className="ob-mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ob-sees)' }}>
                  ● Listening
                </span>
                <span style={{ fontSize: 11 }}>Tap to stop</span>
              </div>
              <button
                onClick={() => setVoiceMode(false)}
                title="Back to text"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid var(--ob-rule)',
                  background: 'var(--ob-bg-2)',
                  color: 'var(--ob-ink)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </>
          )}
        </div>
        {!voiceMode && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6,
            marginTop: 12, justifyContent: 'center',
          }}>
            {(isPhone
              ? ['At-risk distributors', 'Forecast Q3 AUM']
              : [
                  'Distributors at risk this quarter',
                  'Summarize yesterday’s tickets',
                  'Forecast Q3 AUM',
                  'Draft outreach to dormant leads',
                ]
            ).map(s => (
              <button key={s}
                onClick={() => { setValue(s); inputRef.current?.focus() }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: '1px solid var(--ob-rule)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--ob-ink-2)',
                  fontSize: 11.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <button onClick={onClose} className="ob-mono" style={{
            background: 'transparent', border: 'none',
            color: 'var(--ob-ink-2)', fontSize: 11, fontFamily: 'inherit',
            cursor: 'pointer', letterSpacing: '0.06em',
          }}>
            ESC TO CLOSE
          </button>
        </div>
      </div>
    </>
  )
}

interface PillarLegendProps {
  active: PillarId | null
  onPick: (id: PillarId | null) => void
  compact?: boolean
}

function PillarLegend({ active, onPick, compact = false }: PillarLegendProps) {
  return (
    <div style={{
      display: 'flex',
      gap: compact ? 6 : 8,
      flexWrap: 'wrap',
      justifyContent: compact ? 'center' : 'flex-end',
    }}>
      {Object.values(PILLARS).map(p => {
        const isActive = active === p.id
        return (
          <button key={p.id}
            onClick={() => onPick(isActive ? null : p.id)}
            style={{
              display: 'flex', alignItems: 'center',
              gap: compact ? 6 : 8,
              padding: compact ? '5px 10px' : '8px 14px',
              borderRadius: 999,
              border: `1px solid ${isActive ? p.color : 'var(--ob-rule)'}`,
              background: isActive ? p.color : 'var(--ob-card)',
              color: isActive ? '#fff' : 'var(--ob-ink)',
              fontSize: compact ? 11 : 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 180ms',
              fontFamily: 'inherit',
            }}>
            <span style={{
              width: compact ? 6 : 8,
              height: compact ? 6 : 8,
              borderRadius: '50%',
              background: isActive ? '#fff' : p.color,
            }}/>
            <span style={{ fontWeight: 600 }}>{p.name}</span>
            {!compact && <span style={{ opacity: 0.72, fontWeight: 400 }}>{p.subtitle}</span>}
          </button>
        )
      })}
    </div>
  )
}

interface OneBrainOrbitProps {
  tweaks?: Partial<OrbitTweaks>
  onOpenTask: (task: AgentTask) => void
}

export default function OneBrainOrbit({ tweaks: tweaksOverride, onOpenTask }: OneBrainOrbitProps) {
  const baseTweaks: OrbitTweaks = { ...DEFAULT_TWEAKS, ...tweaksOverride }
  const stageRef = useRef<HTMLDivElement>(null)
  const { w, h } = useResponsiveSize(stageRef)
  const [chatOpen, setChatOpen] = useState(false)
  const [voiceIntent, setVoiceIntent] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [pillarFilter, setPillarFilter] = useState<PillarId | null>(null)
  const [rotation, setRotation] = useState(0)
  const [time, setTime] = useState(0)

  // Adapt sizing to viewport. Three rough tiers: phone (<560), tablet (<1024), desktop.
  const isPhone = w > 0 && w < 560
  const isTablet = w >= 560 && w < 1024
  const isMobile = isPhone || isTablet

  const bubbleSize = isPhone ? 64 : isTablet ? 78 : baseTweaks.bubbleSize

  useEffect(() => {
    if (!baseTweaks.drift && !baseTweaks.bubbleMotion) return
    let raf = 0
    let last = performance.now()
    let t = 0
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      t += dt
      setTime(t)
      if (baseTweaks.drift) {
        setRotation(r => r + dt * baseTweaks.driftSpeed * 0.05)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [baseTweaks.drift, baseTweaks.driftSpeed, baseTweaks.bubbleMotion])

  const seeds = useBubbleSeeds(TASKS.length)

  // Compact phone chrome: slim header, no pillar strip, slim footer.
  const HEADER_H = isPhone ? 56 : isTablet ? 96 : 132
  const FOOTER_H = isPhone ? 32 : 56
  const PILLAR_STRIP_H = isTablet ? 48 : 0
  const centerLogoSize = isPhone ? 72 : isTablet ? 100 : 132
  const topInset = HEADER_H + PILLAR_STRIP_H
  const cx = w / 2
  const cy = topInset + (h - topInset - FOOTER_H) / 2
  const stageW = w
  const stageH = Math.max(220, h - topInset - FOOTER_H)

  // Adaptive radius (in pixels) — clamp so bubbles + labels + caption fit.
  const labelRoom = isPhone ? 36 : isTablet ? 30 : 0
  const captionH = 28
  // Caption sits below center logo at SIZE/2 + 12 + textHeight. Bottom bubble
  // top is at R - bubbleSize/2. To avoid overlap: R >= centerLogoSize/2 + captionH + bubbleSize/2.
  const minRadiusForCaption = centerLogoSize / 2 + captionH + bubbleSize / 2
  const maxRadiusFromH = stageH / 2 - bubbleSize / 2 - labelRoom - 8
  const maxRadiusFromW = w / 2 - bubbleSize / 2 - (isPhone ? 8 : 60)
  const denom = Math.max(1, Math.min(stageW, stageH))
  const desiredPx = baseTweaks.radius * denom
  const radiusPx = Math.max(
    bubbleSize, // never shrink below the bubble itself
    Math.min(desiredPx, maxRadiusFromH, maxRadiusFromW)
  )
  const radius = radiusPx / denom
  const showCaption = radiusPx >= minRadiusForCaption

  const positions = useMemo(
    () => getBubblePositions(TASKS.length, stageW, stageH, cx, cy, radius, rotation),
    [stageW, stageH, cx, cy, radius, rotation]
  )

  const headerStyle: CSSProperties = {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: HEADER_H,
    padding: isPhone ? '12px 16px' : isTablet ? '14px 20px' : '20px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isMobile ? 12 : 24,
    borderBottom: '1px solid var(--ob-rule)',
    background: 'linear-gradient(to bottom, rgba(244,241,234,0.95), rgba(244,241,234,0.75))',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 8,
  }

  const footerStyle: CSSProperties = {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: FOOTER_H,
    padding: isPhone ? '0 14px' : '0 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderTop: '1px solid var(--ob-rule)',
    background: 'rgba(244,241,234,0.7)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 8,
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={headerStyle}>
        {isPhone ? (
          <>
            <div className="ob-serif" style={{
              fontSize: 20,
              lineHeight: 1,
              letterSpacing: '-0.015em',
            }}>
              OneBrain
            </div>
            <div className="ob-mono" style={{
              fontSize: 9,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ob-ink-2)',
            }}>
              10 agents
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <div className="ob-mono" style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ob-ink-2)',
              }}>
                10 active agents · 3 pillars
              </div>
              <div className="ob-serif" style={{
                fontSize: isTablet ? 26 : 32,
                lineHeight: 1.05,
                letterSpacing: '-0.015em',
              }}>
                OneBrain at a glance
              </div>
              <div style={{
                fontSize: isTablet ? 12 : 13,
                color: 'var(--ob-ink-2)',
                lineHeight: 1.4,
              }}>
                WealthQuest's corporate operating system — tap any agent to open it.
              </div>
            </div>
            {!isTablet && <PillarLegend active={pillarFilter} onPick={setPillarFilter} compact={false}/>}
          </>
        )}
      </div>

      {isTablet && (
        <div style={{
          position: 'absolute',
          top: HEADER_H,
          left: 0,
          right: 0,
          padding: '10px 16px',
          background: 'rgba(244,241,234,0.85)',
          borderBottom: '1px solid var(--ob-rule)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 7,
        }}>
          <PillarLegend active={pillarFilter} onPick={setPillarFilter} compact={true}/>
        </div>
      )}

      <div style={footerStyle}>
        <div style={{ display: 'flex', gap: isPhone ? 10 : 18, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#4a6b3f',
              boxShadow: '0 0 0 4px rgba(74,107,63,0.16)',
              animation: 'wq-blink 2s ease-in-out infinite',
            }}/>
            <span className="ob-mono" style={{ fontSize: isPhone ? 10 : 11, color: 'var(--ob-ink-2)', letterSpacing: '0.06em' }}>
              {isPhone ? 'ONLINE' : 'ALL SYSTEMS ONLINE'}
            </span>
          </div>
          {!isPhone && (
            <span className="ob-mono" style={{ fontSize: 11, color: 'var(--ob-ink-2)', letterSpacing: '0.06em' }}>
              v0.9 · APR 2026
            </span>
          )}
        </div>
        <span className="ob-mono" style={{ fontSize: isPhone ? 10 : 11, color: 'var(--ob-ink-2)', letterSpacing: '0.06em' }}>
          {isPhone ? 'ONEBRAIN' : 'ONEBRAIN · WEALTHQUEST'}
        </span>
      </div>

      <div ref={stageRef} style={{ position: 'absolute', inset: 0 }}>
        <OrbitRing w={w} h={h} cx={cx} cy={cy} radiusScale={radius}/>
        <CenterLogo
          pulse={baseTweaks.pulse}
          cx={cx} cy={cy}
          isActive={chatOpen}
          dimmed={false}
          onTap={() => { setVoiceIntent(false); setChatOpen(o => !o) }}
          onHold={() => { setVoiceIntent(true); setChatOpen(true) }}
          size={centerLogoSize}
          showCaption={showCaption}
        />
        {TASKS.map((t, i) => {
          const p = positions[i]
          const dimmedByFilter = pillarFilter && t.pillar !== pillarFilter
          const dimmedByFocus = hoverId !== null && hoverId !== t.id
          return (
            <Bubble
              key={t.id}
              task={t}
              x={p.x} y={p.y}
              cx={cx} cy={cy}
              size={bubbleSize}
              seed={seeds[i]}
              time={time + (seeds[i]?.driftLag || 0)}
              motionEnabled={baseTweaks.bubbleMotion}
              isHover={hoverId === t.id}
              isActive={false}
              isDimmed={Boolean(dimmedByFilter || dimmedByFocus)}
              forceLabelBelow={isPhone}
              onHover={() => setHoverId(t.id)}
              onLeave={() => setHoverId(null)}
              onClick={() => onOpenTask(t)}
            />
          )
        })}
      </div>

      <ChatOverlay
        open={chatOpen}
        cx={cx} cy={cy}
        onClose={() => setChatOpen(false)}
        isPhone={isPhone}
        initialVoiceMode={voiceIntent}
      />
    </div>
  )
}
