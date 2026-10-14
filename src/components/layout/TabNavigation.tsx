import { type TabId, type TabConfig, TABS } from '../../types/navigation'
import {
  LayoutDashboard,
  FileSpreadsheet,
  Table2,
  Flame,
  Database,
} from 'lucide-react'

interface TabNavigationProps {
  activeTab: TabId
  onSelectTab: (tabId: TabId) => void
}

export function TabNavigation({ activeTab, onSelectTab }: TabNavigationProps) {
  const getIcon = (iconName: TabConfig['iconName']) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="h-4 w-4" />
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="h-4 w-4" />
      case 'Table2':
        return <Table2 className="h-4 w-4" />
      case 'Flame':
        return <Flame className="h-4 w-4" />
      case 'Database':
        return <Database className="h-4 w-4" />
    }
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2.5 no-scrollbar">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-sm ring-1 ring-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {getIcon(tab.iconName)}
                </span>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    {tab.rfCode}
                  </span>
                </div>

                {isActive && (
                  <span className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
