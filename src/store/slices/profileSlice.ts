import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { mockApi, UserProfile } from '../../services/mockApi';

export type { UserProfile } from '../../services/mockApi';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    try {
      // Try to use real API first
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      // Fall back to mock API if real API fails
      return await mockApi.getProfile();
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profile: Partial<UserProfile>) => {
    try {
      // Try to use real API first
      const response = await api.patch('/profile', profile);
      return response.data;
    } catch (error) {
      // Fall back to mock API if real API fails
      return await mockApi.updateProfile(profile);
    }
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
    updatePreferences: (state, action: PayloadAction<UserProfile['preferences']>) => {
      if (state.profile) {
        state.profile.preferences = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      });
  },
});

export const { setProfile, clearProfile, updatePreferences } = profileSlice.actions;
export default profileSlice.reducer;