import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PLANS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession, createPortalSession } from '../services/stripeService';

export const SubscriptionPage = () => {
    const { subscription, upgradeToPro, downgradeToFree } = useAuth();
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [message, setMessage] = useState<{ type: 'success' | 'info', text: string } | null>(null);

    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            upgradeToPro();
            setMessage({ type: 'success', text: 'Subscription upgraded to Pro successfully!' });
            // Clean URL
            setSearchParams({});
        }
        if (searchParams.get('portal') === 'true') {
            setMessage({ type: 'info', text: 'Billing portal simulation opened.' });
            setSearchParams({});
        }
    }, [searchParams, upgradeToPro, setSearchParams]);

    const handleSubscribe = async (priceId: string) => {
        setLoading(true);
        try {
            const { url } = await createCheckoutSession(priceId);
            window.location.href = url; // In reality this goes to Stripe
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleManage = async () => {
        setLoading(true);
        try {
             const { url } = await createPortalSession();
             // For demo, we just downgrade toggle or show message
             // window.location.href = url; 
             downgradeToFree();
             setMessage({ type: 'info', text: 'Downgraded to Free plan (Demo Action).' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-dark">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white">Choose Your Plan</h1>
                    <p className="text-[#9db9a6]">Unlock the full power of AI financial tracking.</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-sm text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Free Plan */}
                    <div className={`relative p-8 rounded-2xl border ${subscription.tier === 'free' ? 'bg-surface-dark border-primary shadow-[0_0_20px_rgba(19,236,91,0.1)]' : 'bg-[#111813] border-[#28392e]'} flex flex-col`}>
                        {subscription.tier === 'free' && (
                            <div className="absolute top-4 right-4 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/20">
                                Current Plan
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-white mb-2">{PLANS.FREE.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-white">$0</span>
                            <span className="text-[#9db9a6]">/month</span>
                        </div>
                        <p className="text-[#9db9a6] text-sm mb-8">{PLANS.FREE.description}</p>
                        
                        <ul className="space-y-4 mb-8 flex-1">
                            {PLANS.FREE.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white">
                                    <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button 
                            disabled={subscription.tier === 'free'}
                            className="w-full py-3 rounded-lg font-bold text-sm bg-[#28392e] text-[#9db9a6] cursor-not-allowed border border-transparent"
                        >
                            {subscription.tier === 'free' ? 'Active' : 'Downgrade'}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className={`relative p-8 rounded-2xl border ${subscription.tier === 'pro' ? 'bg-gradient-to-br from-surface-dark to-[#1c271f] border-primary shadow-[0_0_30px_rgba(19,236,91,0.15)]' : 'bg-surface-dark border-[#28392e]'} flex flex-col transform md:-translate-y-4 md:shadow-2xl`}>
                        {subscription.tier === 'pro' && (
                            <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-background-dark text-xs font-bold rounded-full shadow-lg">
                                Active
                            </div>
                        )}
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-background-dark text-xs font-bold rounded-full shadow-lg border border-white/20">
                             MOST POPULAR
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{PLANS.PRO.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-white">${PLANS.PRO.price}</span>
                            <span className="text-[#9db9a6]">/month</span>
                        </div>
                        <p className="text-[#9db9a6] text-sm mb-8">{PLANS.PRO.description}</p>
                        
                        <ul className="space-y-4 mb-8 flex-1">
                            {PLANS.PRO.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white">
                                    <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {subscription.tier === 'pro' ? (
                             <button 
                                onClick={handleManage}
                                disabled={loading}
                                className="w-full py-3 rounded-lg font-bold text-sm bg-[#28392e] hover:bg-[#3b5443] text-white border border-[#3b5443] transition-colors"
                            >
                                {loading ? 'Processing...' : 'Manage Subscription'}
                            </button>
                        ) : (
                             <button 
                                onClick={() => handleSubscribe(PLANS.PRO.id)}
                                disabled={loading}
                                className="w-full py-3 rounded-lg font-bold text-sm bg-primary hover:bg-green-400 text-background-dark shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5"
                            >
                                {loading ? 'Processing...' : 'Upgrade to Pro'}
                            </button>
                        )}
                    </div>

                    {/* Team Plan (Coming Soon) */}
                    <div className="relative p-8 rounded-2xl border border-[#28392e] bg-[#111813] opacity-60 flex flex-col">
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#28392e] text-[#9db9a6] text-xs font-bold rounded-full border border-[#3b5443]">
                            Coming Soon
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Team</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-white">--</span>
                        </div>
                        <p className="text-[#9db9a6] text-sm mb-8">For families and finance teams.</p>
                        
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Shared Wallets', 'Role-based Access', 'Consolidated Reports', 'Admin Dashboard', 'API Access'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-[#9db9a6]">
                                    <span className="material-symbols-outlined text-[#5a6b5f] text-[20px]">check</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button 
                            disabled
                            className="w-full py-3 rounded-lg font-bold text-sm bg-[#28392e] text-[#5a6b5f] cursor-not-allowed border border-transparent"
                        >
                            Join Waitlist
                        </button>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-[#111813] border border-[#28392e] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-[#28392e] text-[#9db9a6]">
                            <span className="material-symbols-outlined">shield</span>
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Secure Payments via Stripe</h4>
                            <p className="text-xs text-[#9db9a6]">Your payment information is encrypted and secure.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-10 bg-white/10 rounded"></div>
                        <div className="h-6 w-10 bg-white/10 rounded"></div>
                        <div className="h-6 w-10 bg-white/10 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};