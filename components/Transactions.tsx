import React, { useState, useRef, useEffect } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { chatWithFinancialAssistant } from '../services/aiService';
import { ChatMessage } from '../types';
import { useAI } from '../contexts/AIContext';

export const Transactions = () => {
  const { config } = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! 👋 I've analyzed your transactions for October. Ask me about your spending!",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await chatWithFinancialAssistant(userMsg.text, history, MOCK_TRANSACTIONS, config);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full bg-background-dark overflow-hidden">
      {/* Left Area: Transactions Table */}
      <div className="flex-1 flex flex-col h-full min-w-0 border-r border-[#28392e]">
        <header className="h-16 border-b border-[#28392e] flex items-center justify-between px-8 bg-background-dark/95 backdrop-blur z-20">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Transactions</h2>
                <span className="h-4 w-px bg-[#28392e]"></span>
                <div className="flex items-center text-[#9db9a6] text-sm gap-1">
                    <span>Oct 2023</span>
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </div>
            </div>
        </header>
        
        {/* Controls */}
        <div className="px-8 py-6 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[300px]">
                    <div className="relative flex-1 max-w-md group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9db9a6] material-symbols-outlined">search</span>
                        <input className="w-full bg-surface-dark border border-[#28392e] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-[#9db9a6]/60" placeholder="Search transactions..." type="text"/>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-green-400 text-background-dark rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(19,236,91,0.2)]">
                    <span className="material-symbols-outlined text-[20px]">add</span> Add Transaction
                </button>
            </div>
            {/* Chips */}
            <div className="flex items-center gap-2 overflow-x-auto">
                 {['All', 'Income', 'Expenses', 'Dining', 'Transport'].map((f, i) => (
                     <button key={f} className={`px-3 py-1.5 rounded-full text-sm font-medium border border-[#28392e] transition-colors ${i === 0 ? 'bg-white text-background-dark font-bold' : 'bg-surface-dark text-[#9db9a6] hover:text-white'}`}>
                        {f}
                     </button>
                 ))}
            </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 pb-8">
            <div className="w-full text-left">
                 <div className="sticky top-0 bg-background-dark z-10 grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 py-3 border-b border-[#28392e] text-xs uppercase tracking-wider font-semibold text-[#9db9a6]">
                    <div>Date</div>
                    <div>Merchant</div>
                    <div>Category</div>
                    <div className="text-right">Amount</div>
                    <div>Status</div>
                    <div className="text-center"></div>
                </div>
                <div className="space-y-1 mt-2">
                    {MOCK_TRANSACTIONS.map(tx => (
                        <div key={tx.id} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center py-3 bg-surface-dark/30 hover:bg-surface-dark rounded-lg border border-transparent hover:border-[#28392e] transition-all cursor-pointer">
                            <div className="text-sm text-white font-medium pl-2">{tx.date}</div>
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-surface-dark-light flex items-center justify-center p-1.5">
                                   <span className="material-symbols-outlined text-white text-xs">{tx.logo}</span>
                                </div>
                                <span className="text-sm text-white font-medium">{tx.merchant}</span>
                            </div>
                            <div><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-[#9db9a6] border border-white/10">{tx.category}</span></div>
                            <div className={`text-right text-sm font-display font-medium ${tx.type === 'income' ? 'text-primary' : 'text-white'}`}>
                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </div>
                             <div className="flex items-center gap-2">
                                <span className={`size-2 rounded-full ${tx.status === 'Completed' ? 'bg-primary' : 'bg-yellow-500'}`}></span>
                                <span className="text-sm text-[#9db9a6]">{tx.status}</span>
                            </div>
                             <button className="text-[#9db9a6] hover:text-white px-2"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Right Area: AI Chat */}
      <aside className="w-[360px] flex-shrink-0 bg-surface-dark border-l border-[#28392e] flex flex-col relative z-20 shadow-xl">
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#28392e] bg-surface-dark">
            <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-primary">colors_spark</span>
                <span className="font-bold text-lg">AI Assistant</span>
            </div>
             <button className="p-2 text-[#9db9a6] hover:text-white rounded-lg transition-colors">
                <span className="material-symbols-outlined">refresh</span>
            </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`size-8 rounded-full flex-shrink-0 flex items-center justify-center border ${msg.role === 'model' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-surface-dark-light text-white border-white/10'}`}>
                        <span className="material-symbols-outlined text-sm">{msg.role === 'model' ? 'smart_toy' : 'person'}</span>
                    </div>
                     <div className={`${msg.role === 'model' ? 'bg-[#28392e] border border-[#3b5443] text-gray-200' : 'bg-white text-background-dark'} p-4 rounded-2xl ${msg.role === 'model' ? 'rounded-tl-none' : 'rounded-tr-none'} text-sm leading-relaxed shadow-sm max-w-[85%]`}>
                        <p>{msg.text}</p>
                    </div>
                 </div>
            ))}
            {loading && (
                 <div className="flex gap-4">
                     <div className="size-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary border border-primary/20 animate-pulse">
                        <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                    <div className="bg-[#28392e] border border-[#3b5443] p-4 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                            <span className="size-2 bg-primary rounded-full animate-bounce"></span>
                            <span className="size-2 bg-primary rounded-full animate-bounce delay-75"></span>
                            <span className="size-2 bg-primary rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                 </div>
            )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#28392e] bg-surface-dark">
            <div className="relative">
                <input 
                    className="w-full bg-[#111813] border border-[#28392e] text-white text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-lg placeholder:text-[#9db9a6]/50" 
                    placeholder="Ask AI anything..." 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={loading}
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-background-dark rounded-lg hover:bg-green-400 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
            </div>
        </div>
      </aside>
    </div>
  );
};
