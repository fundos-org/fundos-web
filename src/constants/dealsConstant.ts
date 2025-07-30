import { StepStyleDTO } from 'react-form-stepper/dist/components/Step/StepTypes';

export type Stages = {
  value: string;
  title: string;
  description: string;
};

export const stepsList = [
  { label: 'Company', index: 0 },
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

export const industryType = [
  { name: 'Aerospace', value: 'aerospace' },
  { name: 'Agritech and Agriculture', value: 'agritech_and_agriculture' },
  { name: 'Artificial Intelligence', value: 'artificial_intelligence' },
  { name: 'Automotive', value: 'automotive' },
  { name: 'Consumer Electronics', value: 'consumer_electronics' },
  { name: 'Deep Tech', value: 'deep_tech' },
  { name: 'Edtech and Education', value: 'edtech_and_education' },
  {
    name: 'Fintech and Financial Services',
    value: 'fintech_and_financial_services',
  },
  { name: 'Food Industry Services', value: 'food_industury_services' },
  { name: 'Gaming', value: 'gaming' },
  { name: 'Government', value: 'government' },
  { name: 'Healthcare and Medtech', value: 'heathcare_and_medtech' },
  { name: 'Hospitality', value: 'hospitality' },
  { name: 'Life Sciences', value: 'life_sciences' },
  { name: 'Manufacturing', value: 'manufacturing' },
  { name: 'Marketing', value: 'marketing' },
  { name: 'Media', value: 'media' },
  { name: 'Mining', value: 'mining' },
  { name: 'Non Profit', value: 'non_profit' },
  { name: 'Oil and Gas', value: 'oil_and_gas' },
  { name: 'Power and Utilities', value: 'power_and_utilities' },
  { name: 'Professional Services', value: 'professional_services' },
  {
    name: 'Real Estate and Construction',
    value: 'real_estate_and_construction',
  },
  { name: 'Retail', value: 'retail' },
  { name: 'Robotics', value: 'robotics' },
  { name: 'Software and Internet', value: 'software_and_internet' },
  { name: 'Telecom', value: 'telecom' },
  { name: 'Transportation', value: 'transportation' },
  { name: 'Travel', value: 'travel' },
  { name: 'Wholesale and Distribution', value: 'wholesale_and_distribution' },
  { name: 'Others', value: 'others' },
];

export const businessModels = [
  { name: 'Product Based', value: 'product_based' },
  { name: 'Service Based', value: 'service_based' },
  { name: 'Subscription', value: 'subscription' },
  { name: 'Marketplace', value: 'marketplace' },
  { name: 'Freemium', value: 'freemium' },
  { name: 'Ad Based', value: 'ad_based' },
  { name: 'Licensing', value: 'licensing' },
  { name: 'Franchise', value: 'franchise' },
  { name: 'Aggregator', value: 'aggregator' },
  { name: 'Sharing Economy', value: 'sharing_economy' },
  { name: 'Data Monetization', value: 'data_monetization' },
  { name: 'SaaS', value: 'saas' },
  { name: 'On Demand', value: 'on_demand' },
  { name: 'Direct to Consumer', value: 'direct_to_consumer' },
  { name: 'Peer to Peer', value: 'peer_to_peer' },
];

export const stages: Stages[] = [
  {
    value: 'ideal',
    title: 'Ideal Stage',
    description: 'Identifying and validating the problem',
  },
  {
    value: 'pre-seed',
    title: 'Pre-seed Stage',
    description: 'Building MVP and early testing',
  },
  {
    value: 'seed',
    title: 'Seed Stage',
    description: 'Gaining early traction',
  },
  {
    value: 'series-a',
    title: 'Series A',
    description: 'Scaling product and operations',
  },
  {
    value: 'series-b',
    title: 'Series B',
    description: 'Scaling revenue and market expansion',
  },
  {
    value: 'series-c',
    title: 'Series C',
    description: 'Expansion, acquisition, or IPO preparation',
  },
];

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

export interface SubadminDetailsResponse {
  subadmin_id: string;
  logo: string;
  name: string;
  email: string;
  contact: string;
  about: string;
  username: string;
  password: string;
  reenter_password: string;
  app_name: string;
  invite_code: string;
  app_theme: string;
  success: boolean;
}

export interface Subadmin {
  subadmin_id: string;
  subadmin_name: string;
  email: string;
  invitation_code: string;
  total_users: number;
  active_deals: number;
  onboarding_date: string;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SubadminsResponse {
  subadmins: Subadmin[];
  pagination: Pagination;
  success: boolean;
}

export interface SignInSubAdminResponse {
  message: string;
  subadmin_id: string;
  logo: string;
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
  role: 'ADMIN' | 'SUBADMIN' | 'INVESTOR' | 'KYC';
}

export type DealStatus = 'open' | 'closed' | 'on_hold';
export interface DealCard {
  deal_id: string;
  description: string;
  title: string;
  deal_status: string;
  current_valuation: number;
  round_size: number;
  commitment: number;
  business_model: string;
  company_stage: string;
  logo_url: string;
  created_at: string;
  fund_raised_till_now?: number | null;
}

export interface AllDealsResponse {
  subadmin_id: string;
  subadmin_name: string;
  active_deals: DealCard[];
  closed_deals: DealCard[];
  onhold_deals: DealCard[];
  active_pagination: Pagination;
  closed_pagination: Pagination;
  onhold_pagination: Pagination;
  success: boolean;
}

export interface DealDetails {
  logo_url: string;
  company_name: string;
  about_company: string;
  company_website: string;
  problem_statement: string;
  industry: string;
  business_model: string;
  company_stage: string;
  current_valuation: number;
  round_size: number;
  syndicate_commitment: number;
  conversion_terms: string;
  instrument_type: string;
  pitch_deck_url: string;
  pitch_video_url: string;
}

export interface DealDetailsResponse {
  subadmin_id: string;
  deal_id: string;
  deal_details: DealDetails;
  success: boolean;
}

export interface UpdateDealDetailsResponse {
  subadmin_id: string;
  deal_id: string;
  message: string;
  success: boolean;
}

export interface InvestorForDeals {
  investor_id: string;
  first_name: string;
  last_name: string;
  investor_type: string;
  commitments: number;
  created_at: string;
  status: string;
  term_sheet_key: string;
  deal_investor_status: number;
}

export interface DealInvestorsResponse {
  deal_id: string;
  investors: InvestorForDeals[];
  pagination: Pagination;
  success: boolean;
}

export interface DealTransaction {
  transaction_id: string;
  invitation_code: string;
  transaction_type: string;
  amount: number;
  created_at: string;
  status: string;
}

export interface DealTransactionsResponse {
  deal_id: string;
  transactions: DealTransaction[];
  pagination: Pagination;
  success: boolean;
}

export interface DealDocs {
  pitchdeck_final_key: string;
  video_pitch_key: string;
}

export interface DealDocumentsResponse {
  deal_id: string;
  documents: DealDocs;
  success: boolean;
}
