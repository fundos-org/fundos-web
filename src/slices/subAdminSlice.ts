import { fetchAllSubAdmins, loginSubAdmin } from '@/axioscalls/apiServices';
import {
  CommonError,
  SignInSubAdminResponse,
  Subadmin,
  SubadminsResponse,
} from '@/constants/dealsConstant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SubAdminState {
  subAdmins: Subadmin[] | null;
  subAdminId: string | null;
  subAdminName: string | null;
  subAdminUsername: string | null;
  subAdminInviteCode: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubAdminState = {
  subAdmins: null,
  subAdminId: null,
  subAdminName: null,
  subAdminUsername: null,
  subAdminInviteCode: null,
  loading: false,
  error: null,
};

const subAdminSlice = createSlice({
  name: 'subAdmin',
  initialState,
  reducers: {
    resetSubadmin(state) {
      state.subAdminName = null;
      state.subAdminUsername = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllSubAdmins.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchAllSubAdmins.fulfilled,
        (state, action: PayloadAction<SubadminsResponse>) => {
          state.loading = false;
          state.subAdmins = action.payload.subadmins;
        }
      )
      .addCase(
        fetchAllSubAdmins.rejected,
        (state, action: PayloadAction<CommonError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || 'Failed to fetch deals';
        }
      )
      .addCase(loginSubAdmin.pending, state => {
        state.loading = true;
      })
      .addCase(
        loginSubAdmin.fulfilled,
        (state, action: PayloadAction<SignInSubAdminResponse>) => {
          state.loading = false;
          state.subAdminId = action.payload.subadmin_id;
          state.subAdminName = action.payload.name;
          state.subAdminUsername = action.payload.username;
          state.subAdminInviteCode = action.payload.invite_code;
        }
      )
      .addCase(
        loginSubAdmin.rejected,
        (state, action: PayloadAction<CommonError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || 'Failed to fetch deals';
        }
      );
  },
});

export const { resetSubadmin } = subAdminSlice.actions;

export default subAdminSlice.reducer;
