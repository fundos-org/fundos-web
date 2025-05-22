import { DashboardStatisticsResponse } from '@/constants/dashboardConstant';
import {
  AllDealsResponse,
  CommonError,
  DraftResponse,
  LoginFormData,
  SignInSubAdminResponse,
  StatisticsResponse,
  SubadminsResponse,
} from '@/constants/dealsConstant';
import { MemberApiResponse } from '@/constants/membersConstant';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://43.205.36.168/api/v1/live/';

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
    const response = await axios.post(`${baseUrl}deals/web/create/draft`, {
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
  dealId: string,
  companyName: string,
  aboutCompany: string,
  companyWebsite: string,
  logo: File | null
) => {
  const formData = new FormData();
  if (logo) {
    formData.append('logo', logo);
  }
  const response = await axios.post(
    `${baseUrl}deals/web/company-details?deal_id=${dealId}&company_name=${companyName}&about_company=${aboutCompany}&company_website=${companyWebsite}`,
    formData
  );
  return response.data;
};

export const industryProblemTrigger = async (
  dealId: string,
  industry: string,
  problemStatement: string,
  businessModel: string
) => {
  const response = await axios.post(`${baseUrl}deals/web/industry-problem`, {
    deal_id: dealId,
    industry: industry,
    problem_statement: problemStatement,
    business_model: businessModel,
  });
  return response.data;
};

export const customerSegmentTrigger = async (
  dealId: string,
  companyStage: string,
  targetCustomerSegment: string
) => {
  const response = await axios.post(`${baseUrl}deals/web/customer-segment`, {
    deal_id: dealId,
    company_stage: companyStage,
    target_customer_segment: targetCustomerSegment,
  });
  return response.data;
};

export const valuationTrigger = async (
  dealId: string,
  currentValuation: string,
  roundSize: string,
  syndicateCommitment: string,
  pitch_deck?: File | null,
  pitch_video?: File | null
) => {
  const formData = new FormData();
  if (pitch_deck && pitch_deck instanceof File) {
    formData.append('pitch_deck', pitch_deck);
  }
  if (pitch_video && pitch_video instanceof File) {
    formData.append('pitch_video', pitch_video);
  }
  const response = await axios.post(
    `${baseUrl}deals/web/valuation?deal_id=${dealId}&current_valuation=${currentValuation}&round_size=${roundSize}&syndicate_commitment=${syndicateCommitment}`,
    formData
  );
  return response.data;
};

export const securitiesTrigger = async (
  dealId: string,
  instrumentType: string,
  conversionTerms: string,
  isStartup: boolean
) => {
  const response = await axios.post(`${baseUrl}deals/web/securities`, {
    deal_id: dealId,
    instrument_type: instrumentType,
    conversion_terms: conversionTerms,
    is_startup: isStartup,
  });
  return response.data;
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
    const response = await await axios.get(
      `${baseUrl}subadmin/deals/overview/${subadmin_id}`
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
  const response = await axios.get(`${baseUrl}deals/mobile/${dealId}`);
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
    `${baseUrl}admin/subadmins/create/profile?name=${name}&email=${email}&contact=${contact}&about=${about}`,
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
    `${baseUrl}admin/subadmins/create/credentials`,
    {
      subadmin_id,
      username,
      password,
      re_entered_password,
      app_name,
      invite_code,
    }
  );
  return response.data;
};

export const getSubAdminById = async (subadmin_id: string) => {
  const response = await axios.get(
    `${baseUrl}admin/subadmins/get/${subadmin_id}`
  );
  return response.data;
};

export const fetchAllSubAdmins = createAsyncThunk<
  SubadminsResponse,
  void,
  { rejectValue: CommonError }
>('subAdmins/fetchAllDeals', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseUrl}admin/subadmins`);
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
      `${baseUrl}subadmin/deals/statistics/${subadmin_id}`
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
      `${baseUrl}subadmin/members/statistics/${subadmin_id}`
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
      `${baseUrl}subadmin/dashboard/transactions/${subadmin_id}`
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
      `${baseUrl}subadmin/dashboard/statistics/${subadmin_id}`
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
        `${baseUrl}subadmin/signin?username=${username}&password=${password}`
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
      `${baseUrl}admin/signin?username=${username}&password=${password}`
    );
    return response.data;
  } catch {
    return { success: false };
  }
};

export default createDraft;
