export type Investor = {
  name: string;
  email: string;
  capitalCommitted: string;
  kycStatus: string;
};

// Enum for Onboarding Status
export enum OnboardingStatus {
  NOT_STARTED = 'NOT_STARTED',
  INVITATION_SENT_WITH_PPM = 'INVITATION_SENT_WITH_PPM',
  KYC_INITIATED = 'KYC_INITIATED',
  CKYC_COMPLETED = 'CKYC_COMPLETED',
  KYC_COMPLETED = 'KYC_COMPLETED',
  MCA_SENT = 'MCA_SENT',
  MCA_SIGNED_USER = 'MCA_SIGNED_USER',
  MCA_SIGNED_FUNDMANAGER = 'MCA_SIGNED_FUNDMANAGER',
  MCA_SIGNED_TRUSTEE = 'MCA_SIGNED_TRUSTEE',
  ONBOARDING_COMPLETED = 'ONBOARDING_COMPLETED',
}

// Enum for Investor Type
export enum InvestorType {
  INDIVIDUAL = 'INDIVIDUAL',
  ENTITY = 'ENTITY',
}

// Enum for KYC Status
export enum KycStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}
