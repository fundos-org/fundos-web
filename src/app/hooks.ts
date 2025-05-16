import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { Action, ThunkAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppStateEffect = <T extends keyof RootState>(
  selector: (state: RootState) => RootState[T],
  action: () => ThunkAction<void, RootState, unknown, Action>
): RootState[T] => {
  const dispatch = useDispatch<AppDispatch>();
  const selected = useSelector(selector);

  useEffect(() => {
    if (action) {
      dispatch(action());
    }
  }, [dispatch, action]);

  return selected;
};

// const callDraftApi = useCallback(async () => {
//     try {
//       await toastifyThunk(
//         createDraft(),
//         dispatch,
//         {
//           loading: 'Fetching deal id...',
//           success: (data) => {
//             const payload = (data as { payload: { message: string } }).payload;
//             return `Fetched user: ${payload.message}`
//           },
//           error: (error) => `Error: ${error}`,
//         }
//       );
//     } catch (error) {
//       // Errors are handled by toast, but you can add additional logic here if needed
//       console.error('Toastified thunk error:', error);
//     }
//   }, [dispatch]);

export const useAppStateEvent = <T extends keyof RootState>(
  selector: (state: RootState) => RootState[T]
): { dispatchThunk: (action?: () => ThunkAction<void, RootState, unknown, Action>) => void; selected: RootState[T] } => {
  const dispatch = useDispatch<AppDispatch>();
  const selected = useSelector(selector);

  const dispatchThunk = (action?: () => ThunkAction<void, RootState, unknown, Action>) => {
    if (action) dispatch(action());
  };

  return { dispatchThunk, selected };
};