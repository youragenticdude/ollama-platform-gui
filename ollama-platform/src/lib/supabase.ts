import { createClient } from '@supabase/supabase-js'

// Use environment variables if available, fallback to demo mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// Check if we're in demo mode
export const isDemoMode = supabaseUrl === 'https://demo.supabase.co' || !import.meta.env.VITE_SUPABASE_URL

// Create client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: !isDemoMode, // Disable auto-refresh in demo mode
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-app-mode': isDemoMode ? 'demo' : 'production'
    }
  }
})

// Log warning if in demo mode
if (isDemoMode) {
  console.warn('⚠️ Running in DEMO MODE - Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
}

// Types for our database schema
export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  company: string | null
  role: string | null
  preferences: any
  created_at: string
  updated_at: string
}

export interface AgentTemplate {
  id: string
  title: string
  description: string | null
  category: string
  icon: string | null
  features: string[] | null
  config: any
  rating: number | null
  users_count: number | null
  setup_time: string | null
  color: string | null
  is_premium: boolean | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  user_id: string
  name: string
  description: string | null
  icon_url: string | null
  template_id: string | null
  status: 'active' | 'inactive' | 'paused' | 'error'
  config: any
  workflow: any
  permissions: any
  version: number
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  agent_id: string
  name: string
  description: string | null
  flow_data: any
  nodes: any[]
  edges: any[]
  is_active: boolean
  version: number
  created_at: string
  updated_at: string
}

export interface MonitoringData {
  id: string
  agent_id: string
  metric_type: string
  metric_value: number
  timestamp: string
  metadata: any
}

export interface Alert {
  id: string
  user_id: string
  agent_id: string | null
  alert_type: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string | null
  is_read: boolean
  resolved_at: string | null
  metadata: any
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  agent_id: string | null
  action_type: string
  description: string | null
  metadata: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
}