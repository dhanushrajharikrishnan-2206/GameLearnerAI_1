import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, loginAsAdminDemo, isBackendConnected } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex@example.com',
      password: 'password123',
      rememberMe: true
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || err?.message || 'Failed to sign in. Check your credentials.');
    }
  };

  const handleInstantDemo = async () => {
    try {
      setErrorMessage(null);
      await loginAsDemo();
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Demo login failed');
    }
  };

  const handleAdminDemo = async () => {
    try {
      setErrorMessage(null);
      await loginAsAdminDemo();
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Admin login failed');
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f2f9f5] text-slate-900 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-glow-emerald">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">
              GameLearn<span className="text-emerald-600">.AI</span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-[11px] font-bold mb-2 shadow-sm">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Role-Protected SQLite Database</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900">Welcome Back!</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log in to continue your learning adventure or manage system records.
          </p>
        </div>

        {/* Demo Fast-Track Card (Student vs Admin) */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>1-Click Role Testing</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
              RBAC Demo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Student Demo Button */}
            <button
              type="button"
              onClick={handleInstantDemo}
              className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-slate-900 group-hover:text-emerald-800">Student Demo</span>
                <span className="text-[9px] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">User</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                alex@example.com (Learner: Database Viewer blocked)
              </p>
            </button>

            {/* Admin Demo Button */}
            <button
              type="button"
              onClick={handleAdminDemo}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white text-left transition-all shadow-glow-emerald cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-white">Admin Demo</span>
                <span className="text-[9px] font-extrabold bg-white/20 text-white px-1.5 py-0.2 rounded">Admin</span>
              </div>
              <p className="text-[10px] text-emerald-100 leading-tight">
                admin@gamelearn.ai (Admin: Database Viewer unlocked)
              </p>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center">
            Database Viewer is strictly visible and accessible only when logged in as an <strong>Admin</strong>.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl backdrop-blur-xl">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-glow-emerald transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Social login UI placeholders */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleInstantDemo}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={handleInstantDemo}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="font-bold text-red-500">G</span>
                <span>Google</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-bold">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
