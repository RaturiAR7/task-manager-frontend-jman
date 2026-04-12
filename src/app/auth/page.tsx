'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { LoginFormData, SignupFormData } from '@/src/constants/types'
import { useAuth } from '../../context/authContext'
import { useRouter } from 'next/navigation'
import { authApi } from '@/src/services/authApi'


export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('login')
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'employee'
  })

  const [signupData, setSignupData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await login(loginData.email, loginData.password)
      
      // Determine role for redirect
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === "EMPLOYEE") {
          router.push("/account");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard"); // Fallback
      }
    } catch {
      alert("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!")
      setIsLoading(false)
      return
    }

    try {
      await authApi.register({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password
      })
      alert("Registration successful. Please login.")
      setActiveTab("login")
    } catch {
      alert("Error during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center page-bg p-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full opacity-15 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600 rounded-full opacity-12 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900 rounded-full opacity-10 blur-3xl" />

      <Card className="w-full max-w-md relative z-10 border-white/10 shadow-2xl shadow-black/50">
        <CardHeader className="space-y-1 pb-4">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
              <span className="text-2xl font-bold text-white">PM</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-white/40">
            Collaborate, manage projects, and reach new productivity peaks
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col items-center">
            <TabsList className="flex mb-6 w-full">
              <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="w-full">
              <form onSubmit={handleLogin} className="space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="name@company.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value as any })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value as any })} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="w-full">
              <form onSubmit={handleSignup} className="space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" placeholder="John Doe" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value as any })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="name@company.com" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value as any })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value as any })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input id="signup-confirm-password" type="password" placeholder="••••••••" value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value as any })} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-xs text-center text-white/30">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
