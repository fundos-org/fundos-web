import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import handleCreateDealEvent from '@/apis/dealApiServices'
import axios from "axios";

const initialState = {
  loading: false,
  dealId: '',
  error: ''
}

// Generates pending, fulfilled and rejected action types
export const fetchDealCreationDetails = createAsyncThunk('dealCreationDetails/fetchDealCreationDetails', () => {
  return axios
        .post("http://43.205.36.168/api/v1/live/deals/web/create/draft", {
            fund_manager_id: "9c0e5407-c3f2-402e-891b-0e4f2489e837", // hard coded this for now
        }).then((response) => response.data.deal_id)
})

const dealCreationSlice = createSlice({
  name: 'dealCreationDetails',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDealCreationDetails.pending, state => {
      state.loading = true
    })
    builder.addCase(
      fetchDealCreationDetails.fulfilled,
      (state, action) => {
        state.loading = false
        state.dealId = action.payload
        state.error = ''
      }
    )
    builder.addCase(fetchDealCreationDetails.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Something went wrong'
    })
  }
})

export default dealCreationSlice.reducer