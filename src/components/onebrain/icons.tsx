import type { IconName } from './data'

interface Props {
  name: IconName
  size?: number
  color?: string
}

export default function TaskIcon({ name, size = 22, color = 'currentColor' }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'graph':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2" /><circle cx="18" cy="7" r="2" />
          <circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M7.5 7L10.5 10.5M16.5 8L13.5 11M7 16.5L10.5 13.5M16.5 16.5L13.5 13" />
        </svg>
      )
    case 'pulse':
      return <svg {...common}><path d="M3 12h4l2-6 4 12 2-6h6" /></svg>
    case 'radar':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" />
          <path d="M12 12L18 6" />
          <circle cx="12" cy="12" r="1.2" fill={color} />
        </svg>
      )
    case 'trend':
      return <svg {...common}><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-2 5-5 2 2-5z" />
        </svg>
      )
    case 'chart':
      return <svg {...common}><path d="M4 20V8M10 20V4M16 20v-9M22 20H2" /></svg>
    case 'mic':
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-5 4z" />
          <path d="M8 10h8M8 13h5" />
        </svg>
      )
    case 'inbox':
      return (
        <svg {...common}>
          <path d="M3 13l3-8h12l3 8M3 13v6h18v-6M3 13h5l1 2h6l1-2h5" />
        </svg>
      )
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16M9 7h7M9 11h7" />
        </svg>
      )
    default:
      return <svg {...common}><circle cx="12" cy="12" r="6" /></svg>
  }
}
