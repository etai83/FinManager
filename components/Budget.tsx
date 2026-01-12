import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MOCK_BUDGETS, MOCK_TRANSACTIONS, INITIAL_INSIGHTS } from '../constants';
import { generateFinancialInsights } from '../services/aiService';
import { AIInsight } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';

export const BudgetPage = () => {
  const { subscription } = useAuth();
  const { config } = useAI();
  const [insights, setInsights] = useState<AIInsight[]>(INITIAL_INSIGHTS);
  const [analyzing, setAnalyzing] = useState(false);
  const [customTip, setCustomTip] = useState<string | null>(null);
  const isPro = subscription.tier === 'pro';

  const handleGenerateTips = async () => {
    if (!isPro) return; // Prevention
    setAnalyzing(true);
    const tip = await generateFinancialInsights(MOCK_TRANSACTIONS, MOCK_BUDGETS, config);
    setCustomTip(tip);
    setAnalyzing(false);
  };

  return (
    <div className="flex flex-col xl:flex-row h-full w-full bg-background-light dark:bg-background-dark overflow-y-auto p-4 md:p-8 gap-8">
       {/* Main Budget Content */}
       <main className="flex-1 flex flex-col gap-8 min-w-0">
           {/* Header */}
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#111813] dark:text-white text-3xl md:text-4xl font-black leading-tight">Monthly Budget Plan</h1>
                    <p className="text-[#6b7280] dark:text-[#9db9a6] text-base font-normal max-w-lg">Track your spending and optimize your savings with real-time updates.</p>
                </div>
                <button className="flex shrink-0 items-center justify-center rounded-lg h-11 px-6 bg-[#111813] dark:bg-surface-dark-light hover:bg-[#28392e] dark:hover:bg-[#3b5443] text-white text-sm font-bold transition-colors shadow-lg">
                    <span className="material-symbols-outlined mr-2 text-[20px]">add</span> Create New Budget
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#e0e0e0] dark:border-[#3b5443] bg-white dark:bg-surface-dark shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-[#6b7280] dark:text-white/80 text-sm font-medium">Total Budgeted</p>
                        <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9db9a6]">account_balance</span>
                    </div>
                    <p className="text-[#111813] dark:text-white text-3xl font-bold tracking-tight">$4,200</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#e0e0e0] dark:border-[#3b5443] bg-white dark:bg-surface-dark shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-[#6b7280] dark:text-white/80 text-sm font-medium">Total Spent</p>
                        <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9db9a6]">credit_card</span>
                    </div>
                    <p className="text-[#111813] dark:text-white text-3xl font-bold tracking-tight">$2,850</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#e0e0e0] dark:border-[#3b5443] bg-white dark:bg-surface-dark shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
                    <div className="flex items-center justify-between">
                        <p className="text-[#6b7280] dark:text-white/80 text-sm font-medium">Remaining</p>
                        <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9db9a6]">savings</span>
                    </div>
                    <p className="text-[#111813] dark:text-white text-3xl font-bold tracking-tight">$1,350</p>
                </div>
            </div>

            {/* Budget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {MOCK_BUDGETS.map(budget => {
                    const pct = Math.min((budget.spent / budget.total) * 100, 100);
                    const isOver = budget.spent > budget.total;
                    
                    // Simple color mapping based on mock data classes
                    let colorBg = 'bg-blue-500'; 
                    let colorText = 'text-blue-500';
                    let iconBg = 'bg-blue-100 dark:bg-blue-900/30';
                    
                    if (budget.colorClass === 'orange') { colorBg = 'bg-orange-500'; colorText = 'text-orange-600'; iconBg='bg-orange-100 dark:bg-orange-900/30'; }
                    if (budget.colorClass === 'purple') { colorBg = 'bg-purple-500'; colorText = 'text-purple-600'; iconBg='bg-purple-100 dark:bg-purple-900/30'; }
                    if (budget.colorClass === 'red') { colorBg = 'bg-red-500'; colorText = 'text-red-600'; iconBg='bg-red-100 dark:bg-red-900/30'; }

                    return (
                        <div key={budget.id} className="group flex flex-col gap-4 rounded-xl border border-[#e0e0e0] dark:border-[#3b5443] bg-white dark:bg-surface-dark p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full ${iconBg} flex items-center justify-center ${colorText}`}>
                                        <span className="material-symbols-outlined">{budget.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#111813] dark:text-white">{budget.category}</h3>
                                        <p className="text-xs text-[#6b7280] dark:text-[#9db9a6]">{budget.type}</p>
                                    </div>
                                </div>
                                <span className={`bg-primary/10 text-[#111813] dark:text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{Math.round(pct)}%</span>
                            </div>
                            <div>
                                <div className="flex items-end gap-1 mb-2">
                                    <span className="text-2xl font-bold text-[#111813] dark:text-white">${budget.spent}</span>
                                    <span className="text-xs text-[#6b7280] dark:text-[#9db9a6] font-medium mb-1"> / ${budget.total}</span>
                                </div>
                                <div className="h-2 w-full bg-[#f3f4f6] dark:bg-surface-dark-light rounded-full overflow-hidden">
                                    <div className={`h-full ${isOver ? 'bg-red-500' : colorBg} rounded-full relative transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
       </main>

       {/* Right Sidebar: AI Tips */}
       <aside className="w-full xl:w-[380px] shrink-0 flex flex-col gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#13ec5b]/20 to-transparent p-6 border border-primary/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary rounded-lg text-[#111813] shadow-lg shadow-primary/30">
                            <span className={`material-symbols-outlined ${analyzing ? 'animate-spin' : ''}`}>auto_awesome</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#111813] dark:text-white">AI Smart Tips</h2>
                    </div>
                    {customTip ? (
                        <p className="text-[#111813]/80 dark:text-white/80 text-sm mb-6 leading-relaxed whitespace-pre-line">
                            {customTip}
                        </p>
                    ) : (
                        <p className="text-[#111813]/80 dark:text-white/80 text-sm mb-6 leading-relaxed">
                            {isPro ? "Based on your spending patterns this month, we can find potential savings." : "Upgrade to Pro to get personalized AI budget recommendations."}
                        </p>
                    )}
                    
                    {!isPro ? (
                        <NavLink 
                            to="/subscription"
                            className="w-full py-3 bg-[#111813] dark:bg-white hover:bg-opacity-90 text-white dark:text-[#111813] text-sm font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                            <span>Unlock AI Tips</span>
                        </NavLink>
                    ) : (
                        <button 
                            onClick={handleGenerateTips}
                            disabled={analyzing}
                            className="w-full py-3 bg-[#111813] dark:bg-white hover:bg-opacity-90 text-white dark:text-[#111813] text-sm font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span>{analyzing ? 'Analyzing...' : customTip ? 'Refresh Analysis' : 'Analyze My Budgets'}</span>
                            {!analyzing && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-[#6b7280] dark:text-[#9db9a6] uppercase tracking-wider pl-1">Insights</h3>
                {insights.map(insight => (
                    <div key={insight.id} className="flex flex-col gap-3 rounded-xl border border-[#e0e0e0] dark:border-[#3b5443] bg-white dark:bg-surface-dark p-4 transition-transform hover:-translate-y-1 duration-300">
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 p-1.5 rounded-md ${insight.type === 'warning' ? 'bg-red-900/20 text-red-400' : insight.type === 'trend' ? 'bg-orange-900/20 text-orange-400' : 'bg-primary/10 text-primary'}`}>
                                <span className="material-symbols-outlined text-[20px]">
                                    {insight.type === 'warning' ? 'warning' : insight.type === 'trend' ? 'trending_up' : 'savings'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-base font-bold text-[#111813] dark:text-white">{insight.title}</h4>
                                <p className="text-sm text-[#6b7280] dark:text-[#9db9a6]">{insight.description}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-1">
                            {insight.secondaryActionLabel && (
                                <button className="text-xs font-bold text-[#6b7280] dark:text-[#9db9a6] px-3 py-1.5 hover:text-[#111813] dark:hover:text-white">
                                    {insight.secondaryActionLabel}
                                </button>
                            )}
                            <button className="text-xs font-bold bg-primary/10 text-primary-dark dark:text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-colors">
                                {insight.actionLabel}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
       </aside>
    </div>
  );
};
