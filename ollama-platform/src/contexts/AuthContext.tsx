import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName?: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user on mount (one-time check)
  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    // Set up auth listener - KEEP SIMPLE, avoid any async operations in callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // NEVER use any async operations in callback
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Auth methods
  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Signed in successfully!')
      return data
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
      throw error
    }
  }

  async function signUp(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.protocol}//${window.location.host}/auth/callback`
        }
      })

      if (error) throw error

      // Create profile if user was created successfully
      if (data.user && fullName) {
        setTimeout(async () => {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user!.id,
                full_name: fullName,
                role: 'user'
              })
            
            if (profileError) {
              console.error('Profile creation error:', profileError)
            }
          } catch (err) {
            console.error('Error creating profile:', err)
          }
        }, 1000)
      }

      toast.success('Check your email to confirm your account!')
      return data
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up')
      throw error
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Signed out successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out')
      throw error
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.protocol}//${window.location.host}/auth/reset-password`
      })
      if (error) throw error
      toast.success('Password reset email sent!')
      return { error: null }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}