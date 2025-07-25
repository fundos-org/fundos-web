import { createDraft, fetchDealStatistics } from '@/axioscalls/apiServices';
import {
  CommonError,
  DraftResponse,
  StatisticsState,
  StatisticsResponse,
} from '@/constants/dealsConstant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Deals state
export interface DealsState {
  draft?: DraftResponse;
  statistics?: StatisticsState;
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: DealsState = {
  statistics: {
    liveDeals: null,
    closedDeals: null,
    totalCapitalRaised: null,
    dealsThisMonth: null,
  },
  loading: false,
  error: null,
};

// Create the deals slice
const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    resetDealId(state) {
      if (state.draft && state.draft.deal_data) {
        state.draft.deal_data.id = '';
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createDraft.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createDraft.fulfilled,
        (state, action: PayloadAction<DraftResponse>) => {
          state.loading = false;
          state.draft = action.payload;
        }
      )
      .addCase(
        createDraft.rejected,
        (state, action: PayloadAction<CommonError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || 'Failed to create draft';
        }
      )
      .addCase(fetchDealStatistics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDealStatistics.fulfilled,
        (state, action: PayloadAction<StatisticsResponse>) => {
          state.loading = false;
          if (state.statistics) {
            state.statistics.liveDeals = action.payload.live_deals;
            state.statistics.closedDeals = action.payload.closed_deals;
            state.statistics.dealsThisMonth = action.payload.deals_this_month;
            state.statistics.totalCapitalRaised =
              action.payload.total_capital_raised;
          }
        }
      )
      .addCase(
        fetchDealStatistics.rejected,
        (state, action: PayloadAction<CommonError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || 'Failed to create draft';
        }
      );
  },
});

// Export actions
export const { resetDealId } = dealsSlice.actions;

// Export reducer
export default dealsSlice.reducer;
