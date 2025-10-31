import { useState, useEffect } from 'react'
import { supabase, Agent, AgentTemplate } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function useAgents() {
  const { user } = useAuth()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = async () => {
    if (!user) {
      setAgents([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAgents(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  const createAgent = async (agentData: Partial<Agent>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase.functions.invoke('agent-management', {
        body: {
          action: 'create',
          agentData: {
            ...agentData,
            user_id: user.id
          }
        }
      })

      if (error) throw error

      await fetchAgents() // Refresh list
      toast.success('Agent created successfully!')
      return data.data[0]
    } catch (err: any) {
      toast.error(err.message || 'Failed to create agent')
      throw err
    }
  }

  const updateAgent = async (agentId: string, updates: Partial<Agent>) => {
    try {
      const { data, error } = await supabase.functions.invoke('agent-management', {
        body: {
          action: 'update',
          agentId,
          agentData: updates
        }
      })

      if (error) throw error

      await fetchAgents() // Refresh list
      toast.success('Agent updated successfully!')
      return data.data[0]
    } catch (err: any) {
      toast.error(err.message || 'Failed to update agent')
      throw err
    }
  }

  const startAgent = async (agentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('agent-management', {
        body: {
          action: 'start',
          agentId
        }
      })

      if (error) throw error

      await fetchAgents() // Refresh list
      toast.success('Agent started successfully!')
      return data.data[0]
    } catch (err: any) {
      toast.error(err.message || 'Failed to start agent')
      throw err
    }
  }

  const stopAgent = async (agentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('agent-management', {
        body: {
          action: 'stop',
          agentId
        }
      })

      if (error) throw error

      await fetchAgents() // Refresh list
      toast.success('Agent stopped successfully!')
      return data.data[0]
    } catch (err: any) {
      toast.error(err.message || 'Failed to stop agent')
      throw err
    }
  }

  const deleteAgent = async (agentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('agent-management', {
        body: {
          action: 'delete',
          agentId
        }
      })

      if (error) throw error

      await fetchAgents() // Refresh list
      toast.success('Agent deleted successfully!')
      return data.data
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete agent')
      throw err
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [user])

  return {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    startAgent,
    stopAgent,
    deleteAgent,
    refetch: fetchAgents
  }
}

export function useAgentTemplates() {
  const [templates, setTemplates] = useState<AgentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true })

      if (error) throw error
      setTemplates(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error('Failed to fetch templates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates
  }
}