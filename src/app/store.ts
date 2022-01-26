import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mapReducer from '../features/maps/mapSlice';
import alertReducer from '../features/alert/alertSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    alert: alertReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
