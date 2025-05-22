import { configureStore } from '@reduxjs/toolkit';
import dealsFeature from '../slices/dealSlice';
import subAdminFeature from '../slices/subAdminSlice';
import adminFeature from '../slices/adminSlice';
import globalFeature from '../slices/globalSlice';
import memberFeature from '../slices/memberSlice';

const store = configureStore({
  reducer: {
    global: globalFeature,
    deals: dealsFeature,
    subAdmin: subAdminFeature,
    admin: adminFeature,
    member: memberFeature
  },
});

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
