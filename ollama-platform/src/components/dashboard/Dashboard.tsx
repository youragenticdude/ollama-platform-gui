import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Bot, 
  TrendingUp, 
  AlertTriangle, 
  Play, 
  Pause, 
  Settings,
  Eye,
  MoreHorizontal,
  Zap,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data for charts
const performanceData = [
  { name: '00:00', response_time: 120, accuracy: 95, engagement: 78 },
  { name: '04:00', response_time: 115, accuracy: 97, engagement: 82 },
  { name: '08:00', response_time: 130, accuracy: 94, engagement: 85 },
  { name: '12:00', response_time: 125, accuracy: 96, engagement: 88 },
  { name: '16:00', response_time: 110, accuracy: 98, engagement: 92 },
  { name: '20:00', response_time: 105, accuracy: 97, engagement: 87 },
]

const activityData = [
  { name: 'Mon', active: 12, total: 15 },
  { name: 'Tue', active: 14, total: 15 },
  { name: 'Wed', active: 13, total: 15 },
  { name: 'Thu', active: 15, total: 15 },
  { name: 'Fri', active: 11, total: 15 },
  { name: 'Sat', active: 9, total: 15 },
  { name: 'Sun', active: 8, total: 15 },
]

interface DashboardProps {
  onTabChange: (tab: string) => void
}

export function Dashboard({ onTabChange }: DashboardProps) {
  const { user } = useAuth()
  const { agents, loading, startAgent, stopAgent } = useAgents()
  const [alerts, setAlerts] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    avgResponseTime: 0,
    totalInteractions: 0
  })

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        setAlerts(data || [])
      } catch (error) {
        console.error('Error fetching alerts:', error)
      }
    }

    fetchAlerts()
  }, [user])

  useEffect(() => {
    if (agents) {
      const activeCount = agents.filter(agent => agent.status === 'active').length
      setStats({
        totalAgents: agents.length,
        activeAgents: activeCount,
        avgResponseTime: Math.round(Math.random() * 200 + 100), // Mock data
        totalInteractions: Math.round(Math.random() * 10000 + 5000) // Mock data
      })
    }
  }, [agents])

  const handleAgentAction = async (agentId: string, action: 'start' | 'stop') => {
    try {
      if (action === 'start') {
        await startAgent(agentId)
      } else {
        await stopAgent(agentId)
      }
    } catch (error) {
      console.error('Agent action error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-400">
            Here's what's happening with your AI agents today.
          </p>
        </div>
        <Button 
          onClick={() => onTabChange('create-agent')}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Bot className="w-4 h-4 mr-2" />
          Create New Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalAgents}</div>
            <p className="text-xs text-slate-400">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeAgents}</div>
            <p className="text-xs text-slate-400">
              {Math.round((stats.activeAgents / stats.totalAgents) * 100 || 0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgResponseTime}ms</div>
            <p className="text-xs text-slate-400">
              -12ms from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Interactions</CardTitle>
            <Users className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalInteractions.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              +1.2k from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Overview</CardTitle>
            <CardDescription className="text-slate-400">
              Response time, accuracy, and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Line type="monotone" dataKey="response_time" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Agent Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Active vs total agents over the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Area type="monotone" dataKey="total" stackId="1" stroke="#64748B" fill="#64748B" fillOpacity={0.3} />
                <Area type="monotone" dataKey="active" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agents and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Agents */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">My Agents</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage and monitor your AI agents
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onTabChange('agents')}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.slice(0, 5).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{agent.name}</h4>
                      <p className="text-sm text-slate-400 truncate max-w-xs">
                        {agent.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      className={`${agent.status === 'active' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      } border`}
                    >
                      {agent.status === 'active' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                      ) : (
                        <><Pause className="w-3 h-3 mr-1" /> Inactive</>
                      )}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem onClick={() => handleAgentAction(agent.id, agent.status === 'active' ? 'stop' : 'start')}>
                          {agent.status === 'active' ? (
                            <><Pause className="mr-2 h-4 w-4" /> Stop</>
                          ) : (
                            <><Play className="mr-2 h-4 w-4" /> Start</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {agents.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-300 mb-2">No agents yet</h3>
                  <p className="text-slate-400 mb-4">Create your first AI agent to get started</p>
                  <Button 
                    onClick={() => onTabChange('create-agent')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Create Agent
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Recent Alerts
            </CardTitle>
            <CardDescription className="text-slate-400">
              System notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-slate-700/30 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No active alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}