/**
 * Utility functions for handling and formatting error messages across the application
 */

export interface ApiErrorResponse {
  success: boolean;
  message?: string;
  detail?: string;
}

/**
 * Formats API error messages for better user experience
 * @param apiMessage - The error message from the API
 * @param fallbackMessage - Default message if API message is not user-friendly
 * @param context - Context of the error (login, password-reset, etc.) for specific handling
 * @returns User-friendly error message
 */
export const formatApiErrorMessage = (
  apiMessage: string,
  fallbackMessage: string,
  context?: 'login' | 'password-reset' | 'general'
): string => {
  if (!apiMessage) return fallbackMessage;
  
  const lowerMessage = apiMessage.toLowerCase();
  
  // Common error patterns across all contexts
  if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  
  if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (lowerMessage.includes('server error') || lowerMessage.includes('internal server')) {
    return 'Server error. Please try again later or contact support if the issue persists.';
  }
  
  // Context-specific error handling
  switch (context) {
    case 'login':
      return formatLoginErrorMessage(lowerMessage, apiMessage, fallbackMessage);
    
    case 'password-reset':
      return formatPasswordResetErrorMessage(lowerMessage, apiMessage, fallbackMessage);
    
    default:
      break;
  }
  
  // Return the original API message if it's user-friendly, otherwise use fallback
  if (apiMessage.length < 100 && !lowerMessage.includes('status code')) {
    return apiMessage;
  }
  
  return fallbackMessage;
};

/**
 * Format login-specific error messages
 */
const formatLoginErrorMessage = (
  lowerMessage: string,
  originalMessage: string,
  fallbackMessage: string
): string => {
  if (lowerMessage.includes('no subadmin found') || lowerMessage.includes('user not found')) {
    return 'No account found with these credentials. Please check your username or contact support.';
  }
  
  if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('authentication failed')) {
    return 'Invalid username or password. Please check your credentials and try again.';
  }
  
  if (lowerMessage.includes('account locked') || lowerMessage.includes('locked')) {
    return 'Your account has been locked. Please contact support for assistance.';
  }
  
  if (lowerMessage.includes('account disabled') || lowerMessage.includes('disabled')) {
    return 'Your account is currently disabled. Please contact support for assistance.';
  }
  
  return originalMessage.length < 100 && !lowerMessage.includes('status code') 
    ? originalMessage 
    : fallbackMessage;
};

/**
 * Format password reset-specific error messages
 */
const formatPasswordResetErrorMessage = (
  lowerMessage: string,
  originalMessage: string,
  fallbackMessage: string
): string => {
  if (lowerMessage.includes('no subadmin found')) {
    return 'No account found with this email address. Please check your email or contact support.';
  }
  
  if (lowerMessage.includes('invalid otp')) {
    return 'The verification code you entered is incorrect. Please check and try again.';
  }
  
  if (lowerMessage.includes('otp expired') || lowerMessage.includes('expired')) {
    return 'The verification code has expired. Please request a new one.';
  }
  
  if (lowerMessage.includes('email not found')) {
    return 'No account associated with this email address. Please check your email or contact support.';
  }
  
  return originalMessage.length < 100 && !lowerMessage.includes('status code') 
    ? originalMessage 
    : fallbackMessage;
};

/**
 * Extract error message from various API response formats
 */
export const extractApiErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  
  // Try different common error message fields
  const message = error?.response?.data?.detail || 
                 error?.response?.data?.message || 
                 error?.message || 
                 error?.detail || 
                 '';
  
  return message;
};

/**
 * Create a standardized error response format
 */
export const createErrorResponse = (message: string): ApiErrorResponse => ({
  success: false,
  message
});

/**
 * Check if an error is a network/connection error
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  const errorString = (error.message || error.toString()).toLowerCase();
  return errorString.includes('network') || 
         errorString.includes('fetch') || 
         errorString.includes('connection') ||
         error.code === 'NETWORK_ERROR';
};

/**
 * Check if an error is a server error (5xx status codes)
 */
export const isServerError = (error: any): boolean => {
  const status = error?.response?.status;
  return status >= 500 && status < 600;
};

/**
 * Check if an error is a client error (4xx status codes)
 */
export const isClientError = (error: any): boolean => {
  const status = error?.response?.status;
  return status >= 400 && status < 500;
};
