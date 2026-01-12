import React, { createContext, useContext, useEffect, useState, ReactNode, PropsWithChildren } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserSubscription } from '../types';
import { PLANS } from '../constants';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: UserSubscription;
  signOut: () => Promise<void>;
  demoLogin: () => void;
  upgradeToPro: () => void; // Mock function for demo
  downgradeToFree: () => void; // Mock function for demo
  checkAILimit: () => boolean;
  incrementAIUsage: () => void;
  aiUsageCount: number;
}

const defaultSubscription: UserSubscription = {
    tier: 'free',
    status: 'active',
    periodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription>(defaultSubscription);
  const [aiUsageCount, setAiUsageCount] = useState(0);

  useEffect(() => {
    // Load local mocks for subscription and usage
    const savedSub = localStorage.getItem('finmanager_subscription');
    if (savedSub) {
        setSubscription(JSON.parse(savedSub));
    }
    const savedUsage = localStorage.getItem('finmanager_ai_usage');
    const savedDate = localStorage.getItem('finmanager_ai_usage_date');
    const today = new Date().toDateString();

    if (savedDate !== today) {
        // Reset usage if new day
        setAiUsageCount(0);
        localStorage.setItem('finmanager_ai_usage_date', today);
        localStorage.setItem('finmanager_ai_usage', '0');
    } else if (savedUsage) {
        setAiUsageCount(parseInt(savedUsage, 10));
    }

    if (!isSupabaseConfigured()) {
       // Check for "demo user" in local storage for preview purposes
       const demoUser = localStorage.getItem('demo_user');
       if (demoUser) {
           setUser(JSON.parse(demoUser) as User);
       }
       setLoading(false);
       return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
    } else {
        localStorage.removeItem('demo_user');
        setUser(null);
    }
  };

  const demoLogin = () => {
      const mockUser = {
          id: 'demo-123',
          email: 'demo@finmanager.ai',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
      } as User;
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
  };

  const upgradeToPro = () => {
      const newSub: UserSubscription = {
          tier: 'pro',
          status: 'active',
          periodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000
      };
      setSubscription(newSub);
      localStorage.setItem('finmanager_subscription', JSON.stringify(newSub));
  };

  const downgradeToFree = () => {
      const newSub: UserSubscription = {
          tier: 'free',
          status: 'active',
          periodEnd: Date.now()
      };
      setSubscription(newSub);
      localStorage.setItem('finmanager_subscription', JSON.stringify(newSub));
  };

  const checkAILimit = () => {
      if (subscription.tier === 'pro') return true;
      return aiUsageCount < PLANS.FREE.limitAI;
  };

  const incrementAIUsage = () => {
      if (subscription.tier === 'pro') return;
      const newCount = aiUsageCount + 1;
      setAiUsageCount(newCount);
      localStorage.setItem('finmanager_ai_usage', newCount.toString());
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        session, 
        loading, 
        signOut, 
        demoLogin, 
        subscription, 
        upgradeToPro, 
        downgradeToFree,
        checkAILimit,
        incrementAIUsage,
        aiUsageCount
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
