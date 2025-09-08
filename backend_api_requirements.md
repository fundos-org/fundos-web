# Backend API Requirements for Analytics Dashboard

## Overview
The frontend analytics dashboard requires two new API endpoints and one modification to properly support all chart functionalities with live data instead of mock data.

## 🔧 Required API Changes

### 1. **NEW API: Subadmin Time-Series Analytics** 
**Endpoint**: `GET /subadmin/analytics/time-series`

**Purpose**: Provide time-based analytics data for the SubadminTimeAnalyticsChart, which currently uses a workaround approach combining multiple existing APIs.

**Query Parameters**:
```typescript
{
  metric_type: 'ONBOARDED_INVESTORS' | 'TRANSACTIONS' | 'KYC_COMPLETED' | 'INVESTOR_TYPES',
  start_date?: string,  // Format: YYYY-MM-DD
  end_date?: string,    // Format: YYYY-MM-DD
  subadmin_id?: string  // Auto-detected for subadmin users, required for admin access
}
```

**Response Schema**:
```typescript
{
  data: Array<{
    time_period: string,     // e.g., "2024-01", "2024-02" (YYYY-MM format)
    value: number,           // Count/amount based on metric_type
    date: string            // ISO 8601 date for the period
  }>,
  total_count: number,
  metric_type: string
}
```

**Business Logic by Metric Type**:

- **ONBOARDED_INVESTORS**: Count of users where `onboarding_status = 'COMPLETED'` grouped by month
- **TRANSACTIONS**: Count of transactions grouped by month  
- **KYC_COMPLETED**: Count of users where `kyc_status = 'COMPLETED'` grouped by month
- **INVESTOR_TYPES**: Count of unique investor types active per month

**Example Response**:
```json
{
  "data": [
    {"time_period": "2024-01", "value": 25, "date": "2024-01-01T00:00:00Z"},
    {"time_period": "2024-02", "value": 32, "date": "2024-02-01T00:00:00Z"},
    {"time_period": "2024-03", "value": 18, "date": "2024-03-01T00:00:00Z"}
  ],
  "total_count": 75,
  "metric_type": "ONBOARDED_INVESTORS"
}
```

---

### 2. **NEW API: KYC Status Distribution**
**Endpoint**: `GET /subadmin/analytics/kyc-status`

**Purpose**: Replace mock data in KycStatusChart with live KYC status distribution data.

**Query Parameters**:
```typescript
{
  start_date?: string,    // Format: YYYY-MM-DD
  end_date?: string,      // Format: YYYY-MM-DD  
  subadmin_id?: string    // Auto-detected for subadmin users, required for admin access
}
```

**Response Schema**:
```typescript
{
  data: Array<{
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'REJECTED',
    count: number,
    percentage: number    // Percentage of total users
  }>,
  total_users: number
}
```

**Business Logic**:
- Query `User` table grouped by `kyc_status`
- Calculate counts and percentages for each status
- Filter by date range if provided (based on user creation date or KYC completion date)
- Filter by subadmin association

**Example Response**:
```json
{
  "data": [
    {"status": "PENDING", "count": 32, "percentage": 35.2},
    {"status": "COMPLETED", "count": 41, "percentage": 45.1},
    {"status": "VERIFIED", "count": 18, "percentage": 19.8}
  ],
  "total_users": 91
}
```

---

### 3. **ENHANCEMENT: Improve Time-Series Data Quality**

**Current Issue**: The SubadminTimeAnalyticsChart uses existing APIs (`getOnboardedInvestors`, `getTransactions`, `getInvestorTypes`) and transforms the data, but this approach has limitations:

1. **Data inconsistency**: Different APIs return different field structures
2. **Missing time-series format**: Current APIs don't provide proper time-based grouping
3. **Performance**: Multiple API calls instead of one optimized query

**Recommendation**: Create the new `/subadmin/analytics/time-series` endpoint above to replace this workaround approach.

---

## 🚀 Implementation Priority

### **High Priority (Required for Production)**:
1. **`GET /subadmin/analytics/time-series`** - Critical for SubadminTimeAnalyticsChart
2. **`GET /subadmin/analytics/kyc-status`** - Replace mock data in KycStatusChart

### **Medium Priority (Enhancement)**:
- Review and optimize existing analytics APIs for consistency
- Add caching layer for analytics data
- Implement real-time updates for dashboard metrics

---

## 🔒 Security & Access Control

**For Subadmin Users**:
- Automatically filter data by their assigned `subadmin_id`
- Only show data for users associated with their subadmin account

**For Admin Users**:
- Access to all data across subadmins
- Optional `subadmin_id` parameter to filter by specific subadmin
- If no `subadmin_id` provided, return aggregated data across all subadmins

---

## 📊 Database Queries Guidance

### **For Time-Series Analytics**:
```sql
-- Example for ONBOARDED_INVESTORS metric
SELECT 
  DATE_FORMAT(created_at, '%Y-%m') as time_period,
  COUNT(*) as value,
  DATE(CONCAT(DATE_FORMAT(created_at, '%Y-%m'), '-01')) as date
FROM users 
WHERE onboarding_status = 'COMPLETED'
  AND subadmin_id = ? 
  AND created_at BETWEEN ? AND ?
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY time_period;
```

### **For KYC Status Distribution**:
```sql
-- KYC status distribution
SELECT 
  kyc_status as status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users WHERE subadmin_id = ?), 1) as percentage
FROM users 
WHERE subadmin_id = ?
  AND created_at BETWEEN ? AND ?
GROUP BY kyc_status;
```

---

## 🧪 Testing Requirements

**Test Cases for New APIs**:
1. **Authentication**: Verify role-based access (admin vs subadmin)
2. **Data Filtering**: Test date range filtering
3. **Subadmin Isolation**: Ensure subadmins only see their data
4. **Performance**: Test with large datasets
5. **Edge Cases**: Empty data, invalid date ranges, missing parameters

**Frontend Integration Test**:
- Verify charts render correctly with live data
- Test loading states and error handling
- Confirm export functionality works with real data
- Validate quick date selection triggers correct API calls

---

## 📈 Expected Frontend Integration

Once these APIs are implemented, the frontend will need minimal changes:

1. **Update SubadminTimeAnalyticsChart**: Replace the current workaround logic with direct API call to `/subadmin/analytics/time-series`
2. **Update KycStatusChart**: Replace mock data with API call to `/subadmin/analytics/kyc-status`
3. **Update analyticsApi.ts**: Add new service methods for the new endpoints

The existing loading states, error handling, and UI components are already prepared for live data integration.
