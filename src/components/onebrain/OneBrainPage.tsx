import { useState } from 'react'
import OneBrainOrbit from './OneBrainOrbit'
import OneBrainDashboard from './OneBrainDashboard'
import type { AgentTask } from './data'
import './onebrain.css'

export default function OneBrainPage() {
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null)
  return (
    <div className="ob-root">
      <OneBrainOrbit onOpenTask={setActiveTask}/>
      {activeTask && (
        <OneBrainDashboard task={activeTask} onBack={() => setActiveTask(null)}/>
      )}
    </div>
  )
}
