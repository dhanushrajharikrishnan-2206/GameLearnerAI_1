import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await authService.requestPasswordReset(email);
    setLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f2f9f5] text-slate-900 relative">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-black text-xl text-slate-900">GameLearn<span className="text-emerald-600">.AI</span></span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Reset Password</h1>
          <p className="text-xs text-slate-500 mt-1">We'll send recovery coordinates to your inbox.</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Reset Email Dispatched!</h3>
              <p className="text-xs text-slate-500 mt-1">Check {email} for instructions to reset your password.</p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-500"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo transition-all"
              >
                {loading ? 'Sending...' : 'Send Recovery Link'}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
