import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  Star,
  Users,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { useAgentTemplates } from '@/hooks/useAgents'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface TemplateGalleryProps {
  onUseTemplate: (templateId: string) => void
}

export function TemplateGallery({ onUseTemplate }: TemplateGalleryProps) {
  const { templates, loading } = useAgentTemplates()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.users_count || 0) - (a.users_count || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const categories = [...new Set(templates.map(t => t.category))]

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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Template Gallery</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Choose from our curated collection of pre-built AI agent templates. 
          Each template is designed for specific use cases and can be customized to your needs.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No templates found</h3>
          <p className="text-slate-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={cn(
                "bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer group",
                template.is_premium && "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl">{template.icon}</div>
                  <div className="flex items-center space-x-1">
                    {template.is_premium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-white text-lg mb-1">{template.title}</CardTitle>
                  <Badge 
                    className="text-xs mb-2"
                    style={{ 
                      backgroundColor: template.color + '20', 
                      color: template.color, 
                      borderColor: template.color + '40' 
                    }}
                  >
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-slate-400 mb-4 line-clamp-3">
                  {template.description}
                </CardDescription>
                
                {/* Features */}
                {template.features && template.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Key Features</h4>
                    <div className="space-y-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="text-xs text-slate-400 flex items-center">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                      {template.features.length > 3 && (
                        <div className="text-xs text-slate-500">+{template.features.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-400" />
                      <span>{(template.rating || 0).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{template.users_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{template.setup_time || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <Button 
                  className={cn(
                    "w-full group-hover:shadow-lg transition-all duration-200",
                    template.is_premium
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  )}
                  onClick={() => onUseTemplate(template.id)}
                >
                  Use Template
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center py-8 border-t border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-2">Can't find what you're looking for?</h3>
        <p className="text-slate-400 mb-4">
          Create a custom agent from scratch with our powerful agent builder
        </p>
        <Button 
          variant="outline" 
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
          onClick={() => onUseTemplate('')}
        >
          Create Custom Agent
        </Button>
      </div>
    </div>
  )
}