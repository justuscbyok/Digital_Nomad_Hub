import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, Users, Wifi, Heart, DollarSign, ThermometerSun, Shield, Guitar as Hospital, Wind, MapPin, Globe, Zap, RefreshCw, Map, Image, BookmarkPlus } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import { City } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateFilters, resetFilters, fetchFilteredCities, saveUserPreferences, loadUserPreferences } from '../../store/slices/citiesSlice';
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
  // Default images for fallback
  'default': [
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  // Asia
  'bangkok': [
    'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'bali': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'chiang-mai': [
    'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586932225845-b7c4539b4f69?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'tokyo': [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'singapore': [
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'kuala-lumpur': [
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1580687774746-5867a8270a08?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'ho-chi-minh': [
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1535952374268-28bfd242e3af?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'seoul': [
    'https://images.unsplash.com/photo-1538485399081-7c8ba554ace3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  
  // Europe
  'lisbon': [
    'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513735492246-483525079686?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'barcelona': [
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'berlin': [
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'london': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'paris': [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1541778480-81d3cd7f8a71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'amsterdam': [
    'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'prague': [
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'budapest': [
    'https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551867633-194f125bddfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  
  // Americas
  'mexico-city': [
    'https://images.unsplash.com/photo-1518659526054-190340b15ae0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1574493264149-7c899d5eb7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'new-york': [
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'buenos-aires': [
    'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1610555356070-d0efb6505f81?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'medellin': [
    'https://images.unsplash.com/photo-1599056407101-7c557a4a0144?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1619216083420-6e54b1f0b601?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'rio-de-janeiro': [
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'san-francisco': [
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534050359320-02900022671e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  
  // Africa & Middle East
  'cape-town': [
    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'dubai': [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'marrakech': [
    'https://images.unsplash.com/photo-1597212618440-806262de4f9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  
  // Oceania
  'sydney': [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524293581917-878a6d017c71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'melbourne': [
    'https://images.unsplash.com/photo-1514395462725-fb4566210144?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1545044846-351ba102b6d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ],
  'auckland': [
    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600208669687-f19af3638cb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ]
};

// Function to get image for a city
const getCityImage = (city: City): string => {
  // Try to find an image based on city name or ID
  const cityKey = city.name.toLowerCase().replace(/\s+/g, '-');
  const cityKeySimple = city.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Try different variations of the city name to find a match
  let images: string[] = [];
  
  if (CITY_IMAGES[city.id]) {
    images = CITY_IMAGES[city.id];
  } else if (CITY_IMAGES[cityKey]) {
    images = CITY_IMAGES[cityKey];
  } else if (CITY_IMAGES[cityKeySimple]) {
    images = CITY_IMAGES[cityKeySimple];
  } else {
    // If no exact match, try to find a partial match
    const partialMatches = Object.keys(CITY_IMAGES).filter(key => 
      key !== 'default' && (
        cityKey.includes(key) || 
        key.includes(cityKey) ||
        cityKeySimple.includes(key) ||
        key.includes(cityKeySimple)
      )
    );
    
    if (partialMatches.length > 0) {
      // Use the first partial match
      images = CITY_IMAGES[partialMatches[0]];
    } else {
      // If still no match, use default images
      images = CITY_IMAGES.default;
    }
  }
  
  // Return a random image from the available images for this city
  return images[Math.floor(Math.random() * images.length)];
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
  const [cityImageIndices, setCityImageIndices] = useState<Record<string, number>>({});
  const [savedMessageVisible, setSavedMessageVisible] = useState(false);

  // Load saved preferences on component mount
  useEffect(() => {
    dispatch(loadUserPreferences());
  }, [dispatch]);

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
    dispatch(fetchFilteredCities(initialFilters));
  };

  const saveAllPreferences = () => {
    dispatch(saveUserPreferences());
    // Show saved message
    setSavedMessageVisible(true);
    // Hide the message after 3 seconds
    setTimeout(() => {
      setSavedMessageVisible(false);
    }, 3000);
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

  // Function to cycle to the next image for a city
  const cycleImage = (e: React.MouseEvent, city: City) => {
    e.stopPropagation(); // Prevent card click event
    
    // Get the available images for this city
    const cityKey = city.name.toLowerCase().replace(/\s+/g, '-');
    const cityKeySimple = city.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let imageKey = 'default';
    if (CITY_IMAGES[city.id]) {
      imageKey = city.id;
    } else if (CITY_IMAGES[cityKey]) {
      imageKey = cityKey;
    } else if (CITY_IMAGES[cityKeySimple]) {
      imageKey = cityKeySimple;
    } else {
      // If no exact match, try to find a partial match
      const partialMatches = Object.keys(CITY_IMAGES).filter(key => 
        key !== 'default' && (
          cityKey.includes(key) || 
          key.includes(cityKey) ||
          cityKeySimple.includes(key) ||
          key.includes(cityKeySimple)
        )
      );
      
      if (partialMatches.length > 0) {
        imageKey = partialMatches[0];
      }
    }
    
    const images = CITY_IMAGES[imageKey];
    const currentIndex = cityImageIndices[city.id] || 0;
    const nextIndex = (currentIndex + 1) % images.length;
    
    setCityImageIndices(prev => ({
      ...prev,
      [city.id]: nextIndex
    }));
  };

  // Function to get specific image for a city based on index
  const getCityImageByIndex = (city: City): string => {
    // Try to find an image based on city name or ID
    const cityKey = city.name.toLowerCase().replace(/\s+/g, '-');
    const cityKeySimple = city.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Try different variations of the city name to find a match
    let images: string[] = [];
    let imageKey = 'default';
    
    if (CITY_IMAGES[city.id]) {
      images = CITY_IMAGES[city.id];
      imageKey = city.id;
    } else if (CITY_IMAGES[cityKey]) {
      images = CITY_IMAGES[cityKey];
      imageKey = cityKey;
    } else if (CITY_IMAGES[cityKeySimple]) {
      images = CITY_IMAGES[cityKeySimple];
      imageKey = cityKeySimple;
    } else {
      // If no exact match, try to find a partial match
      const partialMatches = Object.keys(CITY_IMAGES).filter(key => 
        key !== 'default' && (
          cityKey.includes(key) || 
          key.includes(cityKey) ||
          cityKeySimple.includes(key) ||
          key.includes(cityKeySimple)
        )
      );
      
      if (partialMatches.length > 0) {
        // Use the first partial match
        images = CITY_IMAGES[partialMatches[0]];
        imageKey = partialMatches[0];
      } else {
        // If still no match, use default images
        images = CITY_IMAGES.default;
      }
    }
    
    // Get the current index for this city, or default to 0
    const index = cityImageIndices[city.id] || 0;
    
    // Return the image at the current index
    return images[index % images.length];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 mt-2">
              <button
                className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
                onClick={resetAllFilters}
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>
              <button
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md px-3 py-1.5 hover:bg-blue-50"
                onClick={saveAllPreferences}
              >
                <BookmarkPlus className="h-4 w-4" />
                Save Preferences
              </button>
              {savedMessageVisible && (
                <span className="text-sm font-medium text-green-600 ml-2 animate-pulse">
                  Saved!
                </span>
              )}
            </div>
            <SlidersHorizontal className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="space-y-6">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="font-medium">Cost of Living</span>
                  <span className={`transform ${open ? 'rotate-180' : ''}`}>▼</span>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Total Monthly Cost (USD)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={filters.cost.maxTotal}
                      onChange={(e) => handleFilterChange('cost', 'maxTotal', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">${filters.cost.maxTotal}</div>
                  </div>
                  {costCategories.map(category => (
                    <div key={category.toLowerCase()}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum {category} Cost (USD)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={category === 'Housing' ? 2000 : 1000}
                        step="50"
                        value={filters.cost[`max${category}` as keyof typeof filters.cost]}
                        onChange={(e) => handleFilterChange('cost', `max${category}`, Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        ${filters.cost[`max${category}` as keyof typeof filters.cost]}
                      </div>
                    </div>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="font-medium">Quality of Life</span>
                  <span className={`transform ${open ? 'rotate-180' : ''}`}>▼</span>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 space-y-4">
                  {qualityOfLifeFactors.map(factor => (
                    <div key={factor.toLowerCase()}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {factor === 'Air Quality' ? 'Maximum Pollution Index' : `Minimum ${factor} Index`}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={factor === 'Air Quality' 
                          ? filters.qualityOfLife.maxPollution
                          : filters.qualityOfLife[`min${factor.replace(' ', '')}` as keyof typeof filters.qualityOfLife]
                        }
                        onChange={(e) => handleFilterChange(
                          'qualityOfLife',
                          factor === 'Air Quality' ? 'maxPollution' : `min${factor.replace(' ', '')}`,
                          Number(e.target.value)
                        )}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 mt-1">
                        {factor === 'Air Quality' 
                          ? filters.qualityOfLife.maxPollution
                          : filters.qualityOfLife[`min${factor.replace(' ', '')}` as keyof typeof filters.qualityOfLife]
                        }/100
                      </div>
                    </div>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="font-medium">Climate & Weather</span>
                  <span className={`transform ${open ? 'rotate-180' : ''}`}>▼</span>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature Range (°C)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          min="0"
                          max={filters.climate.temperature.max}
                          value={filters.climate.temperature.min}
                          onChange={(e) => handleFilterChange('climate', 'temperature', {
                            ...filters.climate.temperature,
                            min: Number(e.target.value)
                          })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <span className="text-sm text-gray-500">Min</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          min={filters.climate.temperature.min}
                          max="50"
                          value={filters.climate.temperature.max}
                          onChange={(e) => handleFilterChange('climate', 'temperature', {
                            ...filters.climate.temperature,
                            max: Number(e.target.value)
                          })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <span className="text-sm text-gray-500">Max</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Annual Precipitation (mm)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="100"
                      value={filters.climate.maxPrecipitation}
                      onChange={(e) => handleFilterChange('climate', 'maxPrecipitation', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">{filters.climate.maxPrecipitation}mm</div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Weather Type</label>
                    <div className="flex flex-wrap gap-2">
                      {weatherTypes.map(type => (
                        <button
                          key={type}
                          onClick={() => handleFilterChange(
                            'climate',
                            'selectedWeather',
                            toggleArrayFilter(filters.climate.selectedWeather, type)
                          )}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.climate.selectedWeather.includes(type)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Seasons</label>
                    <div className="flex flex-wrap gap-2">
                      {seasons.map(season => (
                        <button
                          key={season}
                          onClick={() => handleFilterChange(
                            'climate',
                            'selectedSeasons',
                            toggleArrayFilter(filters.climate.selectedSeasons, season)
                          )}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.climate.selectedSeasons.includes(season)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {season}
                        </button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="font-medium">Infrastructure & Internet</span>
                  <span className={`transform ${open ? 'rotate-180' : ''}`}>▼</span>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum WiFi Speed (Mbps)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.infrastructure.minWifiSpeed}
                      onChange={(e) => handleFilterChange('infrastructure', 'minWifiSpeed', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">{filters.infrastructure.minWifiSpeed}Mbps</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Coworking Spaces
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={filters.infrastructure.minCoworkingSpaces}
                      onChange={(e) => handleFilterChange('infrastructure', 'minCoworkingSpaces', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">{filters.infrastructure.minCoworkingSpaces} spaces</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Community Size
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.digitalNomad.minCommunitySize}
                      onChange={(e) => handleFilterChange('digitalNomad', 'minCommunitySize', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">{filters.digitalNomad.minCommunitySize} people</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Monthly Meetups
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.digitalNomad.minMonthlyMeetups}
                      onChange={(e) => handleFilterChange('digitalNomad', 'minMonthlyMeetups', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">{filters.digitalNomad.minMonthlyMeetups} meetups</div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Visa Types</label>
                    <div className="flex flex-wrap gap-2">
                      {visaTypes.map(type => (
                        <button
                          key={type}
                          onClick={() => handleFilterChange(
                            'digitalNomad',
                            'selectedVisas',
                            toggleArrayFilter(filters.digitalNomad.selectedVisas, type)
                          )}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.digitalNomad.selectedVisas.includes(type)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Internet Speeds</label>
                    <div className="flex flex-wrap gap-2">
                      {internetSpeeds.map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleFilterChange(
                            'internet',
                            'selectedSpeeds',
                            toggleArrayFilter(filters.internet.selectedSpeeds, speed)
                          )}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.internet.selectedSpeeds.includes(speed)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
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
                            src={getCityImageByIndex(city)}
                            alt={`Photo of ${city.name}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(city.id)}
                            onClick={(e) => cycleImage(e, city)}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-xs font-medium">{city.name}, {city.country}</span>
                              <button 
                                className="bg-white/30 hover:bg-white/50 rounded-full p-1 text-white"
                                onClick={(e) => cycleImage(e, city)}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </button>
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
                <div className="flex items-center gap-3">
                  <button
                    className="inline-flex items-center gap-1 text-lg font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
                    onClick={resetAllFilters}
                  >
                    <RefreshCw className="h-5 w-5" />
                    Reset All
                  </button>
                  <button
                    className="inline-flex items-center gap-1 text-lg font-semibold text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md px-3 py-1.5 hover:bg-blue-50"
                    onClick={saveAllPreferences}
                  >
                    <BookmarkPlus className="h-5 w-5" />
                    Save Preferences
                  </button>
                  {savedMessageVisible && (
                    <span className="text-lg font-medium text-green-600 ml-2 animate-pulse">
                      Saved!
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 