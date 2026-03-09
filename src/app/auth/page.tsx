'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
      router.push("/dashboard")
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A1BC98] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#778873] rounded-full opacity-20 blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative bg-white/90 backdrop-blur-sm border-[#D2DCB6]">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#778873] rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-[#F1F3E0]">PM</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-[#778873]">
            Welcome
          </CardTitle>
          <CardDescription className="text-center text-[#778873]">
            Collaborate, manage projects, and reach new productivity peaks
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col items-center">
            <TabsList className="flex mb-6">
              <TabsTrigger value="login" >Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="name@company.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value as any })} required className="border-[#D2DCB6] focus:border-[#778873] focus:ring-[#778873] min-w-90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value as any })} required className="border-[#D2DCB6] focus:border-[#778873] focus:ring-[#778873] min-w-90" />
                </div>

                <Button   type="submit"  className="w-full bg-[#778873] hover:bg-[#A1BC98] text-[#F1F3E0]" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name"  placeholder="John Doe" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value as any })} required className="border-[#D2DCB6] focus:border-[#778873] focus:ring-[#778873] min-w-90" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email"  placeholder="name@company.com" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value as any })} required className="border-[#D2DCB6] focus:border-[#778873] focus:ring-[#778873] min-w-90"/>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input  id="signup-password"  type="password"  placeholder="••••••••"  value={signupData.password}  onChange={(e) => setSignupData({ ...signupData, password: e.target.value as any })}  required className="border-[#D2DCB6] focus:border-[#778873] focus:ring-[#778873]"/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input id="signup-confirm-password" type="password"  placeholder="••••••••"  value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value as any })} required className="border-[#D2DCB6] focus:border-[#778873] focus:ring-[#778873]" />
                </div>
                
                <Button  type="submit" className="w-full bg-[#778873] hover:bg-[#A1BC98] text-[#F1F3E0]" disabled={isLoading} >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-[#778873]">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
