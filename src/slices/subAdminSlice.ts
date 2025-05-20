import { fetchAllSubAdmins } from "@/axioscalls/dealApiServices";
import { CommonError, Subadmin, SubadminsResponse } from "@/constants/dealsConstant";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SubAdminState {
    subAdmins: Subadmin[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubAdminState = {
    subAdmins: null,
    loading: false,
    error: null,
};

const subAdminSlice = createSlice({
    name: 'subAdmin',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSubAdmins.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSubAdmins.fulfilled, (state, action: PayloadAction<SubadminsResponse>) => {
                state.loading = false;
                state.subAdmins = action.payload.subadmins;
            })
            .addCase(fetchAllSubAdmins.rejected, (state, action: PayloadAction<CommonError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch deals';
            })
    },
});

export default subAdminSlice.reducer;