import { AppEnums } from '@/constants/enums';
import { AppRoute } from '@/RoutesEnum';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_BASE_ORIGIN;
const envSuffix = import.meta.env.VITE_REVERSE_PROXY_ENV;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
});

// Store refresh token promise to prevent multiple simultaneous refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: AxiosError) => void;
}> = [];

// Idle timeout configuration (30 minutes = 1800000 ms)
const IDLE_TIMEOUT = 15 * 60 * 1000;
let idleTimer: NodeJS.Timeout | null = null;

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Function to refresh token
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = sessionStorage.getItem(AppEnums.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(`${baseURL}${envSuffix}/v1/auth/refresh`, { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    sessionStorage.setItem(AppEnums.ACCESS_TOKEN, accessToken);
    sessionStorage.setItem(AppEnums.REFRESH_TOKEN, newRefreshToken);
    toast.success('Token refreshed due to idle timeout');
    return accessToken;
  } catch (error) {
    sessionStorage.removeItem(AppEnums.ACCESS_TOKEN);
    sessionStorage.removeItem(AppEnums.REFRESH_TOKEN);
    window.location.href = AppRoute.ROOT;
    throw error;
  }
};

// Function to reset idle timer
const resetIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
  idleTimer = setTimeout(async () => {
    try {
      await refreshAccessToken();
    } catch {
      toast.error('Idle token refresh failed:');
    }
  }, IDLE_TIMEOUT);
};

// Add event listeners for user activity
const setupIdleDetection = () => {
  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.addEventListener(event, resetIdleTimer, { passive: true });
  });
  // Start the timer initially
  resetIdleTimer();
};

// Clean up event listeners
const cleanupIdleDetection = () => {
  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.removeEventListener(event, resetIdleTimer);
  });
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem(AppEnums.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Reset idle timer on successful response
    resetIdleTimer();
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const accessToken = await refreshAccessToken();
        processQueue(null, accessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Forbidden access');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.message);
      }
    }

    return Promise.reject(error);
  }
);

// Initialize idle detection when module is imported
setupIdleDetection();

// Export cleanup function for use in app cleanup (optional)
export const cleanupAxios = () => {
  cleanupIdleDetection();
};

export default axiosInstance;
