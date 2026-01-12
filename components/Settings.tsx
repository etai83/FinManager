import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const Settings = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!isSupabaseConfigured()) {
        setMessage({ type: 'error', text: 'Cannot update password in Demo Mode.' });
        setLoading(false);
        return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        setMessage({ type: 'error', text: error.message });
    } else {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setNewPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-dark">
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                <p className="text-[#9db9a6] text-sm mt-1">Manage your profile and security preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="size-16 rounded-full bg-gradient-to-br from-primary to-green-700 flex items-center justify-center text-[#111813] text-xl font-bold">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-bold">My Profile</h2>
                        <p className="text-[#9db9a6]">{user?.email}</p>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#111813] border border-[#3b5443]">
                        <span className="text-xs text-[#5a6b5f] uppercase font-bold tracking-wider">User ID</span>
                        <p className="text-white font-mono text-sm mt-1 truncate">{user?.id}</p>
                    </div>
                     <div className="p-4 rounded-xl bg-[#111813] border border-[#3b5443]">
                        <span className="text-xs text-[#5a6b5f] uppercase font-bold tracking-wider">Last Sign In</span>
                        <p className="text-white font-mono text-sm mt-1">
                            {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                 </div>
            </div>

            {/* Security */}
            <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <span className="material-symbols-outlined">lock</span>
                    </div>
                    <h2 className="text-white text-lg font-bold">Security</h2>
                </div>
                
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                     {message && (
                        <div className={`p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                            {message.text}
                        </div>
                     )}
                    <div>
                        <label className="block text-sm font-medium text-[#9db9a6] mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={6}
                            required
                            className="w-full bg-[#111813] border border-[#3b5443] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading || !newPassword}
                            className="bg-primary hover:bg-green-400 text-background-dark font-bold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};
