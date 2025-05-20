import { configureStore } from '@reduxjs/toolkit';
import dealsFeature from '../slices/dealSlice';
import subAdminFeature from '../slices/subAdminSlice';

const store = configureStore({
  reducer: {
    deals: dealsFeature,
    subAdmin: subAdminFeature
  },
});

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
