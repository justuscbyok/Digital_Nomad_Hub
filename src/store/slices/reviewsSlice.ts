import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

// Review interface
export interface Review {
  id: string;
  title: string;
  location: string;
  date: string;
  rating: number;
  content: string;
  images?: string;
  createdAt: string;
  userId?: string;
}

// State interface
interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
};

// localStorage keys
const STORAGE_KEY = 'user_reviews';

// Safe localStorage wrapper to handle potential errors
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
      return false;
    }
  }
};

// Helper to simulate BigQuery operations
const mockBigQuery = {
  // Get reviews from localStorage
  getReviews: (): Review[] => {
    try {
      const storedData = safeStorage.getItem(STORAGE_KEY);
      const reviews = storedData ? JSON.parse(storedData) : [];
      console.log("Retrieved reviews from localStorage:", reviews);
      return reviews;
    } catch (error) {
      console.error("Error parsing reviews from localStorage:", error);
      return [];
    }
  },
  
  // Save reviews to localStorage (simulating BigQuery insert)
  saveReviews: (reviews: Review[]): void => {
    try {
      const saveSuccess = safeStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
      console.log("Saved reviews to localStorage:", reviews, "Success:", saveSuccess);
    } catch (error) {
      console.error("Error saving reviews to localStorage:", error);
    }
  },
  
  // Add a new review
  addReview: (review: Review): Review[] => {
    try {
      const reviews = mockBigQuery.getReviews();
      const updatedReviews = [...reviews, review];
      mockBigQuery.saveReviews(updatedReviews);
      
      // Log for debugging - in a real app, this would be sent to BigQuery
      console.log('Saving review to mock BigQuery:', review);
      
      return updatedReviews;
    } catch (error) {
      console.error("Error adding review:", error);
      return [];
    }
  },
  
  // Delete a review
  deleteReview: (reviewId: string): Review[] => {
    try {
      const reviews = mockBigQuery.getReviews();
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      mockBigQuery.saveReviews(updatedReviews);
      return updatedReviews;
    } catch (error) {
      console.error("Error deleting review:", error);
      return [];
    }
  }
};

// Async thunks
export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async () => {
    try {
      // In a real app, we would call an API that fetches from BigQuery
      // const response = await api.get('/reviews');
      // return response.data;
      
      // For now, use mock storage
      return mockBigQuery.getReviews();
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw new Error('Failed to fetch reviews');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (review: Review) => {
    try {
      // In a real app, this would post to an API that inserts into BigQuery
      // const response = await api.post('/reviews', review);
      // return response.data;
      
      // For now, use mock storage
      return mockBigQuery.addReview(review);
    } catch (error) {
      console.error("Error adding review:", error);
      throw new Error('Failed to add review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId: string) => {
    try {
      // In a real app, this would call an API that deletes from BigQuery
      // await api.delete(`/reviews/${reviewId}`);
      // return reviewId;
      
      // For now, use mock storage
      const updatedReviews = mockBigQuery.deleteReview(reviewId);
      return { reviewId, updatedReviews };
    } catch (error) {
      console.error("Error deleting review:", error);
      throw new Error('Failed to delete review');
    }
  }
);

// Create the reviews slice
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      
      // Add review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add review';
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.updatedReviews;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete review';
      });
  },
});

export default reviewsSlice.reducer; 