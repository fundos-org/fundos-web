import { DealStatus } from './dealsConstant';
import { InvestorType, KycStatus, OnboardingStatus } from './investorsConstant';

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

export interface InvestorEntity {
  investor_id: string;
  name: string;
  mail: string;
  type: InvestorType;
  deals_invested: number;
  deals_committed: number;
  kyc_status: KycStatus;
  onboarding_status: OnboardingStatus;
  mca_key: string;
  joined_on: string;
  profile_pic: string;
  capital_commitment: number;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface InvestorsListResponse {
  subadmin_id: string;
  subadmin_name: string;
  investors: InvestorEntity[];
  pagination: Pagination;
  success: boolean;
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

export interface InvestorMetadataResponse {
  subadmin_id: string;
  subadmin_name: string;
  metadata: {
    investor_onboarded: number;
    kyc_pending: number;
    started_investing: number;
  };
  success: boolean;
}

export interface UpdateInvestorRequest {
  first_name?: string;
  last_name?: string;
  occupation?: string;
  income_source?: string;
  annual_income?: number;
  capital_commitment?: number;
}

export interface UpdateInvestorResponse {
  subadmin_id: string;
  investor_id: string;
  message: string;
  success: boolean;
}

export interface InvestedDeal {
  company_name: string;
  about_company: string;
  industry: string;
  company_stage: string;
  logo_url: string;
  status: DealStatus;
  created_at: string;
  deal_capital_commitment: number;
  equity: number;
  term_sheet: string;
}

export interface InvestmentDealsResponse {
  investor_id: string;
  deals: InvestedDeal[];
  pagination: Pagination;
  success: boolean;
}

export interface Transaction {
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  invitation_code: string;
}

export interface InvestorTransactionsResponse {
  investor_id: string;
  transactions: Transaction[];
  pagination: Pagination;
  success: boolean;
}

export interface Documents {
  mca_key: string;
  share_certificate_key: string;
  term_sheet_key: string;
}

export interface InvestorDocumentsResponse {
  investor_id: string;
  documents: Documents;
  success: boolean;
}

export interface InvestorCommitmentsResponse {
  pagination: Pagination;
  commitments: InvestorEntity[];
}
