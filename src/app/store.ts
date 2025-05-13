import { configureStore } from '@reduxjs/toolkit';
import dealCreationReducer from '../features/dealCreationSlice';

const store = configureStore({
  reducer: {
    dealCreationDetails: dealCreationReducer,
  },
});

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
