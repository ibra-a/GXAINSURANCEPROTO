import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import gxaLogo from '../../assets/gxa-logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo authentication - recognize Ahmed Mohamed Hassan's email
    // In production, this would use Supabase Auth
    const demoUsers = [
      {
        email: 'ahmed.hassan@example.dj',
        name: 'Ahmed Mohamed Hassan',
        phone: '+253 77 12 34 56',
        policyNumber: 'GXA-DJ-2024-1547'
      },
      {
        email: 'ahmod.hassan@example.dj',
        name: 'Ahmod Mohamed Hassan',
        phone: '+253 77 12 34 56',
        policyNumber: 'GXA-DJ-2024-1547'
      }
    ];
    
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Accept any password for demo, but recognize the email
    setTimeout(() => {
      setIsLoading(false);
      // Store user info in sessionStorage for demo purposes
      if (user) {
        sessionStorage.setItem('demoUser', JSON.stringify(user));
      }
      navigate('/user/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-2xl">
            <img src={gxaLogo} alt="GXA" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-blue-200">
            Sign in to access your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-blue-200">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-blue-300">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-blue-200">
              Don't have an account?{' '}
              <a
                href="#"
                className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
              >
                Create one here
              </a>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-white/20 flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200/80">
              Your data is protected with bank-level encryption. All sessions are secure and encrypted.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

