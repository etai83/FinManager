import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NavLink } from 'react-router-dom';

export const Reports = () => {
    const { subscription } = useAuth();
    const isPro = subscription.tier === 'pro';

    return (
        <div className="relative h-full flex flex-col p-8 bg-background-dark overflow-hidden">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Advanced Reports</h1>
                    <p className="text-[#9db9a6]">Deep dive into your financial health</p>
                </div>
            </header>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                 {/* Mock Reports Content */}
                 <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6 opacity-80 filter blur-[2px] pointer-events-none select-none">
                     <div className="h-48 bg-[#111813] rounded-xl mb-4"></div>
                     <div className="h-4 w-1/2 bg-[#28392e] rounded mb-2"></div>
                     <div className="h-4 w-3/4 bg-[#28392e] rounded"></div>
                 </div>
                 <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6 opacity-80 filter blur-[2px] pointer-events-none select-none">
                     <div className="h-48 bg-[#111813] rounded-xl mb-4"></div>
                     <div className="h-4 w-1/2 bg-[#28392e] rounded mb-2"></div>
                     <div className="h-4 w-3/4 bg-[#28392e] rounded"></div>
                 </div>
                  <div className="bg-surface-dark border border-[#28392e] rounded-2xl p-6 opacity-80 filter blur-[2px] pointer-events-none select-none">
                     <div className="h-48 bg-[#111813] rounded-xl mb-4"></div>
                     <div className="h-4 w-1/2 bg-[#28392e] rounded mb-2"></div>
                     <div className="h-4 w-3/4 bg-[#28392e] rounded"></div>
                 </div>
                 
                 {/* Lock Overlay */}
                 {!isPro && (
                     <div className="absolute inset-0 z-10 flex items-center justify-center">
                         <div className="bg-[#111813]/90 backdrop-blur-md border border-[#3b5443] p-8 rounded-2xl max-w-md text-center shadow-2xl">
                             <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                 <span className="material-symbols-outlined text-3xl">lock</span>
                             </div>
                             <h2 className="text-2xl font-bold text-white mb-2">Pro Feature</h2>
                             <p className="text-[#9db9a6] mb-6">Upgrade to FinManager Pro to access detailed financial reports, trend analysis, and exports.</p>
                             <NavLink to="/subscription" className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-green-400 text-background-dark font-bold rounded-lg transition-colors">
                                 Upgrade to Unlock
                             </NavLink>
                         </div>
                     </div>
                 )}

                 {/* Pro Content Placeholder (Visible if unlocked) */}
                 {isPro && (
                     <div className="absolute inset-0 bg-background-dark z-20 flex items-center justify-center">
                          <div className="text-center">
                             <div className="size-20 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl text-primary">bar_chart</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Reports Unlocked</h2>
                            <p className="text-[#9db9a6]">Full reporting suite is being generated...</p>
                        </div>
                     </div>
                 )}
            </div>
        </div>
    );
};
