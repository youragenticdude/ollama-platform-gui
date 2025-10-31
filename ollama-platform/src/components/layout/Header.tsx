import React, { useState } from 'react'
import { Search, Bell, User, Settings, LogOut, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  onSearch?: (query: string) => void
}

export function Header({ onSearch }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState(3) // Mock notification count

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="h-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-xl bg-opacity-95">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Ollama Platform
          </h1>
          <p className="text-xs text-slate-400">AI Agent Management</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search agents, templates, or workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
          />
        </form>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-800 rounded-xl">
          <Bell className="w-5 h-5 text-slate-300" />
          {notifications > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 text-xs border-0">
              {notifications}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border-2 border-blue-500/20">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-slate-900 border-slate-700 text-white"
            align="end"
            forceMount
          >
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs leading-none text-slate-400">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem 
              className="hover:bg-red-900/20 focus:bg-red-900/20 text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}