import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface AlertState {
  open: boolean;
  message: string;
  variant: "error" | "warning" | "info" | "success" | undefined;
}

const initialState: AlertState = {
  open: false,
  message: "",
  variant: undefined,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setOpen: (state, action: PayloadAction<any>) => {
      state.open = action.payload.open;
      state.message = action.payload.message;
      state.variant = action.payload.variant;
    },
  },
});

export const { setOpen } = alertSlice.actions;

export const selectAlert = (state: RootState) => state.alert;

export default alertSlice.reducer;
