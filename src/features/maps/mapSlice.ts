import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { calculateAndDisplayRoute } from "../counter/counterAPI";

export interface MapState {  
  start: string;
  end: string;
  status: "idle" | "loading" | "failed";
  distance: number; 
}

const initialState: MapState = {  
  start: "",
  end: "",
  status: "idle",
  distance: 0  
};

export const callDirectionsAPI = createAsyncThunk(
  "maps/callDirectionsAPI",
  async (data: any) => {    
    const response = await calculateAndDisplayRoute(
      data.directionsService,
      data.directionsRenderer,
      data.start,
      data.end
    );
    // The value we return becomes the `fulfilled` action payload
    return (response); 
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
    }  
  },
  extraReducers: (builder) => {
    builder
      .addCase(callDirectionsAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(callDirectionsAPI.fulfilled, (state, action) => {        
        state.status = "idle";        
        state.distance = JSON.parse(action.payload)[0].legs[0].distance?.value;
      });
  },
});

export const { setStart, setEnd } = mapSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectMap = (state: RootState) => state.map;

export default mapSlice.reducer;
