import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const baseUrl = "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      login(token);
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }
  }, [login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token);
        toast({
          title: "Signed In",
          description: "You have signed in successfully!",
        });
        setSuccess("Signed in successfully! Redirecting...");
        setTimeout(() => navigate("/"), 1200);
      } else {
        setError(data.errors?.[0]?.msg || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Submit email
  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    try {
      // Placeholder API call
      const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotSuccess("OTP sent to your email!");
        setForgotStep(2);
      } else {
        setForgotError(data.message || "User not found");
      }
    } catch (err) {
      setForgotError("Network error");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    try {
      // Placeholder API call
      const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotSuccess("OTP verified!");
        setForgotStep(3);
      } else {
        setForgotError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setForgotError("Network error");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Submit new password
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }
    setForgotLoading(true);
    try {
      // Placeholder API call
      const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp: forgotOtp,
          password: forgotNewPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotSuccess("Password reset successful! You can now sign in.");
        setTimeout(() => setForgotOpen(false), 1200);
      } else {
        setForgotError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setForgotError("Network error");
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
              Sign in to access your account and continue your shopping
              experience
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
            <CardTitle className="text-2xl font-bold text-black">
              Sign In
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Enter your credentials to access your account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                Email
              </Label>
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
              <Label
                htmlFor="password"
                className="text-sm font-medium text-black"
              >
                Password
              </Label>
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
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
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForgotOpen(true);
                  setForgotStep(1);
                  setForgotEmail("");
                  setForgotOtp("");
                  setForgotNewPassword("");
                  setForgotConfirmPassword("");
                  setForgotError("");
                  setForgotSuccess("");
                }}
                className="text-sm text-black hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-black hover:bg-gray-800 text-white"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-black hover:underline font-medium"
              >
                Sign up
              </a>
            </p>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center">
                {success}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              {forgotStep === 1 && "Enter your email to receive an OTP."}
              {forgotStep === 2 && "Enter the OTP sent to your email."}
              {forgotStep === 3 && "Enter your new password."}
            </DialogDescription>
          </DialogHeader>
          {forgotStep === 1 && (
            <form onSubmit={handleForgotEmail} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              {forgotError && (
                <div className="text-red-500 text-sm">{forgotError}</div>
              )}
              {forgotSuccess && (
                <div className="text-green-600 text-sm">{forgotSuccess}</div>
              )}
              <DialogFooter>
                <Button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </Button>
              </DialogFooter>
            </form>
          )}
          {forgotStep === 2 && (
            <form onSubmit={handleForgotOtp} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                required
              />
              {forgotError && (
                <div className="text-red-500 text-sm">{forgotError}</div>
              )}
              {forgotSuccess && (
                <div className="text-green-600 text-sm">{forgotSuccess}</div>
              )}
              <DialogFooter>
                <Button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </DialogFooter>
            </form>
          )}
          {forgotStep === 3 && (
            <form onSubmit={handleForgotReset} className="space-y-4">
              <Input
                type="password"
                placeholder="New password"
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={forgotConfirmPassword}
                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                required
              />
              {forgotError && (
                <div className="text-red-500 text-sm">{forgotError}</div>
              )}
              {forgotSuccess && (
                <div className="text-green-600 text-sm">{forgotSuccess}</div>
              )}
              <DialogFooter>
                <Button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignIn;
