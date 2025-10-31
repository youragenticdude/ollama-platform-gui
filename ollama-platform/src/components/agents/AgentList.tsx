import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Bot,
  Search,
  Plus,
  Play,
  Pause,
  Settings,
  Trash2,
  Eye,
  MoreHorizontal,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface AgentListProps {
  onCreateAgent: () => void
}

export function AgentList({ onCreateAgent }: AgentListProps) {
  const { agents, loading, startAgent, stopAgent, deleteAgent } = useAgents()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAgentAction = async (agentId: string, action: 'start' | 'stop' | 'delete') => {
    try {
      switch (action) {
        case 'start':
          await startAgent(agentId)
          break
        case 'stop':
          await stopAgent(agentId)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this agent?')) {
            await deleteAgent(agentId)
          }
          break
      }
    } catch (error) {
      console.error('Agent action error:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-400" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      inactive: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      paused: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-300 border-red-500/30'
    }

    return (
      <Badge className={cn('border', variants[status as keyof typeof variants] || variants.inactive)}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    )
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
          <h1 className="text-3xl font-bold text-white mb-2">My Agents</h1>
          <p className="text-slate-400">
            Manage and monitor your AI agents
          </p>
        </div>
        <Button 
          onClick={onCreateAgent}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent Grid */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">
            {agents.length === 0 ? 'No agents yet' : 'No agents match your search'}
          </h3>
          <p className="text-slate-400 mb-6">
            {agents.length === 0 
              ? 'Create your first AI agent to get started'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {agents.length === 0 && (
            <Button 
              onClick={onCreateAgent}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Agent
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
                      {agent.icon_url || '🤖'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-white text-lg truncate">{agent.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(agent.status)}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem 
                        onClick={() => handleAgentAction(agent.id, agent.status === 'active' ? 'stop' : 'start')}
                      >
                        {agent.status === 'active' ? (
                          <><Pause className="mr-2 h-4 w-4" /> Stop Agent</>
                        ) : (
                          <><Play className="mr-2 h-4 w-4" /> Start Agent</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem 
                        onClick={() => handleAgentAction(agent.id, 'delete')}
                        className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Agent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 mb-4 line-clamp-2">
                  {agent.description || 'No description provided'}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Version {agent.version}</span>
                  <span>{new Date(agent.updated_at).toLocaleDateString()}</span>
                </div>
                
                {/* Quick Actions */}
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => handleAgentAction(agent.id, agent.status === 'active' ? 'stop' : 'start')}
                  >
                    {agent.status === 'active' ? (
                      <><Pause className="w-3 h-3 mr-1" /> Stop</>
                    ) : (
                      <><Play className="w-3 h-3 mr-1" /> Start</>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}