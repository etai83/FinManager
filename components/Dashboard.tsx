import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { NavLink } from 'react-router-dom';
import { MOCK_TRANSACTIONS, MOCK_BUDGETS, PLANS } from '../constants';
import { chatWithFinancialAssistant } from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';

// Mock data for the chart
const CHART_DATA = [
  { day: 'Mon', income: 4000, expense: 2400 },
  { day: 'Tue', income: 3000, expense: 1398 },
  { day: 'Wed', income: 2000, expense: 5800 },
  { day: 'Thu', income: 2780, expense: 3908 },
  { day: 'Fri', income: 1890, expense: 4800 },
  { day: 'Sat', income: 2390, expense: 3800 },
  { day: 'Sun', income: 3490, expense: 4300 },
];

export const Dashboard = () => {
  const { config } = useAI();
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const { checkAILimit, incrementAIUsage, subscription, aiUsageCount } = useAuth();
  const isPro = subscription.tier === 'pro';

  const handleAskAI = async () => {
    if (!aiQuery.trim()) return;
    
    if (!checkAILimit()) {
        setLimitReached(true);
        return;
    }

    setLoadingAi(true);
    setAiResponse(null);
    setLimitReached(false);
    
    incrementAIUsage();
    
    const response = await chatWithFinancialAssistant(aiQuery, [], MOCK_TRANSACTIONS, config);
    setAiResponse(response);
    setLoadingAi(false);
  };

  return (
    <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-background-dark">
      {/* Top Header */}
      <header className="hidden lg:flex h-20 border-b border-[#28392e] items-center justify-between px-8 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20">
        <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center bg-surface-dark border border-[#28392e] rounded-lg px-3 py-2 w-64">
            <span className="material-symbols-outlined text-[#9db9a6] text-[20px]">search</span>
            <input
              className="bg-transparent border-none text-white text-sm focus:ring-0 w-full placeholder-[#5a6b5f]"
              placeholder="Search transactions..."
              type="text"
            />
          </div>
          <button className="flex items-center justify-center size-10 rounded-full bg-surface-dark border border-[#28392e] text-white hover:bg-surface-dark-light relative">
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full"></span>
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="h-8 w-[1px] bg-[#28392e] mx-2"></div>
          <button className="flex items-center gap-2 bg-surface-dark hover:bg-surface-dark-light border border-[#28392e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>Oct 2023</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              title="Total Balance"
              amount="$24,500.00"
              trend="+12.5%"
              icon="account_balance"
              iconColor="text-primary"
              trendColor="text-primary"
              trendBg="bg-primary/10"
              progress={75}
              progressColor="bg-primary"
            />
            <KpiCard
              title="Monthly Income"
              amount="$5,200.00"
              trend="+5.2%"
              icon="payments"
              iconColor="text-[#4ecdc4]"
              trendColor="text-[#4ecdc4]"
              trendBg="bg-[#4ecdc4]/10"
              chartMode="bars"
              chartColor="bg-[#4ecdc4]"
            />
            <KpiCard
              title="Monthly Expenses"
              amount="$3,100.00"
              trend="-2.4%"
              icon="shopping_cart"
              iconColor="text-danger"
              trendColor="text-danger"
              trendBg="bg-danger/10"
              chartMode="bars-desc"
              chartColor="bg-danger"
            />
            <KpiCard
              title="Net Savings"
              amount="$2,100.00"
              trend="+8.1%"
              icon="savings"
              iconColor="text-white"
              trendColor="text-primary"
              trendBg="bg-primary/10"
              progress={105}
              progressColor="bg-white"
              footer="Target: $2,000"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Charts Column */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Cash Flow Chart */}
              <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6 h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white text-lg font-bold">Cash Flow Analysis</h3>
                    <p className="text-[#9db9a6] text-sm">Income vs Expenses</p>
                  </div>
                  <div className="flex bg-[#28392e] rounded-lg p-1">
                    <button className="px-3 py-1 rounded-md text-xs font-bold text-white bg-white/10">Week</button>
                    <button className="px-3 py-1 rounded-md text-xs font-bold text-[#9db9a6] hover:text-white">Month</button>
                  </div>
                </div>
                <div className="flex-1 w-full h-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#13ec5b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#5a6b5f', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1c271f', borderColor: '#3b5443', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#13ec5b" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                      <Area type="monotone" dataKey="expense" stroke="#fa5538" fillOpacity={0} fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Secondary Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6 flex flex-col h-[350px]">
                  <h3 className="text-white text-lg font-bold mb-4">Spending Breakdown</h3>
                   {/* Simplified visual for Pie Chart */}
                  <div className="flex-1 flex items-center justify-center gap-6">
                    <div className="relative size-40 flex-shrink-0">
                        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#28392e" strokeWidth="4"></path>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 15.15 11.0" fill="none" stroke="#13ec5b" strokeDasharray="40, 100" strokeWidth="4"></path>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#fa5538" strokeDasharray="20, 100" strokeDashoffset="-40" strokeWidth="4"></path>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#4ecdc4" strokeDasharray="15, 100" strokeDashoffset="-60" strokeWidth="4"></path>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#9db9a6" strokeDasharray="25, 100" strokeDashoffset="-75" strokeWidth="4"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[#9db9a6] text-xs">Total</span>
                            <span className="text-white text-xl font-bold">$3,100</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                         <div className="flex items-center gap-2">
                             <div className="size-3 rounded-full bg-primary"></div>
                             <span className="text-[#9db9a6]">Housing</span>
                             <span className="text-white font-bold ml-auto">40%</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="size-3 rounded-full bg-danger"></div>
                             <span className="text-[#9db9a6]">Food</span>
                             <span className="text-white font-bold ml-auto">20%</span>
                         </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6 flex flex-col overflow-y-auto h-[350px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white text-lg font-bold">Budgets</h3>
                    <button className="text-primary text-sm font-bold hover:underline">View All</button>
                  </div>
                  <div className="flex flex-col gap-6">
                    {MOCK_BUDGETS.slice(0, 3).map(budget => (
                      <div key={budget.id} className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#28392e] p-1.5 rounded-lg">
                              <span className="material-symbols-outlined text-[18px] text-white">{budget.icon}</span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-bold">{budget.category}</p>
                              <p className="text-[#9db9a6] text-xs">${budget.spent} / ${budget.total}</p>
                            </div>
                          </div>
                          <span className={`${budget.spent > budget.total ? 'text-danger' : 'text-primary'} text-sm font-bold`}>
                            {Math.round((budget.spent / budget.total) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#28392e] rounded-full overflow-hidden w-full">
                          <div 
                            className={`h-full rounded-full ${budget.spent > budget.total ? 'bg-danger' : 'bg-primary'}`} 
                            style={{ width: `${Math.min((budget.spent / budget.total) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI & Transactions */}
            <div className="flex flex-col gap-6">
               {/* AI Widget */}
              <div className="bg-gradient-to-b from-[#1c271f] to-[#111813] border border-primary/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(19,236,91,0.05)]">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <span className="material-symbols-outlined text-primary animate-pulse">auto_awesome</span>
                    <h3 className="text-white text-lg font-bold">AI Insights</h3>
                    {!isPro && (
                      <div className="ml-auto text-xs font-medium text-[#9db9a6] bg-[#111813] px-2 py-1 rounded border border-[#28392e] z-10">
                        {aiUsageCount}/{PLANS.FREE.limitAI} Free Queries
                      </div>
                    )}
                </div>
                
                {/* Generated Response Area */}
                {aiResponse && (
                    <div className="bg-[#28392e]/80 border border-primary/20 rounded-xl p-4 mb-4 relative z-10">
                        <p className="text-white text-sm leading-relaxed">{aiResponse}</p>
                    </div>
                )}
                
                {/* Default Insight Cards */}
                {!aiResponse && !limitReached && (
                  <div className="space-y-4 relative z-10">
                      <div className="bg-[#28392e]/50 border border-[#3b5443] rounded-xl p-4">
                          <div className="flex items-start gap-3">
                              <div className="text-danger mt-1">
                                  <span className="material-symbols-outlined text-[20px]">warning</span>
                              </div>
                              <div>
                                  <h4 className="text-white text-sm font-bold">Dining Out Spike</h4>
                                  <p className="text-[#9db9a6] text-sm leading-snug mt-1">
                                      Your dining expenses are <span className="text-white font-bold">15% higher</span> than usual.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
                )}

                {limitReached && (
                    <div className="bg-[#28392e]/80 border border-yellow-500/20 rounded-xl p-4 mb-4 relative z-10">
                        <div className="text-yellow-500 font-bold mb-1 flex items-center gap-2">
                             <span className="material-symbols-outlined">lock</span> Daily Limit Reached
                        </div>
                        <p className="text-white text-sm leading-relaxed mb-3">You've used your daily free AI queries. Upgrade to Pro for unlimited access.</p>
                        <NavLink to="/subscription" className="text-xs bg-primary text-background-dark font-bold px-3 py-1.5 rounded hover:bg-green-400">
                            Upgrade Now
                        </NavLink>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#28392e] flex items-center gap-2">
                    <input 
                      className="bg-[#111813] border-none text-sm text-white rounded-lg flex-1 focus:ring-1 focus:ring-primary placeholder-[#5a6b5f] py-2" 
                      placeholder={limitReached ? "Upgrade to continue chatting" : "Ask AI about your finances..."}
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                      disabled={limitReached}
                    />
                    <button 
                      onClick={handleAskAI}
                      disabled={loadingAi || limitReached}
                      className="bg-primary text-[#111813] p-2 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${loadingAi ? 'animate-spin' : ''}`}>
                        {loadingAi ? 'sync' : 'send'}
                      </span>
                    </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6 flex-1 flex flex-col min-h-[400px]">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white text-lg font-bold">Recent</h3>
                      <button className="text-sm text-[#9db9a6] hover:text-white">See all</button>
                  </div>
                  <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
                      {MOCK_TRANSACTIONS.slice(0, 5).map(tx => (
                          <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                              <div className="flex items-center gap-3">
                                  <div className="bg-[#28392e] p-2 rounded-full group-hover:bg-[#3b5443] transition-colors">
                                      <span className={`material-symbols-outlined text-[20px] ${tx.type === 'income' ? 'text-primary' : 'text-white'}`}>
                                        {tx.logo}
                                      </span>
                                  </div>
                                  <div>
                                      <p className="text-white text-sm font-bold">{tx.merchant}</p>
                                      <p className="text-[#9db9a6] text-xs">{tx.date}</p>
                                  </div>
                              </div>
                              <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-primary' : 'text-white'}`}>
                                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                              </p>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Component for KPI Cards
const KpiCard = ({ title, amount, trend, icon, iconColor, trendColor, trendBg, chartMode, chartColor, progress, progressColor, footer }: any) => {
  return (
    <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6 group hover:border-[#3b5443] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`bg-[#28392e] p-3 rounded-xl ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`flex items-center ${trendColor} ${trendBg} px-2 py-1 rounded-md text-xs font-bold`}>
          <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> {trend}
        </span>
      </div>
      <p className="text-[#9db9a6] text-sm font-medium">{title}</p>
      <h3 className="text-white text-3xl font-bold mt-1 tracking-tight">{amount}</h3>
      
      {/* Visual variations based on props */}
      {progress && (
        <div className="mt-4 flex items-center gap-2">
            {footer && <span className="text-xs text-[#9db9a6]">{footer}</span>}
            <div className="h-1.5 bg-[#28392e] rounded-full overflow-hidden flex-1">
                <div className={`h-full ${progressColor} rounded-full`} style={{width: `${progress}%`}}></div>
            </div>
        </div>
      )}

      {chartMode === 'bars' && (
         <div className="mt-4 h-10 -mb-2 w-full flex items-end gap-1">
            {[20, 40, 30, 60, 50, 90].map((h, i) => (
                <div key={i} className={`w-1/6 ${chartColor} rounded-t-sm`} style={{ height: `${h}%`, opacity: (i+2)/10 }}></div>
            ))}
         </div>
      )}
       {chartMode === 'bars-desc' && (
         <div className="mt-4 h-10 -mb-2 w-full flex items-end gap-1">
            {[80, 60, 70, 50, 40, 30].map((h, i) => (
                <div key={i} className={`w-1/6 ${chartColor} rounded-t-sm`} style={{ height: `${h}%`, opacity: (i+2)/10 }}></div>
            ))}
         </div>
      )}
    </div>
  );
}
