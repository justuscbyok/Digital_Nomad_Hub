import { configureStore } from '@reduxjs/toolkit';
import citiesReducer from './slices/citiesSlice';
import journeyReducer from './slices/journeySlice';
import profileReducer from './slices/profileSlice';
import authReducer from './slices/authSlice';
import reviewsReducer from './slices/reviewsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cities: citiesReducer,
    journey: journeyReducer,
    profile: profileReducer,
    reviews: reviewsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;