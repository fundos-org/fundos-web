import toast from 'react-hot-toast';
import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/app/store';

interface ToastOptions {
  loading?: string;
  success?: string | ((data: unknown) => string);
  error?: string | ((error: unknown) => string);
}

export const toastifyThunk = <T>(
  thunk: ThunkAction<Promise<T>, RootState, unknown, AnyAction>,
  dispatch: AppDispatch,
  options: ToastOptions = {}
): Promise<T> => {
  const defaultOptions: ToastOptions = {
    loading: 'Processing...',
    success: 'Operation successful!',
    error: error =>
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'An error occurred',
    ...options,
  };

  return toast.promise(
    dispatch(thunk),
    {
      loading: defaultOptions.loading ?? 'Processing...',
      success: data =>
        typeof defaultOptions.success === 'function'
          ? defaultOptions.success(data)
          : defaultOptions.success!,
      error: error =>
        typeof defaultOptions.error === 'function'
          ? defaultOptions.error(error)
          : defaultOptions.error!,
    },
    {
      style: {
        minWidth: '250px',
        borderRadius: 0,
      },
    }
  );
};
