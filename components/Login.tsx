import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { demoLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
        // Fallback for demo
        setTimeout(() => {
            demoLogin();
            navigate('/');
        }, 1000);
        return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background-dark p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-surface-dark border border-[#28392e] p-8 shadow-xl">
        <div className="text-center">
            <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-[#111813] mx-auto mb-4">
                <span className="material-symbols-outlined text-[28px]">account_balance_wallet</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-[#9db9a6]">Sign in to your FinManager account</p>
        </div>

        {!isSupabaseConfigured() && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-yellow-500 text-xs text-center">
                Supabase credentials missing. Logging in will use Demo Mode.
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#9db9a6]">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-[#111813] border border-[#3b5443] text-white px-3 py-2 placeholder-[#5a6b5f] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#9db9a6]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-[#111813] border border-[#3b5443] text-white px-3 py-2 placeholder-[#5a6b5f] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-[#111813] hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 transition-colors"
          >
            {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
            ) : (
                'Sign in'
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-[#9db9a6]">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-green-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
