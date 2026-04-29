export type PillarId = 'sees' | 'predicts' | 'supports'

export interface Pillar {
  id: PillarId
  name: string
  subtitle: string
  color: string
  soft: string
  description: string
}

export interface AgentTask {
  id: string
  pillar: PillarId
  label: string
  icon: IconName
  blurb: string
}

export type IconName =
  | 'graph' | 'pulse' | 'radar' | 'trend' | 'compass'
  | 'chart' | 'mic' | 'chat' | 'inbox' | 'book'

export interface Kpi {
  label: string
  value: string
  delta: string
  negative?: boolean
}

export interface ActivityRow {
  time: string
  text: string
  tag: string
  score: string
}

export interface DashboardData {
  kpis: [Kpi, Kpi, Kpi, Kpi]
  chartLabel: string
  pts: number[]
  inputs: string[]
  rows: ActivityRow[]
}

export const PILLARS: Record<PillarId, Pillar> = {
  sees: {
    id: 'sees',
    name: 'Sees',
    subtitle: 'Network Intelligence',
    color: 'var(--ob-sees)',
    soft: 'var(--ob-sees-soft)',
    description: 'Maps the distributor network, surfaces patterns, watches the field in real time.',
  },
  predicts: {
    id: 'predicts',
    name: 'Predicts',
    subtitle: 'Predictive Layer',
    color: 'var(--ob-predicts)',
    soft: 'var(--ob-predicts-soft)',
    description: 'Forecasts behavior, ranks risk and opportunity, tells you what is next.',
  },
  supports: {
    id: 'supports',
    name: 'Supports',
    subtitle: 'Customer & Distributor Support',
    color: 'var(--ob-supports)',
    soft: 'var(--ob-supports-soft)',
    description: 'Voice and chat agents that resolve, route, and escalate across every channel.',
  },
}

export const TASKS: AgentTask[] = [
  { id: 'network-map',   pillar: 'sees',     label: 'Network',         icon: 'graph',   blurb: 'Live topology of every distributor, sub-distributor, and downline.' },
  { id: 'anomaly',       pillar: 'sees',     label: 'Anomalies',       icon: 'pulse',   blurb: 'Flags unusual activity in transactions, onboarding, and KYC.' },
  { id: 'lead-signals',  pillar: 'sees',     label: 'Leads',           icon: 'radar',   blurb: 'Surfaces high-intent prospects from inbound and network behavior.' },
  { id: 'churn',         pillar: 'predicts', label: 'Churn',           icon: 'trend',   blurb: 'Predicts which distributors and customers are at risk this quarter.' },
  { id: 'next-best',     pillar: 'predicts', label: 'Next Action',     icon: 'compass', blurb: 'Recommends the next move for each rep, every morning.' },
  { id: 'aum-forecast',  pillar: 'predicts', label: 'AUM Forecast',    icon: 'chart',   blurb: '90-day rolling forecast of assets under management by segment.' },
  { id: 'voice-agent',   pillar: 'supports', label: 'Voice',           icon: 'mic',     blurb: 'Inbound and outbound voice support across multiple languages.' },
  { id: 'chat-copilot',  pillar: 'supports', label: 'Copilot',         icon: 'chat',    blurb: 'In-app assistant for distributors — quotes, KYC, claims, status.' },
  { id: 'ticket-triage', pillar: 'supports', label: 'Support Tickets', icon: 'inbox',   blurb: 'Routes, summarizes, and drafts replies for every customer ticket.' },
  { id: 'knowledge',     pillar: 'supports', label: 'Knowledge',       icon: 'book',    blurb: 'Self-updating answer bank from policies, circulars, and past cases.' },
]

export const DASHBOARDS: Record<string, DashboardData> = {
  'network-map': {
    kpis: [
      { label: 'Distributors', value: '124,080', delta: '+1,840' },
      { label: 'Sub-distributors', value: '479,200', delta: '+6,120' },
      { label: 'Active downlines', value: '87,320', delta: '+2.1%' },
      { label: 'Network depth', value: '6 tiers', delta: 'stable' },
    ],
    chartLabel: 'Network growth',
    pts: [22, 24, 25, 28, 30, 32, 31, 34, 36, 38, 40, 42, 44, 46, 49, 51, 54, 56, 60, 62],
    inputs: ['CRM', 'Distributor portal', 'Onboarding events', 'KYC vault'],
    rows: [
      { time: '14:22', text: 'Mapped 184 new sub-distributor relationships across NA region', tag: 'mapped',  score: '0.97' },
      { time: '13:11', text: 'Identified isolated cluster — 12 distributors under one parent ID', tag: 'cluster', score: '0.89' },
      { time: '11:40', text: 'Refreshed downline aggregates for 87,320 active branches',   tag: 'refresh', score: '1.00' },
      { time: '10:08', text: 'Surfaced 470 dormant relationships ready to reactivate',      tag: 'dormant', score: '0.84' },
    ],
  },
  'anomaly': {
    kpis: [
      { label: 'Flagged today', value: '370', delta: '+60' },
      { label: 'High severity', value: '14', delta: '+1', negative: true },
      { label: 'False-positive rate', value: '6.2%', delta: '-0.8%' },
      { label: 'Mean time to flag', value: '42s', delta: '-7s' },
    ],
    chartLabel: 'Anomalies / day',
    pts: [12, 18, 14, 22, 16, 28, 19, 24, 17, 31, 20, 26, 22, 29, 24, 33, 28, 36, 31, 37],
    inputs: ['Transaction stream', 'KYC events', 'Login telemetry', 'Bank webhooks'],
    rows: [
      { time: '14:22', text: 'Unusual transaction cluster in West region — $14.2M',     tag: 'high',     score: '0.94' },
      { time: '13:55', text: 'Repeat KYC mismatch on Tax ID ****1F',                     tag: 'flagged',  score: '0.88' },
      { time: '13:02', text: 'Velocity spike from distributor #DST-44120',                tag: 'flagged',  score: '0.81' },
      { time: '12:14', text: 'Login anomaly cleared — geo match confirmed',               tag: 'cleared',  score: '0.71' },
    ],
  },
  'lead-signals': {
    kpis: [
      { label: 'Active leads', value: '12,840', delta: '+580' },
      { label: 'High-intent', value: '2,120', delta: '+190' },
      { label: 'Avg. score', value: '0.74', delta: '+0.03' },
      { label: 'Conv. last 7d', value: '8.4%', delta: '+1.1%' },
    ],
    chartLabel: 'Inbound lead intent',
    pts: [42, 44, 41, 48, 50, 47, 53, 56, 52, 58, 61, 64, 60, 67, 70, 72, 68, 74, 78, 82],
    inputs: ['Website forms', 'WhatsApp inbox', 'Inbound calls', 'Distributor referrals'],
    rows: [
      { time: '14:18', text: 'Surfaced 120 high-intent prospects from inbound network',  tag: 'opportunity', score: '0.91' },
      { time: '13:30', text: 'Lead L-44829 reactivated — 3 site visits in 24h',           tag: 'warming',     score: '0.86' },
      { time: '12:01', text: 'Cluster of 280 mid-ticket signals across NA mid-market',    tag: 'cluster',     score: '0.79' },
      { time: '10:48', text: 'Routed 470 leads to nearest distributor by geo',            tag: 'routed',      score: '0.93' },
    ],
  },
  'churn': {
    kpis: [
      { label: 'At-risk customers', value: '19,480', delta: '+620' },
      { label: 'At-risk distributors', value: '1,840', delta: '-120' },
      { label: 'Recoverable AUM', value: '$2.84 M', delta: '+$220 K' },
      { label: 'Save rate (30d)', value: '38%', delta: '+4%' },
    ],
    chartLabel: 'Predicted churn risk',
    pts: [55, 58, 60, 57, 62, 64, 61, 67, 69, 66, 71, 68, 73, 75, 72, 77, 74, 79, 76, 81],
    inputs: ['Activity logs', 'Service tickets', 'Portfolio drift', 'Sentiment'],
    rows: [
      { time: '14:00', text: '1,840 distributors flagged at-risk this quarter',          tag: 'risk',      score: '0.92' },
      { time: '12:42', text: 'Customer C-9920 churn risk dropped after outreach',        tag: 'recovered', score: '0.78' },
      { time: '11:18', text: 'New cohort: 280 customers showing redemption signals',     tag: 'cohort',    score: '0.85' },
      { time: '09:36', text: 'Forecast revised — Q3 churn 6.2% (was 7.1%)',              tag: 'updated',   score: '0.88' },
    ],
  },
  'next-best': {
    kpis: [
      { label: 'Recommendations / day', value: '42,100', delta: '+3,120' },
      { label: 'Acceptance rate', value: '64%', delta: '+5%' },
      { label: 'Reps active', value: '8,920', delta: '+110' },
      { label: 'Avg. uplift', value: '+18%', delta: '+2%' },
    ],
    chartLabel: 'Recommendation acceptance',
    pts: [50, 52, 54, 51, 56, 58, 55, 60, 62, 59, 64, 66, 63, 67, 69, 66, 70, 72, 69, 73],
    inputs: ['CRM', 'Past outcomes', 'Calendar', 'Lead intent score'],
    rows: [
      { time: '14:10', text: '42,100 morning recommendations dispatched to reps',        tag: 'sent',     score: '1.00' },
      { time: '13:24', text: 'Top suggestion: reactivate 470 dormant accounts in NYC',    tag: 'priority', score: '0.91' },
      { time: '12:08', text: 'Acceptance up 5% vs. last week — outreach playbook v3',    tag: 'updated',  score: '0.87' },
      { time: '10:32', text: 'Replaced low-uplift suggestions for 2,180 reps',            tag: 'tuned',    score: '0.82' },
    ],
  },
  'aum-forecast': {
    kpis: [
      { label: 'Current AUM', value: '$184.2 M', delta: '+$4.2 M' },
      { label: '90-day forecast', value: '$198.4 M', delta: '+7.7%' },
      { label: 'Confidence', value: '0.91', delta: '+0.04' },
      { label: 'Variance band', value: '±2.4%', delta: '-0.3%' },
    ],
    chartLabel: 'AUM trajectory ($ M)',
    pts: [120, 124, 130, 128, 134, 138, 142, 145, 148, 152, 156, 160, 162, 167, 171, 174, 178, 182, 186, 190],
    inputs: ['Holdings', 'NAV feed', 'Net flows', 'Macro indicators'],
    rows: [
      { time: '14:00', text: 'Forecast updated — Q3 AUM $198.4 M (±2.4%)',                tag: 'forecast', score: '0.91' },
      { time: '12:36', text: 'Equity segment up 9.2% MoM, debt flat',                     tag: 'segment',  score: '0.84' },
      { time: '11:04', text: 'New cohort: HNI inflows accelerating across APAC',           tag: 'cohort',   score: '0.79' },
      { time: '09:22', text: 'Model retrained with last 30 days of flow data',             tag: 'trained',  score: '0.95' },
    ],
  },
  'voice-agent': {
    kpis: [
      { label: 'Calls today', value: '84,200', delta: '+6,120' },
      { label: 'AI handled', value: '78%', delta: '+4%' },
      { label: 'CSAT', value: '4.6 / 5', delta: '+0.1' },
      { label: 'Avg. handle time', value: '2m 18s', delta: '-22s' },
    ],
    chartLabel: 'Voice call volume',
    pts: [60, 64, 58, 70, 66, 74, 68, 78, 72, 82, 76, 86, 80, 88, 84, 92, 86, 94, 90, 96],
    inputs: ['Telephony', 'IVR routing', 'Call transcripts', 'Customer profile'],
    rows: [
      { time: '14:22', text: 'Peak hour — 6,120 calls handled, 78% by AI',                tag: 'peak',      score: '0.96' },
      { time: '13:30', text: 'New language model live: Portuguese (β)',                   tag: 'launched',  score: '0.88' },
      { time: '12:14', text: 'Escalated 18 sensitive cases to human agents',              tag: 'escalated', score: '0.84' },
      { time: '10:42', text: 'Resolved 24,000 portfolio queries end-to-end',              tag: 'resolved',  score: '0.93' },
    ],
  },
  'chat-copilot': {
    kpis: [
      { label: 'Daily active reps', value: '14,128', delta: '+820' },
      { label: 'Queries / day', value: '384,200', delta: '+9%' },
      { label: 'First-reply accuracy', value: '94%', delta: '+1%' },
      { label: 'Avg. response', value: '1.2s', delta: '-0.1s' },
    ],
    chartLabel: 'Copilot usage',
    pts: [30, 34, 32, 38, 36, 42, 40, 46, 44, 50, 48, 54, 52, 58, 56, 62, 60, 66, 64, 70],
    inputs: ['Distributor app', 'Policy docs', 'Quote engine', 'Case history'],
    rows: [
      { time: '14:18', text: 'Drafted 4,120 distributor responses across 12 languages',   tag: 'drafted',   score: '0.95' },
      { time: '13:02', text: 'Resolved 1,280 KYC status questions without handoff',       tag: 'resolved',  score: '0.92' },
      { time: '11:48', text: 'Quote suggestions improved match-rate by 8%',                tag: 'tuned',     score: '0.86' },
      { time: '10:10', text: '820 new reps onboarded via in-app walkthrough',              tag: 'onboarded', score: '0.90' },
    ],
  },
  'ticket-triage': {
    kpis: [
      { label: 'Tickets today', value: '21,840', delta: '+3,180' },
      { label: 'Auto-resolved', value: '47%', delta: '+6%' },
      { label: 'Avg. first response', value: '38s', delta: '-12s' },
      { label: 'Backlog', value: '920', delta: '-440' },
    ],
    chartLabel: 'Ticket volume vs. resolution',
    pts: [70, 72, 68, 76, 73, 80, 77, 84, 81, 88, 84, 92, 88, 95, 91, 98, 94, 102, 98, 104],
    inputs: ['Email', 'Web form', 'WhatsApp', 'In-app chat'],
    rows: [
      { time: '14:10', text: 'Triaged 3,180 tickets — 47% auto-resolved',                tag: 'resolved', score: '0.94' },
      { time: '13:00', text: 'Routed 220 high-priority cases to senior pod',              tag: 'routed',   score: '0.89' },
      { time: '11:45', text: 'Drafted replies for 1,840 portfolio-status queries',        tag: 'drafted',  score: '0.91' },
      { time: '09:20', text: 'Backlog cleared overnight — 440 cases resolved',            tag: 'cleared',  score: '0.96' },
    ],
  },
  'knowledge': {
    kpis: [
      { label: 'Articles indexed', value: '48,200', delta: '+620' },
      { label: 'Coverage', value: '93.4%', delta: '+1.2%' },
      { label: 'Stale content', value: '470', delta: '-180' },
      { label: 'Search satisfaction', value: '0.89', delta: '+0.03' },
    ],
    chartLabel: 'Knowledge freshness',
    pts: [80, 82, 81, 84, 83, 86, 85, 88, 87, 90, 89, 91, 90, 92, 91, 93, 92, 94, 93, 95],
    inputs: ['Policies', 'Regulator circulars', 'Past tickets', 'Internal wikis'],
    rows: [
      { time: '14:00', text: 'Indexed 62 new articles from this week’s circulars',  tag: 'indexed', score: '0.96' },
      { time: '12:30', text: 'Flagged 18 stale articles for review',                      tag: 'stale',   score: '0.81' },
      { time: '11:08', text: 'Auto-merged 7 duplicate KYC explainers',                    tag: 'merged',  score: '0.88' },
      { time: '09:42', text: 'Search satisfaction up to 0.89 after re-ranking',           tag: 'tuned',   score: '0.92' },
    ],
  },
}
