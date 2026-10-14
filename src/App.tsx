import { useState } from 'react'
import { type TabId, TABS } from './types/navigation'
import { Header } from './components/layout/Header'
import { TabNavigation } from './components/layout/TabNavigation'
import { Footer } from './components/layout/Footer'
import { OverviewView } from './features/overview/OverviewView'
import { FormBenchmarkView } from './features/form-benchmark/FormBenchmarkView'
import { DenseTableView } from './features/dense-table/DenseTableView'
import { RaceConditionView } from './features/race-condition/RaceConditionView'
import { ServerCacheView } from './features/server-cache/ServerCacheView'

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0]

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView onNavigate={setActiveTab} />
      case 'form-benchmark':
        return <FormBenchmarkView />
      case 'dense-table':
        return <DenseTableView />
      case 'race-condition':
        return <RaceConditionView />
      case 'server-cache':
        return <ServerCacheView />
      default:
        return <OverviewView onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-200">
      <Header currentTabLabel={currentTab.label} rfCode={currentTab.rfCode} />
      <TabNavigation activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </main>

      <Footer />
    </div>
  )
}

export default App
