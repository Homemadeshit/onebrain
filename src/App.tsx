import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DashboardPage from './components/dashboard/DashboardPage'
import NetworkPage from './components/network/NetworkPage'

const OneBrainPage = lazy(() => import('./components/onebrain/OneBrainPage'))

export default function App() {
  const { pathname } = useLocation()
  const isOneBrain = pathname.startsWith('/onebrain')

  if (isOneBrain) {
    return (
      <>
        <Sidebar />
        <Suspense fallback={<div style={{ padding: 40, color: '#fff' }}>Loading OneBrain…</div>}>
          <Routes>
            <Route path="/onebrain" element={<OneBrainPage />} />
          </Routes>
        </Suspense>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <div className="main-content">
        <div className="dashboard">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </>
  )
}
