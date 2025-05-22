import { createSlice } from '@reduxjs/toolkit';

export interface GlobalState {
  role: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: GlobalState = {
  role: null,
  loading: false,
  error: null,
};

const globalSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    makeAdminPresent(state) {
      state.role = 'admin';
    },
    makeSubAdminPresent(state) {
      state.role = 'subadmin';
    },
  },
});

// Export actions
export const { makeAdminPresent, makeSubAdminPresent } = globalSlice.actions;

export default globalSlice.reducer;
