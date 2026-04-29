import { Routes, Route, Navigate } from 'react-router-dom'
import OneBrainPage from './components/onebrain/OneBrainPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OneBrainPage />} />
      <Route path="/onebrain" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
