import {
  AdminDashboardStats,
  AdminLoginResponse,
  AdminsOverviewListResponse,
  BulkOnboardingUserData,
  DashboardStatisticsResponse,
  EmailTemplatesResponse,
  SubadminIdsResponse,
  SubadminLoginResponse,
} from '@/constants/dashboardConstant';
import {
  AllDealsResponse,
  CommonError,
  DealDetails,
  DealDetailsResponse,
  DealDocumentsResponse,
  DealInvestorsResponse,
  DealStatus,
  DealTransactionsResponse,
  DraftResponse,
  LoginFormData,
  StatisticsResponse,
  SubadminDetailsResponse,
  SubadminsResponse,
  UpdateDealDetailsResponse,
} from '@/constants/dealsConstant';
import { AppEnums } from '@/constants/enums';
import {
  InvestmentDealsResponse,
  InvestorDetailsResponse,
  InvestorDocumentsResponse,
  InvestorMetadataResponse,
  InvestorsListResponse,
  InvestorTransactionsResponse,
  MemberApiResponse,
  UpdateInvestorRequest,
  UpdateInvestorResponse,
} from '@/constants/membersConstant';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { z } from 'zod';
import axiosInstance from './axiosConfig';

const baseOrigin = import.meta.env.VITE_BASE_ORIGIN;
const reverseProxyPath = import.meta.env.VITE_REVERSE_PROXY_ENV;
const urlSchema = z.url();
const validatedBaseUrl = urlSchema.parse(baseOrigin);
const baseUrl = reverseProxyPath
  ? new URL(reverseProxyPath, validatedBaseUrl).toString()
  : validatedBaseUrl;

// Create async thunk for creating a draft deal
export const createDraft = async (): Promise<DraftResponse> => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/v1/deal/web/create/draft`
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as CommonError;
      if (errorData.isSuccess !== undefined && errorData.message) {
        throw errorData;
      }
    }
    throw {
      isSuccess: false,
      message: 'Failed to create draft',
    } as CommonError;
  }
};

export const companyDetailsTrigger = async (
  companyName: string,
  aboutCompany: string,
  investmentSchemeAppendix: string,
  logo: File | null,
  dealId?: string
) => {
  const formData = new FormData();
  if (logo) {
    formData.append('logo', logo);
  }
  const response = await axiosInstance.post(
    `${baseUrl}/v1/deal/web/company-details?deal_id=${dealId}&company_name=${companyName}&about_company=${aboutCompany}&investment_scheme_appendix=${investmentSchemeAppendix}`,
    formData
  );
  toast.success(response.data.message);
  return response.data;
};

export const industryProblemTrigger = async (
  industry: string,
  problemStatement: string,
  businessModel: string,
  dealId?: string
) => {
  const response = await axiosInstance.post(
    `${baseUrl}/v1/deal/web/industry-problem`,
    {
      deal_id: dealId,
      industry: industry,
      problem_statement: problemStatement,
      business_model: businessModel,
    }
  );
  toast.success(response.data.message);
  return response.data;
};

export const customerSegmentTrigger = async (
  companyStage: string,
  targetCustomerSegment: string,
  dealId?: string
) => {
  const response = await axiosInstance.post(
    `${baseUrl}/v1/deal/web/customer-segment`,
    {
      deal_id: dealId,
      company_stage: companyStage,
      target_customer_segment: targetCustomerSegment,
    }
  );
  toast.success(response.data.message);
  return response.data;
};

export const valuationTrigger = async (
  currentValuation: null | number,
  roundSize: null | number,
  syndicateCommitment: null | number,
  minimumInvestment: null | number,
  pitchDeck?: File | null,
  pitchVideo?: File | null,
  investmentSchemeAppendix?: File | null,
  dealId?: string
) => {
  const formData = new FormData();
  if (pitchDeck && pitchDeck instanceof File) {
    formData.append('pitch_deck', pitchDeck);
  }
  if (pitchVideo && pitchVideo instanceof File) {
    formData.append('pitch_video', pitchVideo);
  }
  if (investmentSchemeAppendix && investmentSchemeAppendix instanceof File) {
    formData.append('investment_scheme_appendix', investmentSchemeAppendix);
  }
  const response = await axiosInstance.post(
    `${baseUrl}/v1/deal/web/valuation?deal_id=${dealId}&current_valuation=${currentValuation}&round_size=${roundSize}&syndicate_commitment=${syndicateCommitment}&minimum_investment=${minimumInvestment}`,
    formData
  );
  toast.success(response.data.message);
  return response.data;
};

export const securitiesTrigger = async (
  instrumentType: string,
  conversionTerms: string,
  isStartup: boolean,
  dealId?: string,
  managementFee?: number | null,
  carryPercentage?: number | null
) => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/v1/deal/web/securities`,
      {
        deal_id: dealId,
        instrument_type: instrumentType,
        conversion_terms: conversionTerms,
        management_fee: managementFee,
        carry: carryPercentage,
        is_startup: isStartup,
      }
    );
    localStorage.removeItem(AppEnums.DEAL_DRAFT);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message: string;
        code?: string;
        details?: Record<string, unknown>;
      }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to trigger securities';
      const errorCode =
        axiosError.response?.data?.code || axiosError.code || 'UNKNOWN_ERROR';

      // Throw a structured error for React Query or caller to handle
      throw new Error(
        `Securities API failed: ${errorMessage} (Code: ${errorCode})`
      );
    }
    throw new Error('An unexpected error occurred while triggering securities');
  }
};

export const bulkOnboarding = async (
  data: Omit<BulkOnboardingUserData, 'remark'>[]
) => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/v1/subadmin/bulk-onboarding`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as CommonError;
      if (errorData.isSuccess !== undefined && errorData.message) {
        throw errorData;
      }
    }
    throw {
      isSuccess: false,
      message: 'Failed to create draft',
    } as CommonError;
  }
};

export const createProfile = async (
  name: string,
  email: string,
  contact: string,
  about: string,
  logo: File | null
) => {
  const formData = new FormData();
  if (logo) formData.append('logo', logo);
  const response = await axiosInstance.post(
    `${baseUrl}/v1/admin/subadmins/create/profile?name=${name}&email=${email}&contact=${contact}&about=${about}`,
    formData
  );
  return response.data;
};

export const createCredentials = async (
  subadmin_id: string,
  username: string,
  password: string,
  re_entered_password: string,
  app_name: string,
  invite_code: string
) => {
  const response = await axiosInstance.post(
    `${baseUrl}/v1/admin/subadmins/create/credentials`,
    {
      subadmin_id,
      username,
      password,
      re_entered_password,
      app_name,
      invite_code,
    }
  );
  toast.success('Sub Admin created successfully!');
  return response.data;
};

export const fetchDealStatistics = async (): Promise<StatisticsResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/subadmin/deals/statistics`
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const fetchDashboardStatistics =
  async (): Promise<DashboardStatisticsResponse> => {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/v1/subadmin/dashboard/statistics`
      );
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  };

export const fetchMembersStatistics = async (
  subadmin_id?: string
): Promise<MemberApiResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/subadmin/members/statistics/${subadmin_id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const resetPasswordRequest = async (
  email: string
): Promise<{ message: string; success: boolean }> => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/v1/subadmin/password/reset/request?email=${email}`
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const resetPasswordVerify = async (
  email: string,
  otp: string
): Promise<{
  message: string;
  success: boolean;
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}> => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/v1/subadmin/password/reset/verify?email=${email}&otp_code=${otp}`
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const resetPasswordAssign = async (
  password: string,
  access_token: string
): Promise<{ message: string; success: boolean }> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/password/reset`);
    url.searchParams.set('password', password);

    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const response = await axiosInstance.post(url.toString(), {}, config);

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const fetchTransactionList = createAsyncThunk<
  MemberApiResponse,
  void,
  { rejectValue: CommonError }
>('members/fetchTransactionList', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/subadmin/dashboard/transactions`
    );
    return response.data;
  } catch (error: unknown) {
    // Handle axios or network errors
    if (isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as CommonError;
      if (errorData.isSuccess !== undefined && errorData.message) {
        return rejectWithValue(errorData);
      }
    }
    // Fallback for unexpected errors
    return rejectWithValue({
      isSuccess: false,
      message: 'Failed to fetch deals',
    });
  }
});

export const appLogin = async (
  data: LoginFormData,
  role: 'admin' | 'subadmin' | 'kyc'
): Promise<
  AdminLoginResponse | SubadminLoginResponse | { success: boolean }
> => {
  try {
    const url = new URL(`${baseUrl}/v1/${role}/signin`);
    url.searchParams.set('username', data.username);
    url.searchParams.set('password', data.password);
    const response = await axiosInstance.post(url.toString());
    return response.data;
  } catch {
    return { success: false };
  }
};

export const addMember = async (email: string) => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/v1/subadmin/members/addmember/${email}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(`Error: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const shareDetails = async (subadmin_id: string) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/admin/subadmins/send/invitation/?subadmin_id=${subadmin_id}`
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.log('Error in apiAadhaarOtpSend:', error);
    if (isAxiosError(error)) {
      toast.error(`Error: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// React Query Tanstack
export const getSubadmins = async (
  pageNumber: number,
  pageSize: number
): Promise<SubadminsResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/admin/subadmins?page=${pageNumber}&per_page=${pageSize}`
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as CommonError;
      if (errorData.isSuccess !== undefined && errorData.message) {
        throw new Error(errorData.message);
      }
    }
    throw new Error('Failed to fetch deals');
  }
};

export const getSubAdminDetails = async (
  subadmin_id: string
): Promise<SubadminDetailsResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/admin/subadmin_details/${subadmin_id}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const updateSubAdminDetails = async (
  subadmin_id: string,
  details: Partial<Omit<SubadminDetailsResponse, 'subadmin_id' | 'success'>>
): Promise<{ subadmin_id: string; message: string; success: boolean }> => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/v1/admin/subadmin_details/${subadmin_id}`,
      details
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getSubadminIdList = async (): Promise<SubadminIdsResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/subadmin/subadminsIds`
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as CommonError;
      if (errorData.isSuccess !== undefined && errorData.message) {
        throw new Error(errorData.message);
      }
    }
    throw new Error('Failed to fetch ids');
  }
};

export const getDeals = async (
  active_page_number: number,
  active_page_size: number,
  closed_page_number: number,
  closed_page_size: number,
  onhold_page_number: number,
  onhold_page_size: number,
  subadmin_id: string
): Promise<AllDealsResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/deals/overview/paginated`);
    if (subadmin_id) url.pathname += subadmin_id;
    url.searchParams.set('active_page', active_page_number.toString());
    url.searchParams.set('active_per_page', active_page_size.toString());
    url.searchParams.set('closed_page', closed_page_number.toString());
    url.searchParams.set('closed_per_page', closed_page_size.toString());
    url.searchParams.set('onhold_page_number', onhold_page_number.toString());
    url.searchParams.set('onhold_page_size', onhold_page_size.toString());
    const response = await axiosInstance.get(url.toString());
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as CommonError;
      if (errorData.isSuccess !== undefined && errorData.message) {
        throw new Error(errorData.message);
      }
    }
    throw new Error('Failed to fetch deals');
  }
};

export const getDealDetails = async (
  deal_id: string
): Promise<DealDetailsResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/subadmin/deals/deal_details/${deal_id}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export type Files = {
  logo: File | null;
  pitch_deck: File | null;
  pitch_video: File | null;
};

export const updateDealDetails = async (
  deal_id: string,
  details: Partial<
    DealDetails | 'logo_url' | 'pitch_deck_url' | 'pitch_video_url'
  >,
  files?: Partial<Files>
): Promise<UpdateDealDetailsResponse> => {
  try {
    const formData = new FormData();
    if (files?.logo) formData.append('logo', files.logo);
    if (files?.pitch_deck) formData.append('pitch_deck', files.pitch_deck);
    if (files?.pitch_video) formData.append('pitch_video', files.pitch_video);
    formData.append('data', JSON.stringify(details));
    const response = await axiosInstance.put(
      `${baseUrl}/v1/subadmin/deals/edit_deals/${deal_id}`,
      formData
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const markDealInactive = async (
  deal_id: string
): Promise<{
  success: boolean;
  message: string;
  subadmin_id: string;
  deal_id: string;
}> => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/v1/subadmin/deals/mark_inactive/${deal_id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const changeDealStatus = async (deal_id: string, status: DealStatus) => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/v1/subadmin/deals/change/status?deal_id=${deal_id}&status=${status}`
    );
    return response.data;
  } catch (error) {
    console.log('Error in changeDealStatus:', error);
    if (isAxiosError(error)) {
      toast.error(`Error: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getDealInvestorInvestments = async (
  deal_id: string,
  pageNumber: number,
  pageSize: number
): Promise<DealInvestorsResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/subadmin/deals/deal_info/investors/${deal_id}?page=${pageNumber}&per_page=${pageSize}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getDealTransactions = async (
  deal_id: string,
  pageNumber: number,
  pageSize: number
): Promise<DealTransactionsResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/subadmin/deals/deal_info/transactions/${deal_id}?page=${pageNumber}&per_page=${pageSize}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getDealDocuments = async (
  deal_id: string
): Promise<DealDocumentsResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/subadmin/deals/deal_info/documents/${deal_id}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const deleteInvestor = async (
  investor_id: string,
  subadmin_id?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/investors/delete`);
    url.pathname += `/${investor_id}`;
    if (subadmin_id) url.searchParams.set('subadmin_id', subadmin_id);
    const response = await axiosInstance.delete(url.toString());
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getInvestors = async (
  pageNumber: number,
  pageSize: number,
  subadmin_id?: string
): Promise<InvestorsListResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/investors/list`);
    url.searchParams.set('page', pageNumber.toString());
    url.searchParams.set('per_page', pageSize.toString());
    if (subadmin_id) url.searchParams.set('subadmin_id', subadmin_id);
    const response = await axiosInstance.get(url.toString());
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getInvestorDetails = async (
  investor_id: string
): Promise<InvestorDetailsResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/investors/about_info`);
    url.searchParams.set('investor_id', investor_id);
    const response = await axiosInstance.get(url.toString());
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getInvestorDealInvestments = async (
  pageNumber: number,
  pageSize: number,
  investor_id: string
): Promise<InvestmentDealsResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/investors/investments_info`);
    url.searchParams.set('page', pageNumber.toString());
    url.searchParams.set('per_page', pageSize.toString());
    url.searchParams.set('investor_id', investor_id);
    const response = await axiosInstance.get(url.toString());
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getInvestorTransactions = async (
  pageNumber: number,
  pageSize: number,
  investor_id: string
): Promise<InvestorTransactionsResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/investors/transactions`);
    url.searchParams.set('page', pageNumber.toString());
    url.searchParams.set('per_page', pageSize.toString());
    url.searchParams.set('investor_id', investor_id);
    const response = await axiosInstance.get(url.toString());
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getInvestorDocuments = async (
  investor_id: string
): Promise<InvestorDocumentsResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/investors/documents_info`);
    url.searchParams.set('investor_id', investor_id);
    const response = await axiosInstance.get(url.toString());
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getInvestorMetadata = async (
  subadmin_id?: string
): Promise<InvestorMetadataResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/investors/metadata`);
    if (subadmin_id) url.pathname += `/${subadmin_id}`;
    const response = await axiosInstance.get(url.toString());
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const updateInvestorDetails = async (
  investor_id: string,
  details: UpdateInvestorRequest,
  subadmin_id?: string
): Promise<UpdateInvestorResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/investors/update`);
    url.pathname += `/${investor_id}`;
    if (subadmin_id) url.searchParams.set('subadmin_id', subadmin_id);
    const response = await axiosInstance.put(url.toString(), details);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/v1/admin/dashboard/metadata`
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  };

export const getAdminOverview = async (
  pageNumber: number,
  pageSize: number
): Promise<AdminsOverviewListResponse> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/v1/admin/overview?page=${pageNumber}&per_page=${pageSize}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getCommunicationEmails = async (
  subadmin_id?: string
): Promise<EmailTemplatesResponse> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/communication/emails`);
    if (subadmin_id) url.searchParams.set('subadmin_id', subadmin_id);
    const response = await axiosInstance.get(url.toString());
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const updateCommunicationEmails = async (
  details: Partial<Omit<EmailTemplatesResponse, 'subadmin_id' | 'success'>>,
  subadmin_id?: string
): Promise<{ subadmin_id: string; message: string; success: boolean }> => {
  try {
    const url = new URL(`${baseUrl}/v1/subadmin/communication/emails`);
    if (subadmin_id) url.searchParams.set('subadmin_id', subadmin_id);
    const response = await axiosInstance.put(url.toString(), details);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export default createDraft;
