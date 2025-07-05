import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const baseUrl = 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token);
        toast({ title: 'Signed In', description: 'You have signed in successfully!' });
        setSuccess('Signed in successfully! Redirecting...');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setError(data.errors?.[0]?.msg || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Submit email
  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);
    try {
      // Placeholder API call
      const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotSuccess('OTP sent to your email!');
        setForgotStep(2);
      } else {
        setForgotError(data.message || 'User not found');
      }
    } catch (err) {
      setForgotError('Network error');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);
    try {
      // Placeholder API call
      const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotSuccess('OTP verified!');
        setForgotStep(3);
      } else {
        setForgotError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setForgotError('Network error');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Submit new password
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }
    setForgotLoading(true);
    try {
      // Placeholder API call
        const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, password: forgotNewPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotSuccess('Password reset successful! You can now sign in.');
        setTimeout(() => setForgotOpen(false), 1200);
      } else {
        setForgotError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setForgotError('Network error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-white" />
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg text-gray-300">
              Sign in to access your account and continue your shopping experience
            </p>
          </div>
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-gray-300">Access your order history</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-gray-300">Track your shipments</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-gray-300">Manage your wishlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md border-gray-200 shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="lg:hidden mb-4">
              <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-black" />
            </div>
            <CardTitle className="text-2xl font-bold text-black">Sign In</CardTitle>
            <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
    
            </div>

            <div className="relative">
              <Separator className="bg-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-black">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:border-black focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">Remember me</Label>
              </div>
              <button type="button" onClick={() => { setForgotOpen(true); setForgotStep(1); setForgotEmail(''); setForgotOtp(''); setForgotNewPassword(''); setForgotConfirmPassword(''); setForgotError(''); setForgotSuccess(''); }} className="text-sm text-black hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button onClick={handleSubmit} className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-black hover:underline font-medium">
                Sign up
              </a>
            </p>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              {forgotStep === 1 && 'Enter your email to receive an OTP.'}
              {forgotStep === 2 && 'Enter the OTP sent to your email.'}
              {forgotStep === 3 && 'Enter your new password.'}
            </DialogDescription>
          </DialogHeader>
          {forgotStep === 1 && (
            <form onSubmit={handleForgotEmail} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
              {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
              {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
              <DialogFooter>
                <Button type="submit" disabled={forgotLoading}>{forgotLoading ? 'Sending...' : 'Send OTP'}</Button>
              </DialogFooter>
            </form>
          )}
          {forgotStep === 2 && (
            <form onSubmit={handleForgotOtp} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={forgotOtp}
                onChange={e => setForgotOtp(e.target.value)}
                required
              />
              {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
              {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
              <DialogFooter>
                <Button type="submit" disabled={forgotLoading}>{forgotLoading ? 'Verifying...' : 'Verify OTP'}</Button>
              </DialogFooter>
            </form>
          )}
          {forgotStep === 3 && (
            <form onSubmit={handleForgotReset} className="space-y-4">
              <Input
                type="password"
                placeholder="New password"
                value={forgotNewPassword}
                onChange={e => setForgotNewPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={forgotConfirmPassword}
                onChange={e => setForgotConfirmPassword(e.target.value)}
                required
              />
              {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
              {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
              <DialogFooter>
                <Button type="submit" disabled={forgotLoading}>{forgotLoading ? 'Resetting...' : 'Reset Password'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignIn; 