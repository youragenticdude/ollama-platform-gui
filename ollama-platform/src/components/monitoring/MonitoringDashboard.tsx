import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye
} from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'

// Mock real-time data
const generateRealtimeData = () => {
  const now = new Date()
  const data = []
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      response_time: Math.round(Math.random() * 200 + 100),
      accuracy: Math.round(Math.random() * 20 + 80),
      errors: Math.round(Math.random() * 10),
      throughput: Math.round(Math.random() * 100 + 50)
    })
  }
  
  return data
}

export function MonitoringDashboard() {
  const { user } = useAuth()
  const { agents } = useAgents()
  const [monitoring, setMonitoring] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [realtimeData, setRealtimeData] = useState(generateRealtimeData())
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const activeAgents = agents.filter(agent => agent.status === 'active')
  const totalAgents = agents.length
  const avgResponseTime = realtimeData[realtimeData.length - 1]?.response_time || 0
  const currentAccuracy = realtimeData[realtimeData.length - 1]?.accuracy || 0

  useEffect(() => {
    const fetchMonitoringData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        // Fetch recent monitoring data
        const { data: monitoringData, error: monitoringError } = await supabase
          .from('monitoring_data')
          .select('*')
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: false })
          .limit(100)

        if (monitoringError) throw monitoringError
        setMonitoring(monitoringData || [])

        // Fetch recent alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from('alerts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (alertsError) throw alertsError
        setAlerts(alertsData || [])
        
      } catch (error) {
        console.error('Error fetching monitoring data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMonitoringData()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData())
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [user])

  const generateMonitoringData = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase.functions.invoke('monitoring-data', {
        body: { action: 'generate' }
      })
      
      if (error) throw error
      
      // Refresh data after generation
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error generating monitoring data:', error)
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Real-time Monitoring</h1>
          <p className="text-slate-400">
            Monitor your agents' performance and health in real-time
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-slate-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={generateMonitoringData}
            className="border-slate-600 text-slate-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeAgents.length}</div>
            <div className="flex items-center text-xs text-slate-400">
              <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
              <span>of {totalAgents} total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgResponseTime}ms</div>
            <div className="flex items-center text-xs text-slate-400">
              <TrendingDown className="w-3 h-3 mr-1 text-green-400" />
              <span>-12ms from avg</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Accuracy Score</CardTitle>
            <Zap className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentAccuracy}%</div>
            <div className="flex items-center text-xs text-slate-400">
              <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
              <span>+2% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{alerts.filter(a => !a.is_read).length}</div>
            <div className="flex items-center text-xs text-slate-400">
              <span>of {alerts.length} total</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Response Time Trends</CardTitle>
            <CardDescription className="text-slate-400">
              24-hour response time monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="response_time" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Accuracy Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Accuracy & Throughput</CardTitle>
            <CardDescription className="text-slate-400">
              Performance metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stackId="2" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Agent Status Overview</CardTitle>
            <CardDescription className="text-slate-400">
              Current status of all your agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agents.slice(0, 6).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm">
                      {agent.icon_url || '🤖'}
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">{agent.name}</h4>
                      <p className="text-xs text-slate-400">Last updated: {new Date(agent.updated_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={`${agent.status === 'active' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      } border text-xs`}
                    >
                      {agent.status === 'active' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                      ) : (
                        <><AlertTriangle className="w-3 h-3 mr-1" /> Inactive</>
                      )}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Recent Alerts
            </CardTitle>
            <CardDescription className="text-slate-400">
              Latest system notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${{
                  'error': 'bg-red-500/10 border-red-500',
                  'warning': 'bg-yellow-500/10 border-yellow-500',
                  'info': 'bg-blue-500/10 border-blue-500',
                  'critical': 'bg-red-600/10 border-red-600'
                }[alert.severity] || 'bg-slate-700/30 border-slate-500'}`}>
                  <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={`text-xs ${{
                      'error': 'bg-red-500/20 text-red-300',
                      'warning': 'bg-yellow-500/20 text-yellow-300',
                      'info': 'bg-blue-500/20 text-blue-300',
                      'critical': 'bg-red-600/20 text-red-300'
                    }[alert.severity] || 'bg-slate-500/20 text-slate-300'}`}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {new Date(alert.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No recent alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}