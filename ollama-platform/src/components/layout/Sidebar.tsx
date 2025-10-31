import React from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Bot,
  Activity,
  Settings,
  FileText,
  Workflow,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    id: 'agents',
    label: 'My Agents',
    icon: Bot,
    badge: null
  },
  {
    id: 'create-agent',
    label: 'Create Agent',
    icon: Plus,
    badge: 'New'
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: FileText,
    badge: null
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: Workflow,
    badge: null
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: Activity,
    badge: null
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    badge: null
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    badge: null
  }
]

export function Sidebar({ isCollapsed, onToggleCollapse, activeTab, onTabChange }: SidebarProps) {
  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 transition-all duration-300 ease-in-out flex flex-col h-full",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Navigation</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 hover:bg-slate-700 rounded-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start transition-all duration-200 rounded-xl",
                isCollapsed ? "px-3" : "px-4",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn(
                "flex-shrink-0",
                isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3",
                isActive ? "text-blue-300" : "text-slate-400"
              )} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5 border-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Pro Features</h4>
            <p className="text-xs text-slate-400 mb-3">
              Unlock advanced monitoring, unlimited agents, and premium templates.
            </p>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}