import { fetchDashboardStatistics } from '@/axioscalls/dealApiServices';
import {
  DashboardStatistics,
  DashboardStatisticsResponse,
} from '@/constants/dashboardConstant';
import { CommonError } from '@/constants/dealsConstant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MemberState {
  statistics?: DashboardStatistics;
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  statistics: {},
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDashboardStatistics.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchDashboardStatistics.fulfilled,
        (state, { payload }: PayloadAction<DashboardStatisticsResponse>) => {
          state.loading = false;
          if (state.statistics) {
            state.statistics.dealsThisMonth = payload.deals_this_month;
            state.statistics.listedStartups = payload.listed_startups;
            state.statistics.onboardedInvestors = payload.onboarded_investors;
            state.statistics.totalCapitalCommitted =
              payload.total_capital_committed;
          }
        }
      )
      .addCase(
        fetchDashboardStatistics.rejected,
        (state, action: PayloadAction<CommonError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || 'Failed to fetch deals';
        }
      );
  },
});

export default dashboardSlice.reducer;
