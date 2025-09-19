/**
 * Utility functions for formatting data display
 */

/**
 * Converts enum values to plain English text
 * Examples: 
 * - ON_HOLD -> On Hold
 * - PENDING_APPROVAL -> Pending Approval
 * - COMPLETED -> Completed
 */
export const formatEnumToText = (enumValue: string): string => {
  if (!enumValue) return '';
  
  return enumValue
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats status values with proper capitalization
 * Handles common status patterns
 */
export const formatStatus = (status: string): string => {
  if (!status) return '';
  
  const formatted = formatEnumToText(status);
  
  // Handle special cases
  const specialCases: Record<string, string> = {
    'Kyc': 'KYC',
    'Api': 'API',
    'Url': 'URL',
    'Id': 'ID',
    'Uuid': 'UUID',
  };
  
  let result = formatted;
  Object.entries(specialCases).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
  });
  
  return result;
};

/**
 * Formats currency values with proper symbol and formatting
 */
export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  if (amount === null || amount === undefined) return 'N/A';
  return `${currency}${amount.toLocaleString()}`;
};

/**
 * Formats date strings to readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return dateString.split('T')[0];
};

/**
 * Formats investor type with proper casing
 */
export const formatInvestorType = (type: string): string => {
  if (!type) return '';
  
  const specialTypes: Record<string, string> = {
    'hnwi': 'HNWI',
    'hni': 'HNI',
    'angel': 'Angel Investor',
    'vc': 'VC',
    'pe': 'PE',
  };
  
  const lowerType = type.toLowerCase();
  return specialTypes[lowerType] || formatEnumToText(type);
};
