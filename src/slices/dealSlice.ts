import { createDraft, fetchAllDeals } from '@/axioscalls/dealApiServices';
import { Deal, CommonError, DraftResponse } from '@/constants/dealsConstant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Deals state
export interface DealsState {
    deals: Deal[];
    draft: DraftResponse;
    loading: boolean;
    error: string | null;
}

// Define initial state
const initialState: DealsState = {
    deals: [],
    draft: {
        deal_id: '',
        message: ''
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
            state.deals = [];
            state.loading = false;
            state.error = null;
        },
        resetDealId(state) {
            state.draft.deal_id = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllDeals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
                state.loading = false;
                state.deals = action.payload;
            })
            .addCase(fetchAllDeals.rejected, (state, action: PayloadAction<CommonError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch deals';
            })
            .addCase(createDraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDraft.fulfilled, (state, action: PayloadAction<DraftResponse>) => {
                state.loading = false;
                state.draft = action.payload;
            })
            .addCase(createDraft.rejected, (state, action: PayloadAction<CommonError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create draft';
            });
    },
});

// Export actions
export const { resetDeals, resetDealId } = dealsSlice.actions;

// Export reducer
export default dealsSlice.reducer;