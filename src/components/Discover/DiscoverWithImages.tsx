import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, Users, Wifi, Heart, DollarSign, ThermometerSun, Shield, Guitar as Hospital, Wind, MapPin, Globe, Zap, RefreshCw, Map, Image } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import { City } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateFilters, resetFilters, fetchFilteredCities } from '../../store/slices/citiesSlice';
import { AppDispatch } from '../../store';

// Mapbox API token - in a real app, this would come from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

// Map style options
const MAP_STYLES = {
  streets: 'streets-v11',
  outdoors: 'outdoors-v11',
  light: 'light-v10',
  dark: 'dark-v10',
  satellite: 'satellite-v9'
};

// City images mapping - in a real app, these would come from an API or database
const CITY_IMAGES: Record<string, string[]> = {
  // Sample images for cities - using Unsplash for placeholder images
  'default': [
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'bangkok': [
    'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'bali': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'lisbon': [
    'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513735492246-483525079686?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'mexico-city': [
    'https://images.unsplash.com/photo-1518659526054-190340b15ae0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1574493264149-7c899d5eb7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'chiang-mai': [
    'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586932225845-b7c4539b4f69?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ]
};

// Function to get image for a city
const getCityImage = (city: City): string => {
  // Try to find an image based on city name or ID
  const cityKey = city.name.toLowerCase().replace(/\s+/g, '-');
  
  if (CITY_IMAGES[city.id]) {
    return CITY_IMAGES[city.id][0];
  } else if (CITY_IMAGES[cityKey]) {
    return CITY_IMAGES[cityKey][0];
  } else {
    // Return a default image if no specific image is found
    return CITY_IMAGES.default[Math.floor(Math.random() * CITY_IMAGES.default.length)];
  }
};

const visaTypes = ['Visa on arrival', 'E-visa', 'Visa-free', 'Digital nomad visa'];
const weatherTypes = ['Hot', 'Moderate', 'Cool'];
const internetSpeeds = ['Fast (50+ Mbps)', 'Medium (20-50 Mbps)', 'Basic (< 20 Mbps)'];
const seasons = ['Hot', 'Cool', 'Dry', 'Wet', 'Rainy'];
const qualityOfLifeFactors = ['Healthcare', 'Safety', 'Air Quality'];
const costCategories = ['Housing', 'Food', 'Transportation', 'Entertainment'];

// Default filter values
const initialFilters = {
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
    selectedWeather: [] as string[],
    selectedSeasons: [] as string[]
  },
  infrastructure: {
    minWifiSpeed: 0,
    minCoworkingSpaces: 0
  },
  digitalNomad: {
    minCommunitySize: 0,
    minMonthlyMeetups: 0,
    selectedVisas: [] as string[]
  },
  internet: {
    selectedSpeeds: [] as string[]
  }
};

interface DiscoverProps {
  cities: City[];
}

export default function Discover({ cities }: DiscoverProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredCities, loading, filters } = useSelector((state: RootState) => state.cities);
  const [mapErrors, setMapErrors] = useState<Record<string, boolean>>({});
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.streets);
  const [showMaps, setShowMaps] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleFilterChange = (category: string, subCategory: string, value: any) => {
    dispatch(updateFilters({
      [category]: {
        ...filters[category as keyof typeof filters],
        [subCategory]: value
      }
    }));
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
    // After resetting filters, fetch all cities
    dispatch(fetchFilteredCities(initialFilters));
  };

  const toggleArrayFilter = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  useEffect(() => {
    dispatch(fetchFilteredCities(filters));
  }, [filters, dispatch]);

  // Function to handle map loading errors
  const handleMapError = (cityId: string) => {
    setMapErrors(prev => ({
      ...prev,
      [cityId]: true
    }));
  };

  // Function to handle image loading errors
  const handleImageError = (cityId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [cityId]: true
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={resetAllFilters}
              className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset Filters
            </button>
            <SlidersHorizontal className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Filter sections remain the same */}
        </div>
      </div>

      {/* Results section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Results</h2>
          
          <div className="flex items-center space-x-4">
            {/* View toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setShowMaps(false)}
                className={`px-3 py-1 rounded-l-md text-sm flex items-center ${
                  !showMaps ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Image className="h-4 w-4 mr-1" />
                Photos
              </button>
              <button
                onClick={() => setShowMaps(true)}
                className={`px-3 py-1 rounded-r-md text-sm flex items-center ${
                  showMaps ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Map className="h-4 w-4 mr-1" />
                Maps
              </button>
            </div>
            
            {/* Map style selector (only show when maps are enabled) */}
            {showMaps && (
              <div className="flex items-center">
                <select 
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value)}
                  className="text-sm border rounded-md px-2 py-1"
                >
                  <option value={MAP_STYLES.streets}>Street Map</option>
                  <option value={MAP_STYLES.outdoors}>Outdoors</option>
                  <option value={MAP_STYLES.light}>Light</option>
                  <option value={MAP_STYLES.dark}>Dark</option>
                  <option value={MAP_STYLES.satellite}>Satellite</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">{filteredCities.length} cities found</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCities.map((city) => (
                <div 
                  key={city.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  onClick={() => {
                    // In a real app, this would navigate to a city detail page
                    console.log(`Clicked on ${city.name}`);
                  }}
                >
                  <div className="h-40 bg-gray-200 relative">
                    {showMaps ? (
                      // Map view
                      city.coordinates && !mapErrors[city.id] ? (
                        <>
                          <img 
                            src={`https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/pin-s+1A73E8(${city.coordinates.lng},${city.coordinates.lat})/${city.coordinates.lng},${city.coordinates.lat},11,0/300x160?access_token=${MAPBOX_TOKEN}`}
                            alt={`Map of ${city.name}`}
                            className="w-full h-full object-cover"
                            onError={() => handleMapError(city.id)}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-white mr-1" />
                              <span className="text-white text-xs font-medium">{city.name}, {city.country}</span>
                            </div>
                          </div>
                          
                          {/* Zoom controls */}
                          <div className="absolute top-2 right-2 flex flex-col space-y-1">
                            <button 
                              className="bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md text-gray-700 hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps/search/?api=1&query=${city.coordinates.lat},${city.coordinates.lng}`, '_blank');
                              }}
                            >
                              <span className="text-xs font-bold">+</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        // Fallback if no coordinates are available or map failed to load
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <MapPin className="h-12 w-12 text-gray-400" />
                        </div>
                      )
                    ) : (
                      // Photo view
                      !imageErrors[city.id] ? (
                        <>
                          <img 
                            src={getCityImage(city)}
                            alt={`Photo of ${city.name}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(city.id)}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <div className="flex items-center">
                              <span className="text-white text-xs font-medium">{city.name}, {city.country}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        // Fallback if image failed to load
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                      )
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{city.name}</h3>
                        <p className="text-gray-600">{city.country}</p>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                        ${city.metrics.cost.housing + city.metrics.cost.food}/mo
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ThermometerSun className="h-4 w-4 mr-1" />
                        {city.metrics.climate.averageTemperature}°C
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Wifi className="h-4 w-4 mr-1" />
                        {city.metrics.infrastructure.averageWifiSpeed} Mbps
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Shield className="h-4 w-4 mr-1" />
                        {city.metrics.qualityOfLife.safetyIndex}/100
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-1" />
                        {city.metrics.digitalNomad.visaRequirements}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredCities.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No cities match your filters</p>
                <button 
                  onClick={resetAllFilters}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 