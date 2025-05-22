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
      sessionStorage.setItem('role', 'admin');
      state.role = 'admin';
    },
    makeSubAdminPresent(state) {
      sessionStorage.setItem('role', 'subadmin');
      state.role = 'subadmin';
    },
  },
});

// Export actions
export const { makeAdminPresent, makeSubAdminPresent } = globalSlice.actions;

export default globalSlice.reducer;
