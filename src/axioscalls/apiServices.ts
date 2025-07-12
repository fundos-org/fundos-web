import { InvestorsListResponse } from '@/components/custom/tables/InvestorTable/InvestorTable';
import { DashboardStatisticsResponse } from '@/constants/dashboardConstant';
import {
  AllDealsResponse,
  CommonError,
  DealStatus,
  DraftResponse,
  LoginFormData,
  SignInSubAdminResponse,
  StatisticsResponse,
  SubadminsResponse,
} from '@/constants/dealsConstant';
import { AppEnums } from '@/constants/enums';
import {
  InvestorDetailsResponse,
  InvestorMetadataResponse,
  MemberApiResponse,
  UpdateInvestorRequest,
  UpdateInvestorResponse,
} from '@/constants/membersConstant';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { z } from 'zod';

const baseRaw = import.meta.env.VITE_BASE_ORIGIN;
const baseStagingRaw = import.meta.env.VITE_BASE_ORIGIN_STAGING;
const apiSchema = z.string().url();
const baseUrl = apiSchema.parse(baseRaw);
const baseUrlStaging = apiSchema.parse(baseStagingRaw);

// Create async thunk for creating a draft deal
export const createDraft = createAsyncThunk<
  DraftResponse,
  void,
  { rejectValue: CommonError }
>('draft/createDraft', async (_, { rejectWithValue }) => {
  const { subadmin_id } = JSON.parse(
    sessionStorage.getItem('subadmindetails') as string
  );
  await new Promise(r => setTimeout(r, 2000));
  try {
    const response = await axios.post(`${baseUrl}/deals/web/create/draft`, {
      fund_manager_id: subadmin_id,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as CommonError;
      if (errorData.isSuccess !== undefined && errorData.message) {
        return rejectWithValue(errorData);
      }
    }
    return rejectWithValue({
      isSuccess: false,
      message: 'Failed to create draft',
    });
  }
});

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
  const response = await axios.post(
    `${baseUrl}/deals/web/company-details?deal_id=${dealId}&company_name=${companyName}&about_company=${aboutCompany}&investment_scheme_appendix=${investmentSchemeAppendix}`,
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
  const response = await axios.post(`${baseUrl}/deals/web/industry-problem`, {
    deal_id: dealId,
    industry: industry,
    problem_statement: problemStatement,
    business_model: businessModel,
  });
  toast.success(response.data.message);
  return response.data;
};

export const customerSegmentTrigger = async (
  companyStage: string,
  targetCustomerSegment: string,
  dealId?: string
) => {
  const response = await axios.post(`${baseUrl}/deals/web/customer-segment`, {
    deal_id: dealId,
    company_stage: companyStage,
    target_customer_segment: targetCustomerSegment,
  });
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
  const response = await axios.post(
    `${baseUrl}/deals/web/valuation?deal_id=${dealId}&current_valuation=${currentValuation}&round_size=${roundSize}&syndicate_commitment=${syndicateCommitment}&minimum_investment=${minimumInvestment}`,
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
    const response = await axios.post(`${baseUrl}/deals/web/securities`, {
      deal_id: dealId,
      instrument_type: instrumentType,
      conversion_terms: conversionTerms,
      management_fee: managementFee,
      carry: carryPercentage,
      is_startup: isStartup,
    });
    localStorage.removeItem(AppEnums.DEAL_DRAFT);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
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

      // Log error for debugging (use your preferred logging service)
      console.error(`Securities API error [${errorCode}]: ${errorMessage}`, {
        dealId,
        instrumentType,
        status: axiosError.response?.status,
        details: axiosError.response?.data?.details,
      });

      // Throw a structured error for React Query or caller to handle
      throw new Error(
        `Securities API failed: ${errorMessage} (Code: ${errorCode})`
      );
    }

    // Handle non-Axios errors (e.g., network issues, code errors)
    console.error('Unexpected error in securitiesTrigger:', error);
    throw new Error('An unexpected error occurred while triggering securities');
  }
};

// Create async thunk for fetching all deals
export const fetchAllDeals = createAsyncThunk<
  AllDealsResponse,
  void,
  { rejectValue: CommonError }
>('deals/fetchAllDeals', async (_, { rejectWithValue }) => {
  try {
    const { subadmin_id } = JSON.parse(
      sessionStorage.getItem('subadmindetails') as string
    );
    const response = await axios.get(
      `${baseUrl}/subadmin/deals/overview/${subadmin_id}`
    );
    return response.data;
  } catch (error: unknown) {
    // Handle axios or network errors
    if (axios.isAxiosError(error) && error.response?.data) {
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

export const dealWithIdTrigger = async (dealId: string) => {
  const response = await axios.get(`${baseUrl}/deals/mobile/${dealId}`);
  return response.data;
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
  const response = await axios.post(
    `${baseUrl}/admin/subadmins/create/profile?name=${name}&email=${email}&contact=${contact}&about=${about}`,
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
  const response = await axios.post(
    `${baseUrl}/admin/subadmins/create/credentials`,
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

export const getSubAdminById = async (subadmin_id: string) => {
  const response = await axios.get(`${baseUrl}/admin/subadmins/${subadmin_id}`);
  return response.data;
};

export const fetchAllSubAdmins = createAsyncThunk<
  SubadminsResponse,
  void,
  { rejectValue: CommonError }
>('subAdmins/fetchAllDeals', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseUrl}/admin/subadmins/`);
    return response.data;
  } catch (error: unknown) {
    // Handle axios or network errors
    if (axios.isAxiosError(error) && error.response?.data) {
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

export const fetchDealStatistics = createAsyncThunk<
  StatisticsResponse,
  void,
  { rejectValue: CommonError }
>('deals/fetchDealStatistics', async (_, { rejectWithValue }) => {
  try {
    const { subadmin_id } = JSON.parse(
      sessionStorage.getItem('subadmindetails') as string
    );
    const response = await axios.get(
      `${baseUrl}/subadmin/deals/statistics/${subadmin_id}`
    );
    return response.data;
  } catch (error: unknown) {
    // Handle axios or network errors
    if (axios.isAxiosError(error) && error.response?.data) {
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

export const fetchMembersStatistics = createAsyncThunk<
  MemberApiResponse,
  void,
  { rejectValue: CommonError }
>('members/fetchMembersStatistics', async (_, { rejectWithValue }) => {
  try {
    const { subadmin_id } = JSON.parse(
      sessionStorage.getItem('subadmindetails') as string
    );
    const response = await axios.get(
      `${baseUrl}/subadmin/members/statistics/${subadmin_id}`
    );
    return response.data;
  } catch (error: unknown) {
    // Handle axios or network errors
    if (axios.isAxiosError(error) && error.response?.data) {
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

export const fetchTransactionList = createAsyncThunk<
  MemberApiResponse,
  void,
  { rejectValue: CommonError }
>('members/fetchTransactionList', async (_, { rejectWithValue }) => {
  try {
    const { subadmin_id } = JSON.parse(
      sessionStorage.getItem('subadmindetails') as string
    );
    const response = await axios.get(
      `${baseUrl}/subadmin/dashboard/transactions/${subadmin_id}`
    );
    return response.data;
  } catch (error: unknown) {
    // Handle axios or network errors
    if (axios.isAxiosError(error) && error.response?.data) {
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

export const fetchDashboardStatistics = createAsyncThunk<
  DashboardStatisticsResponse,
  void,
  { rejectValue: CommonError }
>('members/fetchDashboardStatistics', async (_, { rejectWithValue }) => {
  try {
    const { subadmin_id } = JSON.parse(
      sessionStorage.getItem('subadmindetails') as string
    );
    const response = await axios.get(
      `${baseUrl}/subadmin/dashboard/statistics/${subadmin_id}`
    );
    return response.data;
  } catch (error: unknown) {
    // Handle axios or network errors
    if (axios.isAxiosError(error) && error.response?.data) {
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

export const loginSubAdmin = createAsyncThunk<
  SignInSubAdminResponse,
  LoginFormData,
  { rejectValue: CommonError }
>(
  'subAdmins/loginSubAdmin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/subadmin/signin?username=${username}&password=${password}`
      );
      return response.data;
    } catch (error: unknown) {
      // Handle axios or network errors
      if (axios.isAxiosError(error) && error.response?.data) {
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
  }
);

export const loginAdmin = async ({ username, password }: LoginFormData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/admin/signin?username=${username}&password=${password}`
    );
    return response.data;
  } catch {
    return { success: false };
  }
};

export const addMember = async (subadmin_id: string, email: string) => {
  try {
    const response = await axios.post(
      `${baseUrl}/subadmin/members/addmember/${subadmin_id}/${email}`
    );
    return response.data;
  } catch (error) {
    console.log('Error in apiAadhaarOtpSend:', error);
    if (axios.isAxiosError(error)) {
      toast.error(`Error: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const changeDealStatus = async (deal_id: string, status: DealStatus) => {
  try {
    const response = await axios.post(
      `${baseUrl}/subadmin/deals/change/status?deal_id=${deal_id}&status=${status}`
    );
    return response.data;
  } catch (error) {
    console.log('Error in changeDealStatus:', error);
    if (axios.isAxiosError(error)) {
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
    const response = await axios.get(
      `${baseUrl}/admin/subadmins/send/invitation/?subadmin_id=${subadmin_id}`
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.log('Error in apiAadhaarOtpSend:', error);
    if (axios.isAxiosError(error)) {
      toast.error(`Error: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

// React Query Tanstack
export const deleteInvestor = async (
  investor_id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const { subadmin_id } = JSON.parse(
      sessionStorage.getItem(AppEnums.SUBADMIN_SESSION) as string
    );
    const response = await axios.delete(
      `${baseUrl}/api/v1/live/subadmin/investors/delete/${subadmin_id}/${investor_id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getInvestors = async (
  subadmin_id: string,
  pageNumber: number,
  pageSize: number
): Promise<InvestorsListResponse> => {
  try {
    const response = await axios.get(
      `${baseUrlStaging}/api/v1/live/subadmin/investors/list/${subadmin_id}?page=${pageNumber}&per_page=${pageSize}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
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
    const response = await axios.get(
      `${baseUrlStaging}/api/v1/live/subadmin/investors/abount_info/${investor_id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getInvestorMetadata = async (
  subadmin_id: string
): Promise<InvestorMetadataResponse> => {
  try {
    const response = await axios.get(
      `${baseUrlStaging}/api/v1/live/subadmin/investors/metadata/${subadmin_id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const updateInvestorDetails = async (
  subadmin_id: string,
  investor_id: string,
  details: UpdateInvestorRequest
): Promise<UpdateInvestorResponse> => {
  try {
    const response = await axios.put(
      `${baseUrlStaging}/api/v1/live/subadmin/investors/update/${subadmin_id}/${investor_id}`,
      details
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export default createDraft;
