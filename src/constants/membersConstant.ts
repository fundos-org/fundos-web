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

export interface PersonalDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  pan_number: string | null;
  aadhaar_number: string | null;
}

// Bank Details Interface
export interface BankDetails {
  bank_account_number: string | null;
  bank_ifsc: string | null;
  account_holder_name: string;
}

// Professional Background Interface
export interface ProfessionalBackground {
  occupation: string;
  income_source: string;
  annual_income: number;
  capital_commitment: number;
}

export interface InvestorDetails {
  personal_details: PersonalDetails;
  bank_details: BankDetails;
  professional_background: ProfessionalBackground;
}

export interface InvestorDetailsResponse extends InvestorDetails {
  investor_id: string;
  success: boolean;
}
