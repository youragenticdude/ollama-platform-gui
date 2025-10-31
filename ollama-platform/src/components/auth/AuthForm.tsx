import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Zap, Bot, Activity, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

export function AuthForm() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('signin')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await signIn(formData.email, formData.password)
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setIsLoading(true)
    
    try {
      await signUp(formData.email, formData.password, formData.fullName)
    } catch (error) {
      console.error('Sign up error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      toast.error('Please enter your email address')
      return
    }
    
    setIsLoading(true)
    
    try {
      await resetPassword(formData.email)
    } catch (error) {
      console.error('Reset password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Hero Section */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Ollama Platform
              </h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Build the Future with
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                AI Agents
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-lg mx-auto lg:mx-0">
              Create, deploy, and manage intelligent AI agents with our comprehensive platform. 
              Monitor performance, build workflows, and scale your automation.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
            <div className="flex flex-col items-center space-y-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <Bot className="w-8 h-8 text-blue-400" />
              <span className="text-sm text-slate-300 font-medium">Smart Agents</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <Activity className="w-8 h-8 text-green-400" />
              <span className="text-sm text-slate-300 font-medium">Real-time Monitoring</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <span className="text-sm text-slate-300 font-medium">Advanced Analytics</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-slate-400">
                Sign in to access your AI agent dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="signin" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600">
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger value="reset" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600">
                    Reset
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-300">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-300">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="reset">
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Reset Password
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}