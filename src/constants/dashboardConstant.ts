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
