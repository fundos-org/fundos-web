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
