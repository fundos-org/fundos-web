import { StepStyleDTO } from 'react-form-stepper/dist/components/Step/StepTypes';

export type Stages = {
  value: string;
  title: string;
  description: string;
};

export const stepsList = [
  { label: 'Comapany', index: 0 },
  { label: 'Industry', index: 1 },
  { label: 'Customer', index: 2 },
  { label: 'Valuation', index: 3 },
  { label: 'Security', index: 4 },
];
export const subAdminStepsList = [
  { label: 'Details', index: 0 },
  { label: 'Configuration', index: 1 },
];
export const targetCustomers = [
  { name: 'B2B', value: 'b2b' },
  { name: 'B2C', value: 'b2c' },
  { name: 'B2B2C', value: 'b2b2c' },
  { name: 'Enterprise', value: 'enterprise' },
];
export const securities = [
  { name: 'Equity', value: 'equity' },
  { name: 'Debt', value: 'debt' },
  { name: 'Hybrid', value: 'hybrid' },
  { name: 'Derivative', value: 'derivative' },
];
export const businessModels = [
  { name: 'SaaS', value: 'saas' },
  { name: 'Transactional', value: 'transactional' },
  { name: 'Marketplace', value: 'marketplace' },
  { name: 'Enterprise', value: 'enterprise' },
  { name: 'Subscription', value: 'subscription' },
  { name: 'Usage-Based', value: 'usage-based' },
  { name: 'Ecommerce', value: 'ecommerce' },
  { name: 'Advertising', value: 'advertising' },
];
export const stages: Stages[] = [
  {
    value: 'ideal',
    title: 'Ideal stage',
    description: 'Brainstorming and validating problem statement',
  },
  {
    value: 'pre-seed',
    title: 'Pre-seed stage',
    description: 'Building MVP (Minimum viable product)',
  },
  {
    value: 'seed',
    title: 'Seed stage',
    description: 'Building MVP (Minimum viable product)',
  },
  {
    value: 'series-a',
    title: 'Series A',
    description: 'Building MVP (Minimum viable product)',
  },
  {
    value: 'series-b',
    title: 'Series B',
    description: 'Building MVP (Minimum viable product)',
  },
  {
    value: 'series-c',
    title: 'Series C',
    description: 'Building MVP (Minimum viable product)',
  },
];
// , children: "✓"

export const styleConfig = {
  activeBgColor: '#fff',
  activeTextColor: '#000',
  inactiveBgColor: '#1a1a1a',
  completedBgColor: '#2a2a2a',
  borderRadius: 0,
} as StepStyleDTO;

export interface CommonError {
  isSuccess: boolean;
  message: string;
}

export interface DealData {
  id: string;
  fund_manager_id: string;
  status: string;
}

export interface DraftResponse {
  deal_data: DealData;
  message: string;
  success: boolean;
}

export interface Subadmin {
  subadmin_id: string;
  name: string;
  email: string;
  invite_code: string;
  total_users: number;
  active_deals: number;
  onboarding_date: string;
}

export interface SubadminsResponse {
  subadmins: Subadmin[];
}

export interface SignInSubAdminResponse {
  message: string;
  subadmin_id: string;
  name: string;
  username: string;
  password: string;
  invite_code: string;
  success: boolean;
}

export interface StatisticsResponse {
  subadmin_id: string;
  subadmin_name: string;
  live_deals: number;
  closed_deals: number;
  total_capital_raised: number;
  deals_this_month: number;
  success: boolean;
}

export interface StatisticsState {
  liveDeals: number | null;
  closedDeals: number | null;
  totalCapitalRaised: number | null;
  dealsThisMonth: number | null;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface DealCard {
  deal_id: string;
  description: string | null;
  title: string | null;
  deal_status: 'open' | 'on_hold' | 'closed';
  current_valuation: number | null;
  round_size: number | null;
  commitment: number | null;
  business_model: string | null;
  company_stage: string | null;
  logo_url: string | null;
  created_at: string;
  fund_raised_till_now: number | null;
}

export interface AllDealsResponse {
  subadmin_id: string;
  subadmin_name: string;
  active_deals: DealCard[];
  closed_deals: DealCard[];
  success: boolean;
}
