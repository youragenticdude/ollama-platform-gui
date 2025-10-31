import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronLeft, 
  ChevronRight, 
  Bot, 
  Settings, 
  Workflow, 
  Play,
  Sparkles,
  Zap,
  Check,
  Upload,
  Search
} from 'lucide-react'
import { useAgents, useAgentTemplates } from '@/hooks/useAgents'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AgentCreationWizardProps {
  onSuccess?: () => void
  onCancel?: () => void
}

interface AgentFormData {
  name: string
  description: string
  icon_url: string
  template_id: string | null
  config: {
    behavior: {
      proactivity: number
      responsiveness: number
      creativity: number
      analytical: number
    }
    integrations: string[]
    permissions: string[]
  }
  workflow: {
    nodes: any[]
    edges: any[]
  }
}

const steps = [
  { id: 1, title: 'Agent Basics', icon: Bot },
  { id: 2, title: 'Configuration', icon: Settings },
  { id: 3, title: 'Workflow', icon: Workflow },
  { id: 4, title: 'Review & Launch', icon: Play }
]

const agentIcons = [
  '🤖', '🚀', '⚡', '🎯', '🔥', '💡', '🌟', '🎨',
  '📊', '🔧', '📱', '💰', '🎓', '🏥', '📈', '🛠️'
]

export function AgentCreationWizard({ onSuccess, onCancel }: AgentCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { templates, loading: templatesLoading } = useAgentTemplates()
  const { createAgent } = useAgents()
  const [isCreating, setIsCreating] = useState(false)
  
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    icon_url: '🤖',
    template_id: null,
    config: {
      behavior: {
        proactivity: 75,
        responsiveness: 80,
        creativity: 60,
        analytical: 70
      },
      integrations: [],
      permissions: []
    },
    workflow: {
      nodes: [],
      edges: []
    }
  })

  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const templateCategories = [...new Set(templates.map(t => t.category))]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      template_id: template.id,
      config: {
        ...prev.config,
        ...template.config
      }
    }))
  }

  const handleCreateAgent = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter an agent name')
      return
    }

    setIsCreating(true)
    try {
      await createAgent({
        name: formData.name,
        description: formData.description,
        icon_url: formData.icon_url,
        template_id: formData.template_id,
        config: formData.config,
        workflow: formData.workflow
      })
      
      toast.success('Agent created successfully!')
      onSuccess?.()
    } catch (error) {
      console.error('Error creating agent:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Choose a Template</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Start with a pre-built template or create from scratch
                </p>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {/* Custom Template Option */}
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-200 border-2",
                    !selectedTemplate 
                      ? "border-blue-500 bg-blue-500/10" 
                      : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                  )}
                  onClick={() => setSelectedTemplate(null)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">✨</div>
                      {!selectedTemplate && <Check className="w-5 h-5 text-blue-400" />}
                    </div>
                    <CardTitle className="text-white text-sm">Custom Agent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400 text-xs">
                      Build your agent from scratch with full customization
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {/* Template Options */}
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 border-2",
                      selectedTemplate?.id === template.id 
                        ? "border-blue-500 bg-blue-500/10" 
                        : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                    )}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{template.icon}</div>
                        {selectedTemplate?.id === template.id && <Check className="w-5 h-5 text-blue-400" />}
                      </div>
                      <CardTitle className="text-white text-sm">{template.title}</CardTitle>
                      <Badge 
                        className="w-fit text-xs"
                        style={{ backgroundColor: template.color + '20', color: template.color, borderColor: template.color + '40' }}
                      >
                        {template.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-400 text-xs mb-2">
                        {template.description}
                      </CardDescription>
                      <div className="flex items-center text-xs text-slate-500">
                        <span>{template.setup_time}</span>
                        {template.is_premium && (
                          <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-1 py-0.5">
                            Pro
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">Agent Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter agent name"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your agent does"
                    className="bg-slate-700 border-slate-600 text-white resize-none"
                    rows={3}
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-slate-300 mb-3 block">Agent Icon</Label>
                <div className="grid grid-cols-8 gap-2">
                  {agentIcons.map((icon) => (
                    <Button
                      key={icon}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-10 w-10 p-0 text-lg",
                        formData.icon_url === icon 
                          ? "border-blue-500 bg-blue-500/20" 
                          : "border-slate-600 hover:border-slate-500"
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, icon_url: icon }))}
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Behavior Configuration</h3>
              <p className="text-slate-400 text-sm mb-6">
                Adjust your agent's personality and behavior patterns
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Behavior Sliders */}
              <div className="space-y-6">
                {Object.entries(formData.config.behavior).map(([key, value]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-slate-300 capitalize">{key.replace('_', ' ')}</Label>
                      <span className="text-sm text-slate-400">{value}%</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => 
                        setFormData(prev => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            behavior: {
                              ...prev.config.behavior,
                              [key]: newValue
                            }
                          }
                        }))
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              
              {/* Integration Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Integration Settings</h4>
                <div className="space-y-3">
                  {[
                    { id: 'slack', label: 'Slack Integration', description: 'Connect to Slack channels' },
                    { id: 'email', label: 'Email Notifications', description: 'Send email alerts' },
                    { id: 'webhook', label: 'Webhook Support', description: 'Custom webhook endpoints' },
                    { id: 'api', label: 'API Access', description: 'Enable external API calls' }
                  ].map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <h5 className="text-sm font-medium text-white">{integration.label}</h5>
                        <p className="text-xs text-slate-400">{integration.description}</p>
                      </div>
                      <Switch
                        checked={formData.config.integrations.includes(integration.id)}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            config: {
                              ...prev.config,
                              integrations: checked 
                                ? [...prev.config.integrations, integration.id]
                                : prev.config.integrations.filter(i => i !== integration.id)
                            }
                          }))
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Workflow Construction</h3>
              <p className="text-slate-400 text-sm mb-6">
                Design your agent's workflow with conditional logic and automation
              </p>
            </div>
            
            {/* Workflow Builder Placeholder */}
            <div className="bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-600 p-12 text-center">
              <Workflow className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-300 mb-2">Workflow Builder</h4>
              <p className="text-slate-400 mb-4">
                Visual workflow editor will be implemented here.
                For now, your agent will use a basic workflow.
              </p>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Upload className="w-4 h-4 mr-2" />
                Import Workflow
              </Button>
            </div>
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Review & Launch</h3>
              <p className="text-slate-400 text-sm mb-6">
                Review your agent configuration and launch it
              </p>
            </div>
            
            {/* Agent Summary */}
            <div className="bg-slate-700/30 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                  {formData.icon_url}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{formData.name || 'Unnamed Agent'}</h4>
                  <p className="text-slate-400">{formData.description || 'No description provided'}</p>
                  {selectedTemplate && (
                    <Badge className="mt-2" style={{ backgroundColor: selectedTemplate.color + '20', color: selectedTemplate.color }}>
                      Based on {selectedTemplate.title}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-600">
                <div>
                  <span className="text-sm text-slate-400">Proactivity</span>
                  <div className="text-lg font-semibold text-white">{formData.config.behavior.proactivity}%</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Responsiveness</span>
                  <div className="text-lg font-semibold text-white">{formData.config.behavior.responsiveness}%</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Creativity</span>
                  <div className="text-lg font-semibold text-white">{formData.config.behavior.creativity}%</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Analytical</span>
                  <div className="text-lg font-semibold text-white">{formData.config.behavior.analytical}%</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-600">
                <span className="text-sm text-slate-400">Active Integrations</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.config.integrations.length > 0 ? (
                    formData.config.integrations.map(integration => (
                      <Badge key={integration} variant="outline" className="border-slate-600 text-slate-300">
                        {integration}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">No integrations enabled</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create AI Agent</h1>
            <p className="text-slate-400">
              Build and configure your intelligent AI agent in 4 simple steps
            </p>
          </div>
          <Button variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300">
            Cancel
          </Button>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round((currentStep / steps.length) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>
      </div>
      
      {/* Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
                  isActive 
                    ? "bg-blue-500 text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-slate-700 text-slate-400"
                )}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  "ml-2 text-sm font-medium",
                  isActive ? "text-white" : "text-slate-400"
                )}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-slate-600 ml-4" />
                )}
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Content */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="border-slate-600 text-slate-300"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleCreateAgent}
            disabled={isCreating}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Launch Agent
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}