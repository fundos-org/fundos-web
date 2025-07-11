import { fetchMembersStatistics } from '@/axioscalls/apiServices';
import { CommonError } from '@/constants/dealsConstant';
import {
  MemberApiResponse,
  Members,
  Statistics,
} from '@/constants/membersConstant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MemberState {
  subAdminId?: string | null;
  inviteCode?: string | null;
  members?: Members | null;
  statistics?: Statistics | null;
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  subAdminId: null,
  inviteCode: null,
  members: null,
  statistics: null,
  loading: false,
  error: null,
};

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMembersStatistics.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchMembersStatistics.fulfilled,
        (state, { payload }: PayloadAction<MemberApiResponse>) => {
          state.loading = false;
          state.subAdminId = payload.subadmin_id;
          state.inviteCode = payload.invite_code;
          state.members = payload.members;
          state.statistics = payload.statistics;
        }
      )
      .addCase(
        fetchMembersStatistics.rejected,
        (state, action: PayloadAction<CommonError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || 'Failed to fetch deals';
        }
      );
  },
});

export default memberSlice.reducer;
