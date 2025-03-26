import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { TravelPlan } from '../../types';

interface JourneyState {
  plans: TravelPlan[];
  currentPlan: TravelPlan | null;
  loading: boolean;
  error: string | null;
}

const initialState: JourneyState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
};

export const createJourneyPlan = createAsyncThunk(
  'journey/createPlan',
  async (plan: Omit<TravelPlan, 'id'>) => {
    const response = await api.post('/plans', plan);
    return response.data;
  }
);

export const fetchJourneyPlans = createAsyncThunk(
  'journey/fetchPlans',
  async () => {
    const response = await api.get('/plans');
    return response.data;
  }
);

export const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    setCurrentPlan: (state, action: PayloadAction<TravelPlan>) => {
      state.currentPlan = action.payload;
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJourneyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJourneyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.push(action.payload);
        state.currentPlan = action.payload;
      })
      .addCase(createJourneyPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create plan';
      })
      .addCase(fetchJourneyPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJourneyPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchJourneyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plans';
      });
  },
});

export const { setCurrentPlan, clearCurrentPlan } = journeySlice.actions;
export default journeySlice.reducer;