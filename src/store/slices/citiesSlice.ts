import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { City } from '../../types';
import { mockCities } from '../../constants/mockCities';
import api from '../../services/api';

interface CitiesState {
  cities: City[];
  filteredCities: City[];
  loading: boolean;
  error: string | null;
  selectedCities: City[];
  filters: {
    cost: {
      maxTotal: number;
      maxHousing: number;
      maxFood: number;
      maxTransportation: number;
      maxEntertainment: number;
    };
    qualityOfLife: {
      minHealthcare: number;
      minSafety: number;
      maxPollution: number;
    };
    climate: {
      temperature: {
        min: number;
        max: number;
      };
      maxPrecipitation: number;
      selectedWeather: string[];
      selectedSeasons: string[];
    };
    infrastructure: {
      minWifiSpeed: number;
      minCoworkingSpaces: number;
    };
    digitalNomad: {
      minCommunitySize: number;
      minMonthlyMeetups: number;
      selectedVisas: string[];
    };
    internet: {
      selectedSpeeds: string[];
    };
  };
}

const initialState: CitiesState = {
  cities: [],
  filteredCities: [],
  loading: false,
  error: null,
  selectedCities: [],
  filters: {
    cost: {
      maxTotal: 2000,
      maxHousing: 1000,
      maxFood: 500,
      maxTransportation: 200,
      maxEntertainment: 300
    },
    qualityOfLife: {
      minHealthcare: 0,
      minSafety: 0,
      maxPollution: 100
    },
    climate: {
      temperature: {
        min: 15,
        max: 35
      },
      maxPrecipitation: 2000,
      selectedWeather: [],
      selectedSeasons: []
    },
    infrastructure: {
      minWifiSpeed: 0,
      minCoworkingSpaces: 0
    },
    digitalNomad: {
      minCommunitySize: 0,
      minMonthlyMeetups: 0,
      selectedVisas: []
    },
    internet: {
      selectedSpeeds: []
    }
  }
};

// ✅ Fetch ALL cities (called separately from filters)
export const fetchCities = createAsyncThunk(
  'cities/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching all cities...');
      const response = await api.get('/cities');
      console.log('Cities response:', response.data);
      
      if (response.data && response.data.cities) {
        return response.data.cities;
      } else {
        console.error('Invalid response format:', response.data);
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching cities:', error);

      if (error.code === 'ERR_NETWORK') {
        console.log('Network error, falling back to mock data');
        return mockCities;
      }

      return rejectWithValue(error.message || 'Failed to fetch cities');
    }
  }
);

// ✅ Fetch FILTERED cities (calls `/filter_cities` instead of `/cities`)
export const fetchFilteredCities = createAsyncThunk(
  'cities/fetchFilteredCities',
  async (filters: CitiesState['filters'], { rejectWithValue }) => {
    try {
      console.log('Sending filters to backend:', JSON.stringify(filters));

      // ✅ Convert filters to query parameters (all as strings)
      const params: Record<string, any> = {};
      
      if (filters.climate?.temperature?.min !== undefined) {
        params.min_temp = String(filters.climate.temperature.min);
      }
      if (filters.climate?.temperature?.max !== undefined) {
        params.max_temp = String(filters.climate.temperature.max);
      }
      if (filters.cost?.maxTotal !== undefined) {
        params.max_cost = String(filters.cost.maxTotal);
      }
      if (filters.digitalNomad?.selectedVisas?.length > 0) {
        params.visa_type = filters.digitalNomad.selectedVisas[0];
      }

      console.log('Query parameters:', params);

      const response = await api.get('/filter_cities', { params });
      console.log('Filter response:', response.data);

      if (response.data && response.data.cities) {
        return response.data.cities;
      } else {
        console.error('Invalid response format:', response.data);
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching filtered cities:', error);

      if (error.code === 'ERR_NETWORK') {
        console.log('Network error, falling back to mock data');
        return mockCities;
      }

      return rejectWithValue(error.message || 'Failed to fetch filtered cities');
    }
  }
);

// ✅ Apply filters locally (if API call fails)
const applyFilters = (cities: City[], filters: CitiesState['filters']): City[] => {
  return cities.filter(city => {
    const totalCost = 
      Number(city.metrics.cost.housing) + 
      Number(city.metrics.cost.food) + 
      Number(city.metrics.cost.transportation) + 
      Number(city.metrics.cost.entertainment);

    if (totalCost > Number(filters.cost.maxTotal)) return false;
    if (Number(city.metrics.cost.housing) > Number(filters.cost.maxHousing)) return false;
    if (Number(city.metrics.cost.food) > Number(filters.cost.maxFood)) return false;
    if (Number(city.metrics.cost.transportation) > Number(filters.cost.maxTransportation)) return false;
    if (Number(city.metrics.cost.entertainment) > Number(filters.cost.maxEntertainment)) return false;

    return true;
  });
};

export const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    selectCity: (state, action: PayloadAction<City>) => {
      if (!state.selectedCities.find(city => city.id === action.payload.id)) {
        state.selectedCities.push(action.payload);
      }
    },
    unselectCity: (state, action: PayloadAction<string>) => {
      state.selectedCities = state.selectedCities.filter(
        city => city.id !== action.payload
      );
    },
    clearSelectedCities: (state) => {
      state.selectedCities = [];
    },
    updateFilters: (state, action: PayloadAction<Partial<CitiesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredCities = []; // ✅ Clears instead of resetting to all cities
    },
    useMockData: (state) => {
      state.cities = mockCities;
      state.filteredCities = mockCities;
      state.loading = false;
      state.error = null;
    },
    saveUserPreferences: (state) => {
      // Save the current filters to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(state.filters));
    },
    loadUserPreferences: (state) => {
      // Load saved preferences from localStorage
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        try {
          state.filters = JSON.parse(savedPreferences);
        } catch (e) {
          console.error('Error loading saved preferences:', e);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch cities';
        state.cities = mockCities;
      })
      .addCase(fetchFilteredCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredCities.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredCities = action.payload;
      })
      .addCase(fetchFilteredCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch filtered cities';
        state.filteredCities = applyFilters(state.cities, state.filters);
      });
  }
});

export const { 
  selectCity, 
  unselectCity, 
  clearSelectedCities,
  updateFilters,
  resetFilters,
  useMockData,
  saveUserPreferences,
  loadUserPreferences
} = citiesSlice.actions;

export default citiesSlice.reducer;
