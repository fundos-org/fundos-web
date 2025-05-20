import { createSlice } from "@reduxjs/toolkit";

export interface AdminState {
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
    },
});

export default adminSlice.reducer;