
export interface Member {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  capital_committed: number;
  kyc_status: 'VERIFIED' | 'PENDING';
}

export interface Members {
  investors: Member[];
  startups: Member[];
}

export interface Statistics {
  investors_statistics: {
    onboarded: number;
    kyc_pending: number;
    started_investing: number;
  };
  startups_statistics: {
    onboarded: number;
    kyc_pending: number;
    started_investing: number;
  };
}

export interface MemberApiResponse {
  subadmin_id: string;
  subadmin_name: string;
  invite_code: string;
  members: Members;
  statistics: Statistics;
  success: boolean;
}