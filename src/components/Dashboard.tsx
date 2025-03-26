import React, { useState, useEffect } from 'react';
import { Globe, Calendar, Search, User } from 'lucide-react';
import CityComparison from './CityIntelligence/CityComparison';
import JourneyPlanner from './JourneyPlanner/JourneyPlanner';
import Discover from './Discover/Discover';
import Profile from './Profile/Profile';
import { City } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { signOut } from '../store/slices/authSlice';
import { fetchCities } from '../store/slices/citiesSlice';
import { mockCities } from '../constants/mockCities';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { cities, loading, error } = useAppSelector((state) => state.cities);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'planner' | 'discover' | 'profile'>('intelligence');
  const [selectedCities, setSelectedCities] = useState<City[]>([]);

  // Fetch cities for City Intelligence and Discover tabs
  useEffect(() => {
    console.log(`Active tab changed to: ${activeTab}`);
    if (activeTab === 'intelligence' || activeTab === 'discover') {
      console.log('Fetching cities for', activeTab);
      dispatch(fetchCities());
    }
  }, [dispatch, activeTab]);

  // Add a useEffect to log errors
  useEffect(() => {
    if (error) {
      console.error('Error in cities state:', error);
    }
  }, [error]);

  const tabs = [
    { id: 'intelligence', label: 'City Intelligence', icon: Globe },
    { id: 'planner', label: 'Journey Planner', icon: Calendar },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const handleCitySelect = (city: City) => {
    if (selectedCities.find((c) => c.id === city.id)) {
      setSelectedCities(selectedCities.filter((c) => c.id !== city.id));
    } else if (selectedCities.length < 4) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const renderContent = () => {
    if (activeTab === 'intelligence' && loading) {
      return <div className="text-center text-gray-500">Loading cities...</div>;
    }

    if (activeTab === 'intelligence' && error) {
      return <div className="text-center text-red-500">Error loading cities: {error}</div>;
    }

    switch (activeTab) {
      case 'intelligence':
        return (
          <>
            <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">Select up to 4 Cities</h2>
              <div className="flex overflow-x-scroll space-x-3 py-2 scrollbar-hide">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className={`px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
                      selectedCities.find((c) => c.id === city.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCities.map((city) => (
                <div key={city.id} className="flex items-center bg-blue-100 px-3 py-1 rounded-lg text-blue-700">
                  {city.name}
                  <button
                    onClick={() => handleCitySelect(city)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <CityComparison selectedCities={selectedCities} onCitySelect={() => {}} />
          </>
        );

      case 'planner':
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan Your Journey</h2>
              <JourneyPlanner cities={cities} />
            </div>
          </>
        );

      case 'discover':
        // Use an empty array for cities prop since we're now using Redux store
        return <Discover cities={[]} />;

      case 'profile':
        return <Profile />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Globe className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">Digital Nomad Hub</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors
                ${activeTab === id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon className="mr-2 h-5 w-5" />
              {label}
            </button>
          ))}
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

