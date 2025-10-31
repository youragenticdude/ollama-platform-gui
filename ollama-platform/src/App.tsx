import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AuthForm } from '@/components/auth/AuthForm'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { AgentCreationWizard } from '@/components/agents/AgentCreationWizard'
import { AgentList } from '@/components/agents/AgentList'
import { TemplateGallery } from '@/components/templates/TemplateGallery'
import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard'
import { Toaster } from 'sonner'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />
      case 'agents':
        return <AgentList onCreateAgent={() => setActiveTab('create-agent')} />
      case 'create-agent':
        return (
          <AgentCreationWizard 
            onSuccess={() => setActiveTab('agents')} 
            onCancel={() => setActiveTab('dashboard')}
          />
        )
      case 'templates':
        return <TemplateGallery onUseTemplate={() => setActiveTab('create-agent')} />
      case 'monitoring':
        return <MonitoringDashboard />
      case 'workflows':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Workflows</h1>
            <p className="text-slate-400">Workflow management coming soon...</p>
          </div>
        )
      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Analytics</h1>
            <p className="text-slate-400">Advanced analytics coming soon...</p>
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
            <p className="text-slate-400">Settings panel coming soon...</p>
          </div>
        )
      default:
        return <Dashboard onTabChange={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1F2937',
              border: '1px solid #374151',
              color: '#F3F4F6'
            }
          }}
        />
      </AuthProvider>
    </Router>
  )
}

export default App