import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { calculateAndDisplayRoute } from "./mapsAPI";

export interface MapState {
  distance: number;
  end: string;
  fee: string;
  price: string;
  start: string;
  status: "idle" | "loading" | "failed";
  errorMsg: any;
  map: any;
  directionsRenderer: any;
  directionsService: any;
}

const initialState: MapState = {
  distance: 0,
  end: "",
  fee: "",
  price: "",
  start: "",
  status: "idle",
  errorMsg: null,
  map: null,
  directionsRenderer: undefined,
  directionsService: undefined,
};

export const callDirectionsAPI = createAsyncThunk(
  "maps/callDirectionsAPI",
  async (data: any, { rejectWithValue }) => {
    const response: any = await calculateAndDisplayRoute(
      data.directionsService,
      data.directionsRenderer,
      data.start,
      data.end      
    );
    // The value we return becomes the `fulfilled` action payload
    if (response.value) {
      return response;
    } else {
      return rejectWithValue(response);
    }
  }
);

export const mapSlice = createSlice({
  name: "map",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setStart: (state, action: PayloadAction<string>) => {
      state.start = action.payload;
    },
    setEnd: (state, action: PayloadAction<string>) => {
      state.end = action.payload;
    },
    setFee: (state, action: PayloadAction<string>) => {
      state.fee = action.payload;
    },
    setPrice: (state, action: PayloadAction<string>) => {
      state.price = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(callDirectionsAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(callDirectionsAPI.fulfilled, (state, action) => {
        state.status = "idle";
        state.distance = action.payload.value;
        state.errorMsg = undefined;
      })
      .addCase(callDirectionsAPI.rejected, (state, action) => {
        console.log("FAIL");
        state.errorMsg = action.payload;
        state.distance = 0;
        state.price = "0";
      });
  },
});

export const { setStart, setEnd, setFee, setPrice } = mapSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectMap = (state: RootState) => state.map;

export default mapSlice.reducer;
