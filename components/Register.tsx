import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
        setError("Passwords don't match");
        setLoading(false);
        return;
    }

    if (!isSupabaseConfigured()) {
        setError("Supabase not configured. Cannot create real accounts.");
        setLoading(false);
        return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background-dark p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-surface-dark border border-[#28392e] p-8 shadow-xl text-center">
                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Check your email</h2>
                <p className="text-[#9db9a6]">
                    We've sent a confirmation link to <span className="text-white font-medium">{email}</span>. 
                    Please verify your account to continue.
                </p>
                <div className="pt-4">
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background-dark p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-surface-dark border border-[#28392e] p-8 shadow-xl">
        <div className="text-center">
             <div className="size-12 bg-surface-dark-light rounded-xl flex items-center justify-center text-white mx-auto mb-4 border border-[#3b5443]">
                <span className="material-symbols-outlined text-[28px]">person_add</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-[#9db9a6]">Start managing your finances today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
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
             <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#9db9a6]">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-[#111813] border border-[#3b5443] text-white px-3 py-2 placeholder-[#5a6b5f] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#111813] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 transition-colors"
          >
            {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
            ) : (
                'Create Account'
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-[#9db9a6]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-green-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
