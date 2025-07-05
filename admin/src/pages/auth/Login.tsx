import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, error, clearError } = useAuth();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to PK Trends Admin!",
      });
    } catch (error: any) {
      // Error is already set in the context, so we don't need to show toast here
      // The error will be displayed in the UI below
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case "network":
        return <AlertCircle className="h-4 w-4" />;
      case "validation":
        return <AlertCircle className="h-4 w-4" />;
      case "auth":
        return <Lock className="h-4 w-4" />;
      case "server":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getErrorVariant = (errorType: string) => {
    switch (errorType) {
      case "network":
        return "destructive";
      case "validation":
        return "destructive";
      case "auth":
        return "destructive";
      case "server":
        return "destructive";
      default:
        return "destructive";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            PK Trends Admin
          </h1>
          <p className="text-gray-600 mt-2">Sign in to manage your store</p>
        </div>

        {error && (
          <Alert variant={getErrorVariant(error.type) as any} className="mb-6">
            {getErrorIcon(error.type)}
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
                className="pl-10"
                placeholder="admin@pktrends.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                className="pl-10 pr-10"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <a
            href="/register"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Sign up
          </a>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Demo credentials:</p>
          <p className="text-sm font-mono">admin@pktrends.com / admin123</p>
        </div>
      </motion.div>
    </div>
  );
};
