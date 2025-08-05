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
  { name: 'B2B', value: 'B2B' },
  { name: 'B2C', value: 'B2C' },
  { name: 'B2B2C', value: 'B2B2C' },
  { name: 'Enterprise', value: 'ENTERPRISE' },
];
export const securities = [
  { name: 'Equity', value: 'EQUITY' },
  { name: 'Debt', value: 'DEBT' },
  { name: 'Hybrid', value: 'HYBRID' },
  { name: 'Derivative', value: 'DERIVATIVE' },
];

export const industryType = [
  { name: 'Aerospace', value: 'AEROSPACE' },
  { name: 'Agritech and Agriculture', value: 'AGRITECH_AND_AGRICULTURE' },
  { name: 'Artificial Intelligence', value: 'ARTIFICIAL_INTELLIGENCE' },
  { name: 'Automotive', value: 'AUTOMOTIVE' },
  { name: 'Consumer Electronics', value: 'CONSUMER_ELECTRONICS' },
  { name: 'Deep Tech', value: 'DEEP_TECH' },
  { name: 'Edtech and Education', value: 'EDTECH_AND_EDUCATION' },
  {
    name: 'Fintech and Financial Services',
    value: 'FINTECH_AND_FINANCIAL_SERVICES',
  },
  { name: 'Food Industry Services', value: 'FOOD_INDUSTURY_SERVICES' },
  { name: 'Gaming', value: 'GAMING' },
  { name: 'Government', value: 'GOVERNMENT' },
  { name: 'Healthcare and Medtech', value: 'HEATHCARE_AND_MEDTECH' },
  { name: 'Hospitality', value: 'HOSPITALITY' },
  { name: 'Life Sciences', value: 'LIFE_SCIENCES' },
  { name: 'Manufacturing', value: 'MANUFACTURING' },
  { name: 'Marketing', value: 'MARKETING' },
  { name: 'Media', value: 'MEDIA' },
  { name: 'Mining', value: 'MINING' },
  { name: 'Non Profit', value: 'NON_PROFIT' },
  { name: 'Oil and Gas', value: 'OIL_AND_GAS' },
  { name: 'Power and Utilities', value: 'POWER_AND_UTILITIES' },
  { name: 'Professional Services', value: 'PROFESSIONAL_SERVICES' },
  {
    name: 'Real Estate and Construction',
    value: 'REAL_ESTATE_AND_CONSTRUCTION',
  },
  { name: 'Retail', value: 'RETAIL' },
  { name: 'Robotics', value: 'ROBOTICS' },
  { name: 'Software and Internet', value: 'SOFTWARE_AND_INTERNET' },
  { name: 'Telecom', value: 'TELECOM' },
  { name: 'Transportation', value: 'TRANSPORTATION' },
  { name: 'Travel', value: 'TRAVEL' },
  { name: 'Wholesale and Distribution', value: 'WHOLESALE_AND_DISTRIBUTION' },
  { name: 'Others', value: 'OTHERS' },
];

export const businessModels = [
  { name: 'Product Based', value: 'PRODUCT_BASED' },
  { name: 'Service Based', value: 'SERVICE_BASED' },
  { name: 'Subscription', value: 'SUBSCRIPTION' },
  { name: 'Marketplace', value: 'MARKETPLACE' },
  { name: 'Freemium', value: 'FREEMIUM' },
  { name: 'Ad Based', value: 'AD_BASED' },
  { name: 'Licensing', value: 'LICENSING' },
  { name: 'Franchise', value: 'FRANCHISE' },
  { name: 'Aggregator', value: 'AGGREGATOR' },
  { name: 'Sharing Economy', value: 'SHARING_ECONOMY' },
  { name: 'Data Monetization', value: 'DATA_MONETIZATION' },
  { name: 'SaaS', value: 'SAAS' },
  { name: 'On Demand', value: 'ON_DEMAND' },
  { name: 'Direct to Consumer', value: 'DIRECT_TO_CONSUMER' },
  { name: 'Peer to Peer', value: 'PEER_TO_PEER' },
];

export const stages: Stages[] = [
  {
    value: 'IDEAL',
    title: 'Ideal Stage',
    description: 'Identifying and validating the problem',
  },
  {
    value: 'PRE_SEED',
    title: 'Pre-seed Stage',
    description: 'Building MVP and early testing',
  },
  {
    value: 'SEED',
    title: 'Seed Stage',
    description: 'Gaining early traction',
  },
  {
    value: 'SERIES_A',
    title: 'Series A',
    description: 'Scaling product and operations',
  },
  {
    value: 'SERIES_B',
    title: 'Series B',
    description: 'Scaling revenue and market expansion',
  },
  {
    value: 'SERIES_C',
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

export interface ResetPasswordFormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export type DealStatus = 'OPEN' | 'CLOSED' | 'ON_HOLD';
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
