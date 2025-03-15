import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Helper function to log errors
const handleApiError = (error: any) => {
  if (error.response) {
    console.error('Error Response:', error.response.data); // Log API response errors
  } else if (error.request) {
    console.error('No Response:', error.request); // No response received
  } else {
    console.error('Request Error:', error.message); // Request setup error
  }
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // First create the user
      await api.post('/users/', { email, password });

      // Then login to get the token
      const response = await api.post('/token', new URLSearchParams({
        username: email,
        password: password,
      }));

      console.log('Sign Up Response:', response.data);
      
      localStorage.setItem('token', response.data.access_token);
      const userResponse = await api.get('/profile');
      return { user: userResponse.data };
    } catch (error: any) {
      handleApiError(error);
      return rejectWithValue(error.response?.data || 'Sign up failed');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/token', new URLSearchParams({
        username: email,
        password: password,
      }));

      console.log('Sign In Response:', response.data);
      
      localStorage.setItem('token', response.data.access_token);
      const userResponse = await api.get('/profile');
      return { user: userResponse.data };
    } catch (error: any) {
      handleApiError(error);
      return rejectWithValue(error.response?.data || 'Sign in failed');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  localStorage.removeItem('token');
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error: any) {
    handleApiError(error);
    localStorage.removeItem('token');
    return rejectWithValue('Authentication check failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Sign up failed';
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Sign in failed';
      })
      // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 