import { AppEnums } from '@/constants/enums';
import { AxiosError, isAxiosError } from 'axios';
import axiosInstance from './axiosConfig';

const baseOrigin = import.meta.env.VITE_BASE_ORIGIN;
const reverseProxyPath = import.meta.env.VITE_REVERSE_PROXY_ENV;
const baseUrl = reverseProxyPath
  ? new URL(reverseProxyPath, baseOrigin).toString()
  : baseOrigin;

// Utility function to get current user role
export const getCurrentUserRole = (): 'admin' | 'subadmin' | 'kyc' | null => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  if (subadminDetailsRaw) {
    const details = JSON.parse(subadminDetailsRaw);
    return details?.role || null;
  }
  return null;
};

// Utility function to get current subadmin_id
export const getCurrentSubadminId = (): string | null => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  if (subadminDetailsRaw) {
    const details = JSON.parse(subadminDetailsRaw);
    return details?.subadmin_id || null;
  }
  return null;
};

// API Response Types
export interface AdminTimeMetricsResponse {
  metric_type: string;
  data: Array<{
    time_period: string; // e.g., "Jan 2024", "Q1 2024", "2024"
    value: number;
    date: string; // ISO 8601 datetime
  }>;
}

export interface AdminSubadminMetricsResponse {
  metric_type: string;
  data: Array<{
    subadmin_name: string;
    value: number;
    date: string; // ISO 8601 datetime
  }>;
}

export interface SubadminDealsAnalyticsResponse {
  metric_type: string;
  data: Array<{
    deal_name: string;
    value: string | number; // String for enums, number for valuation
    date: string; // ISO 8601 datetime
  }>;
}

export interface OnboardedInvestorsResponse {
  data: Array<{
    month: string; // e.g., "Sep" (3-letter month abbreviation)
    investors: number;
    date: string; // ISO 8601 datetime
  }>;
}

export interface TransactionsResponse {
  data: Array<{
    month: string; // e.g., "Sep" (3-letter month abbreviation)
    transactions: number;
    date: string; // ISO 8601 datetime
  }>;
}

export interface InvestorTypesResponse {
  data: Array<{
    type: 'INDIVIDUAL' | 'ENTITY';
    count: number;
  }>;
}

export interface KycStatusResponse {
  data: Array<{
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    count: number;
  }>;
}

export interface TransactionSummaryResponse {
  data: Array<{
    category: 'Total Investments' | 'Pending Transactions' | 'Completed Transactions' | 'On Hold Transactions' | 'Failed Transactions';
    amount: number;
    count: number;
  }>;
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// All Transactions API interfaces
export interface AllTransactionsParams {
  page?: number;
  per_page?: number;
  search?: string;
  status_filter?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'ON_HOLD';
  start_date?: string;
  end_date?: string;
  subadmin_id?: string;
}

export interface AllTransactionsResponse {
  data: Array<{
    payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'ON_HOLD';
    deal_name: string;
    phone_number: string;
    email: string;
    amount: number;
    currency: string;
    transaction_date: string;
    investor_name: string;
    transaction_id: string; // ✅ NEW: For reminder API
    remind_status: string | null; // ✅ NEW: 'REMIND' | 'REMINDED' | null
  }>;
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Remind functionality interfaces
export interface SendReminderParams {
  transaction_id: string; // ✅ SIMPLIFIED: Only transaction ID needed
  subadmin_id?: string; // Required for admin users, automatic for subadmin
}

export interface SendReminderResponse {
  success: boolean;
  message: string;
}

// New Time-Series Analytics Interfaces
export interface TimeSeriesParams {
  metric_type: 'ONBOARDED_INVESTORS' | 'TRANSACTIONS' | 'KYC_COMPLETED' | 'INVESTOR_TYPES';
  start_date?: string;  // Format: YYYY-MM-DD
  end_date?: string;    // Format: YYYY-MM-DD
  subadmin_id?: string; // Required for admin users, auto-detected for subadmin users
}

export interface TimeSeriesResponse {
  data: Array<{
    time_period: string;   // Format: "2024-01", "2024-02" (YYYY-MM)
    value: number;         // Count for that period
    date: string;          // ISO 8601 date for the first day of the month
  }>;
  total_count: number;
  metric_type: 'ONBOARDED_INVESTORS' | 'TRANSACTIONS' | 'KYC_COMPLETED' | 'INVESTOR_TYPES';
}

// KYC Distribution Interfaces
export interface KycDistributionParams {
  start_date?: string;  // Format: YYYY-MM-DD
  end_date?: string;    // Format: YYYY-MM-DD
  subadmin_id?: string; // Required for admin users, auto-detected for subadmin users
}

export interface KycDistributionResponse {
  data: Array<{
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'REJECTED';
    count: number;
    percentage: number;  // Percentage of total users
  }>;
  total_users: number;
}

// API Parameters Types
export interface TimeMetricsParams {
  metric_type: 'TOTAL_USERS' | 'DEALS' | 'ONBOARDING_STATUS' | 'KYC_STATUS' | 'TRANSACTIONS' | 'PAYMENT_STATUS';
  start_date?: string; // ISO 8601 datetime
  end_date?: string;   // ISO 8601 datetime
  time_period?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'; // Default: 'MONTHLY'
}

export interface SubadminMetricsParams {
  metric_type: 'TOTAL_USERS' | 'DEALS' | 'ONBOARDING_STATUS' | 'KYC_STATUS' | 'TRANSACTIONS' | 'PAYMENT_STATUS';
  start_date?: string;
  end_date?: string;
}

export interface DealsAnalyticsParams {
  metric_type: 'INDUSTRY' | 'BUSINESS_MODEL' | 'COMPANY_STAGE' | 'CURRENT_VALUATION' | 'INSTRUMENT_TYPE';
  start_date?: string;
  end_date?: string;
  subadmin_id?: string; // Required for admin users, automatic for subadmin users
}

export interface BaseAnalyticsParams {
  start_date?: string;
  end_date?: string;
  subadmin_id?: string; // Required for admin users, automatic for subadmin users
}

export interface TransactionSummaryParams extends BaseAnalyticsParams {
  search?: string; // Search by investor name or deal name
  page?: number;   // Default: 1
  per_page?: number; // Default: 20, max: 100
}

// Analytics API Service
class AnalyticsAPI {
  private handleError(error: unknown, context: string): never {
    console.error(`Error in ${context}:`, error);
    
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const message = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.detail ||
        axiosError.message || 
        `Failed to ${context}`;
      throw new Error(message);
    }
    
    throw new Error(`An unexpected error occurred in ${context}`);
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${baseUrl}/v1${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value.toString());
        }
      });
    }
    
    return url.toString();
  }

  // Admin Analytics APIs
  async getTimeMetrics(params: TimeMetricsParams): Promise<AdminTimeMetricsResponse> {
    try {
      const url = this.buildUrl('/admin/analytics/time-metrics', params);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getTimeMetrics');
    }
  }

  async getSubadminMetrics(params: SubadminMetricsParams): Promise<AdminSubadminMetricsResponse> {
    try {
      const url = this.buildUrl('/admin/analytics/subadmin-metrics', params);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getSubadminMetrics');
    }
  }

  // Subadmin Analytics APIs (support both admin and subadmin access)
  async getDealsAnalytics(params: DealsAnalyticsParams): Promise<SubadminDealsAnalyticsResponse> {
    try {
      // Add subadmin_id parameter for admin users
      const userRole = getCurrentUserRole();
      const currentSubadminId = getCurrentSubadminId();
      
      const finalParams = { ...params };
      if (userRole === 'admin' && !params.subadmin_id) {
        // For admin users, we need to get subadmin_id from somewhere (e.g., URL params or selected subadmin)
        // For now, we'll require it to be passed in params
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/deals', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getDealsAnalytics');
    }
  }

  async getOnboardedInvestors(params: BaseAnalyticsParams = {}): Promise<OnboardedInvestorsResponse> {
    try {
      const userRole = getCurrentUserRole();
      const currentSubadminId = getCurrentSubadminId();
      
      const finalParams = { ...params };
      if (userRole === 'admin' && !params.subadmin_id) {
        // For admin users accessing subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/onboarded-investors', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getOnboardedInvestors');
    }
  }

  async getTransactions(params: BaseAnalyticsParams = {}): Promise<TransactionsResponse> {
    try {
      const userRole = getCurrentUserRole();
      const currentSubadminId = getCurrentSubadminId();
      
      const finalParams = { ...params };
      if (userRole === 'admin' && !params.subadmin_id) {
        // For admin users accessing subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/transactions', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getTransactions');
    }
  }

  async getInvestorTypes(params: BaseAnalyticsParams = {}): Promise<InvestorTypesResponse> {
    try {
      const userRole = getCurrentUserRole();
      const currentSubadminId = getCurrentSubadminId();
      
      const finalParams = { ...params };
      if (userRole === 'admin' && !params.subadmin_id) {
        // For admin users accessing subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/investor-types', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getInvestorTypes');
    }
  }

  async getKycStatus(params: BaseAnalyticsParams = {}): Promise<KycStatusResponse> {
    try {
      const userRole = getCurrentUserRole();
      const currentSubadminId = getCurrentSubadminId();
      
      const finalParams = { ...params };
      if (userRole === 'admin' && !params.subadmin_id) {
        // For admin users accessing subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/kyc-status', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getKycStatus');
    }
  }

  async getTransactionSummary(params: TransactionSummaryParams = {}): Promise<TransactionSummaryResponse> {
    try {
      const userRole = getCurrentUserRole();
      const currentSubadminId = getCurrentSubadminId();
      
      const finalParams = { ...params };
      if (userRole === 'admin' && !params.subadmin_id) {
        // For admin users accessing subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/transaction-summary', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getTransactionSummary');
    }
  }

  async getAllTransactions(params?: AllTransactionsParams): Promise<AllTransactionsResponse> {
    try {
      const session = JSON.parse(sessionStorage.getItem('userSession') || '{}');
      const userRole = session?.role?.toLowerCase();
      const currentSubadminId = session?.subadmin?.id;
      
      const finalParams = { ...params };

      // Handle subadmin_id parameter based on user role
      if (userRole === 'admin') {
        // For admin users accessing subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/all-transactions', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getAllTransactions');
      throw error;
    }
  }

  async sendReminder(params: SendReminderParams): Promise<SendReminderResponse> {
    try {
      const session = JSON.parse(sessionStorage.getItem('userSession') || '{}');
      const userRole = session?.role?.toLowerCase();
      const currentSubadminId = session?.subadmin?.id;
      
      const finalParams = { ...params };

      // Handle subadmin_id parameter based on user role
      if (userRole === 'admin') {
        // For admin users accessing subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/send-reminder', {});
      const response = await axiosInstance.post(url, finalParams);
      return response.data;
    } catch (error) {
      this.handleError(error, 'sendReminder');
      throw error;
    }
  }

  // New Time-Series Analytics API
  async getTimeSeriesData(params: TimeSeriesParams): Promise<TimeSeriesResponse> {
    try {
      const session = JSON.parse(sessionStorage.getItem('userSession') || '{}');
      const userRole = session?.role?.toLowerCase();
      const currentSubadminId = session?.subadmin?.id;
      
      const finalParams: any = { ...params };
      
      // Handle subadmin_id logic for admin vs subadmin users
      if (userRole === 'admin') {
        // For admin users accessing specific subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/time-series', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getTimeSeriesData');
      throw error;
    }
  }

  // New KYC Distribution API
  async getKycDistribution(params: KycDistributionParams): Promise<KycDistributionResponse> {
    try {
      const session = JSON.parse(sessionStorage.getItem('userSession') || '{}');
      const userRole = session?.role?.toLowerCase();
      const currentSubadminId = session?.subadmin?.id;
      
      const finalParams: any = { ...params };
      
      // Handle subadmin_id logic for admin vs subadmin users
      if (userRole === 'admin') {
        // For admin users accessing specific subadmin data, subadmin_id should be provided
      } else if (userRole === 'subadmin' && currentSubadminId) {
        finalParams.subadmin_id = currentSubadminId;
      }

      const url = this.buildUrl('/subadmin/analytics/kyc-distribution', finalParams);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getKycDistribution');
      throw error;
    }
  }
}

// Export singleton instance
export const analyticsApi = new AnalyticsAPI();
export default analyticsApi;
