import React, { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SidebarItem = ({ to, icon, label, exact = false }: { to: string; icon: string; label: string; exact?: boolean }) => {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-[#9db9a6] hover:bg-surface-dark-light hover:text-white'
        }`
      }
    >
      <span className={`material-symbols-outlined ${icon === 'dashboard' ? 'fill' : ''}`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export const Layout = ({ children }: { children?: ReactNode }) => {
  const { user, signOut, subscription } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
      setLoggingOut(true);
      await signOut();
      setLoggingOut(false);
      navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-surface-dark border-r border-[#28392e] h-full flex-shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-gradient-to-br from-primary to-green-700 rounded-xl flex items-center justify-center text-[#111813]">
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-tight">FinManager</h1>
            <div className="flex items-center gap-2">
                <p className="text-[#9db9a6] text-xs font-normal">Dashboard</p>
                {subscription.tier === 'pro' && (
                    <span className="px-1.5 py-0.5 bg-primary text-background-dark text-[10px] font-bold rounded uppercase tracking-wider">PRO</span>
                )}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          <SidebarItem to="/" icon="dashboard" label="Overview" exact />
          <SidebarItem to="/transactions" icon="receipt_long" label="Transactions" />
          <SidebarItem to="/budget" icon="savings" label="Budgets" />
          <SidebarItem to="/reports" icon="bar_chart" label="Reports" />
          <SidebarItem to="/cards" icon="credit_card" label="Cards" />
        </nav>

        <div className="px-4 py-6 border-t border-[#28392e]">
          {subscription.tier === 'free' && (
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-[#1c271f] to-background-dark border border-[#3b5443] relative overflow-hidden group">
                  <div className="relative z-10">
                      <h4 className="text-white font-bold text-sm mb-1">Upgrade to Pro</h4>
                      <p className="text-[#9db9a6] text-xs mb-3">Unlock unlimited AI insights and reports.</p>
                      <NavLink to="/subscription" className="block w-full py-2 bg-primary hover:bg-green-400 text-background-dark text-xs font-bold text-center rounded-lg transition-colors">
                          Upgrade Now
                      </NavLink>
                  </div>
              </div>
          )}

          <NavLink
            to="/subscription"
             className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-2 ${
                    isActive ? 'text-white bg-surface-dark-light' : 'text-[#9db9a6] hover:bg-surface-dark-light hover:text-white'
                }`
            }
          >
             <span className="material-symbols-outlined">star</span>
             <span className="font-medium">Subscription</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-2 ${
                    isActive ? 'text-white bg-surface-dark-light' : 'text-[#9db9a6] hover:bg-surface-dark-light hover:text-white'
                }`
            }
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium">Settings</span>
          </NavLink>
          
          <div className="bg-[#111813] rounded-xl p-3 mt-4 border border-[#3b5443]">
            <div className="flex items-center gap-3 mb-3">
                <div className="size-8 rounded-full bg-gradient-to-br from-primary to-green-700 flex items-center justify-center text-[#111813] font-bold text-xs">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-[#9db9a6] text-xs truncate w-32">{user?.email || 'user@example.com'}</p>
                </div>
            </div>
            <button 
                onClick={handleSignOut}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2 rounded-lg transition-colors"
            >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Mobile Header (visible only on small screens) */}
        <header className="lg:hidden h-16 border-b border-[#28392e] flex items-center justify-between px-4 bg-background-dark z-20">
             <div className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-[#111813]">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              </div>
              <span className="text-white font-bold">FinManager</span>
              {subscription.tier === 'pro' && (
                    <span className="px-1.5 py-0.5 bg-primary text-background-dark text-[10px] font-bold rounded uppercase tracking-wider">PRO</span>
                )}
            </div>
             <button className="text-white" onClick={() => document.body.classList.toggle('sidebar-open')}>
                <span className="material-symbols-outlined">menu</span>
             </button>
        </header>

        {children}
      </div>
    </div>
  );
};
