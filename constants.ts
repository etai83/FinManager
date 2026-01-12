import { Budget, Transaction, AIInsight } from './types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    merchant: 'Uber Ride',
    category: 'Transport',
    amount: 24.50,
    status: 'Completed',
    type: 'expense',
    logo: 'directions_car'
  },
  {
    id: '2',
    date: 'Oct 23, 2023',
    merchant: 'Stripe Payout',
    category: 'Income',
    amount: 1200.00,
    status: 'Pending',
    type: 'income',
    logo: 'payments',
    logoColor: '#635BFF'
  },
  {
    id: '3',
    date: 'Oct 22, 2023',
    merchant: 'Amazon AWS',
    category: 'Software',
    amount: 64.00,
    status: 'Completed',
    type: 'expense',
    logo: 'cloud'
  },
  {
    id: '4',
    date: 'Oct 21, 2023',
    merchant: 'Starbucks',
    category: 'Dining',
    amount: 12.50,
    status: 'Completed',
    type: 'expense',
    logo: 'coffee'
  },
  {
    id: '5',
    date: 'Oct 20, 2023',
    merchant: 'Netflix',
    category: 'Subscription',
    amount: 15.99,
    status: 'Completed',
    type: 'expense',
    logo: 'movie',
    logoColor: '#E50914'
  },
  {
    id: '6',
    date: 'Oct 19, 2023',
    merchant: 'Whole Foods',
    category: 'Groceries',
    amount: 84.20,
    status: 'Completed',
    type: 'expense',
    logo: 'shopping_bag'
  },
  {
    id: '7',
    date: 'Oct 18, 2023',
    merchant: 'Shell Station',
    category: 'Transport',
    amount: 45.00,
    status: 'Completed',
    type: 'expense',
    logo: 'local_gas_station'
  }
];

export const MOCK_BUDGETS: Budget[] = [
  {
    id: '1',
    category: 'Groceries',
    spent: 450,
    total: 600,
    type: 'Monthly',
    icon: 'shopping_cart',
    colorClass: 'orange'
  },
  {
    id: '2',
    category: 'Housing',
    spent: 1800,
    total: 1800,
    type: 'Fixed',
    icon: 'home',
    colorClass: 'blue'
  },
  {
    id: '3',
    category: 'Transport',
    spent: 120,
    total: 200,
    type: 'Variable',
    icon: 'directions_car',
    colorClass: 'purple'
  },
  {
    id: '4',
    category: 'Entertainment',
    spent: 330,
    total: 300,
    type: 'Variable',
    icon: 'movie',
    colorClass: 'red' // Over budget
  },
  {
    id: '5',
    category: 'Utilities',
    spent: 150,
    total: 150,
    type: 'Fixed',
    icon: 'bolt',
    colorClass: 'cyan'
  }
];

export const INITIAL_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Subscription Alert',
    description: 'You have 2 unused subscriptions (Gym, Magazine). Cancel to save $25/mo.',
    actionLabel: 'Review'
  },
  {
    id: '2',
    type: 'trend',
    title: 'Dining Out Trend',
    description: 'Restaurant spend is up 15%. Consider cooking at home this weekend.',
    actionLabel: 'Set Limit'
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'Savings Opportunity',
    description: 'Moving $50 to a high-yield savings account could earn you 4.5% APY.',
    actionLabel: 'Transfer',
    secondaryActionLabel: 'Later'
  }
];

export const PLANS = {
  FREE: {
    id: 'price_free',
    name: 'Starter',
    price: 0,
    description: 'Essential tools for personal finance.',
    features: ['Basic Expense Tracking', 'Monthly Budgeting', '3 AI Queries / Day', 'Community Support'],
    limitAI: 3
  },
  PRO: {
    id: 'price_pro',
    name: 'Pro',
    price: 12,
    description: 'Advanced insights and unlimited power.',
    features: ['Unlimited AI Insights', 'Advanced Reports & Trends', 'Export to CSV/PDF', 'Priority Email Support', 'Multiple Wallets'],
    limitAI: Infinity
  }
};
