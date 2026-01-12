export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  status: 'Completed' | 'Pending';
  type: 'income' | 'expense';
  logo?: string;
  logoColor?: string;
}

export interface Budget {
  id: string;
  category: string;
  spent: number;
  total: number;
  type: 'Monthly' | 'Fixed' | 'Variable';
  icon: string;
  colorClass: string; // Tailwind color class prefix (e.g., 'orange', 'blue')
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'trend' | 'opportunity';
  title: string;
  description: string;
  amount?: number;
  actionLabel?: string;
  secondaryActionLabel?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  dataViz?: {
    type: 'bar';
    data: { label: string; value: number; color?: string }[];
  };
}

export type SubscriptionTier = 'free' | 'pro';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  periodEnd: number;
}
