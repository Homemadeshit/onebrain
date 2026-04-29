import { useEffect, useRef, useState } from 'react';
import type { SalesGeoData } from '../../types';

function fmtMoney(n: number): string {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + Math.floor(n / 1000).toLocaleString() + ',' + String(n % 1000).padStart(3, '0').slice(0, 3);
  return '$' + n.toLocaleString();
}

function fmtNum(n: number): string {
  return n.toLocaleString();
}

interface KpiCardsProps {
  data: SalesGeoData | null;
}

const FADE_OUT_MS = 150;
const FADE_IN_MS = 300;

export default function KpiCards({ data }: KpiCardsProps) {
  const [animating, setAnimating] = useState(false);
  const [displayData, setDisplayData] = useState<SalesGeoData | null>(data);
  const prevDataRef = useRef<SalesGeoData | null>(data);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip animation on initial render or when data becomes null
    if (data === prevDataRef.current) return;
    prevDataRef.current = data;

    if (!data) {
      setDisplayData(null);
      return;
    }

    // Phase 1: fade out
    setAnimating(true);

    // Clear any pending timeout from a rapid change
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Phase 2: after fade-out completes, swap data and fade in
    timeoutRef.current = setTimeout(() => {
      setDisplayData(data);
      setAnimating(false);
      timeoutRef.current = null;
    }, FADE_OUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [data]);

  const valueStyle: React.CSSProperties = {
    transition: `opacity ${animating ? FADE_OUT_MS : FADE_IN_MS}ms ease, transform ${animating ? FADE_OUT_MS : FADE_IN_MS}ms ease`,
    opacity: animating ? 0 : 1,
    transform: animating ? 'translateY(8px)' : 'translateY(0)',
  };

  if (!displayData) {
    return (
      <div className="kpi-row">
        {[0, 1, 2].map(i => (
          <div className="glass-card" key={i}>
            <div className="kpi-label">&mdash;</div>
            <div className="kpi-value">&mdash;</div>
            <div className="kpi-change"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="kpi-row">
      <div className="glass-card">
        <div className="kpi-label">Total Volume</div>
        <div className="kpi-value" style={valueStyle}>{fmtMoney(displayData.total_volume)}</div>
        <div className={`kpi-change ${displayData.volume_change.d}`} style={valueStyle}>
          {displayData.volume_change.d === 'up' ? '↑' : '↓'} {displayData.volume_change.v}% vs prior period
        </div>
      </div>
      <div className="glass-card">
        <div className="kpi-label">People in Organisation</div>
        <div className="kpi-value" style={valueStyle}>{fmtNum(displayData.total_people)}</div>
        <div className={`kpi-change ${displayData.people_change.d}`} style={valueStyle}>
          ↑ {fmtNum(displayData.people_change.v)} new this period
        </div>
      </div>
      <div className="glass-card">
        <div className="kpi-label">New Enrollments</div>
        <div className="kpi-value" style={valueStyle}>{fmtNum(displayData.new_enrollments)}</div>
        <div className={`kpi-change ${displayData.enroll_change.d}`} style={valueStyle}>
          {displayData.enroll_change.d === 'up' ? '↑' : '↓'} {displayData.enroll_change.v}% vs prior period
        </div>
      </div>
    </div>
  );
}
