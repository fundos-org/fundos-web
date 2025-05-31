import {
  createDraft,
  fetchAllDeals,
  fetchDealStatistics,
} from '@/axioscalls/dealApiServices';
import {
  CommonError,
  DraftResponse,
  StatisticsState,
  StatisticsResponse,
  AllDealsResponse,
} from '@/constants/dealsConstant';
import { AppEnums } from '@/constants/enums';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Deals state
export interface DealsState {
  allDeals?: {
    activeDeals: AllDealsResponse['active_deals'] | null;
    closedDeals: AllDealsResponse['closed_deals'] | null;
  };
  draft: DraftResponse;
  statistics?: StatisticsState;
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: DealsState = {
  allDeals: {
    activeDeals: null,
    closedDeals: null,
  },
  draft: {
    deal_id: '',
    message: '',
  },
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
    resetDeals(state) {
      if (state.allDeals) {
        state.allDeals.activeDeals = null;
        state.allDeals.closedDeals = null;
      }
      state.loading = false;
      state.error = null;
    },
    resetDealId(state) {
      state.draft.deal_id = '';
    },
    setDealDraft(state) {
      state.draft.deal_id = JSON.parse(
        localStorage.getItem(AppEnums.DEAL_DRAFT) as string
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllDeals.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchAllDeals.fulfilled,
        (state, action: PayloadAction<AllDealsResponse>) => {
          state.loading = false;
          if (state.allDeals) {
            state.allDeals.activeDeals = action.payload.active_deals;
            state.allDeals.closedDeals = action.payload.closed_deals;
          }
        }
      )
      .addCase(
        fetchAllDeals.rejected,
        (state, action: PayloadAction<CommonError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || 'Failed to fetch deals';
        }
      )
      .addCase(createDraft.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createDraft.fulfilled,
        (state, action: PayloadAction<DraftResponse>) => {
          state.loading = false;
          state.draft = action.payload;
          localStorage.setItem(
            AppEnums.DEAL_DRAFT,
            JSON.stringify(action.payload.deal_id)
          );
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
export const { resetDeals, resetDealId, setDealDraft } = dealsSlice.actions;

// Export reducer
export default dealsSlice.reducer;
