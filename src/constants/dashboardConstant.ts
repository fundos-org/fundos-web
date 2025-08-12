import { Pagination } from './dealsConstant';

export interface DashboardStatisticsResponse {
  subadmin_id: string;
  subadmin_name: string;
  total_capital_committed: number;
  listed_startups: number;
  onboarded_investors: number;
  deals_this_month: number;
  success: boolean;
}

export interface DashboardStatistics {
  totalCapitalCommitted?: number;
  listedStartups?: number;
  onboardedInvestors?: number;
  dealsThisMonth?: number;
}

export interface SubadminId {
  subadmin_id: string;
  subadmin_name: string;
  user_count?: number | null;
  deal_count?: number | null;
}

export interface SubadminIdsResponse {
  subadmins: SubadminId[];
  success: true;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailTemplatesResponse {
  subadmin_id: string;
  welcome_mail: EmailTemplate;
  onboarding_mail: EmailTemplate;
  consent_mail: EmailTemplate;
  success: boolean;
}

export interface AdminDashboardStats {
  total_admin_onboarded: number;
  total_users: number;
  active_deals: number;
  new_user_this_month: number;
  success: boolean;
}

export interface SubadminOverview {
  subadmin_id: string;
  subadmin_name: string;
  email: string;
  invitation_code: string;
  total_users: number;
  active_deals: number;
  users_added_last_one_month: number;
  users_added_till_date: number;
  onboarding_date: string;
}

export interface AdminsOverviewListResponse {
  subadmins: SubadminOverview[];
  pagination: Pagination;
  success: boolean;
}

export interface BulkOnboardingUserData {
  email: string | null | undefined;
  pan_number: string | null | undefined;
  phone: string | null | undefined;
  capital_commitment: string | null | undefined;
  remark?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer' | 'Bearer';
}

export interface SubadminLoginResponse {
  message: string;
  subadmin_id: string;
  name: string;
  invite_code: string;
  logo: string;
  role: 'subadmin' | 'admin' | 'user';
  tokens: AuthTokens;
  success: boolean;
}
export interface AdminLoginResponse {
  message: string;
  success: boolean;
  tokens?: AuthTokens;
}
