import React, { useState } from 'react';
import { Globe, Calendar, Search, User } from 'lucide-react';
import CityComparison from './CityIntelligence/CityComparison';
import JourneyPlanner from './JourneyPlanner/JourneyPlanner';
import Discover from './Discover/Discover';
import Profile from './Profile/Profile';
import { City } from '../types';
import { useAppDispatch } from '../hooks';
import { signOut } from '../store/slices/authSlice';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'planner' | 'discover' | 'profile'>('intelligence');
  const [cityInputs, setCityInputs] = useState<Array<{ name: string }>>([
    { name: '' },
    { name: '' },
    { name: '' }
  ]);
  const dispatch = useAppDispatch();

  const defaultCities: City[] = [
    {
      id: 'bangkok',
      name: 'Bangkok',
      country: 'Thailand',
      coordinates: { lat: 13.7563, lng: 100.5018 },
      metrics: {
        climate: {
          averageTemperature: 28,
          precipitation: 1648,
          seasons: ['Hot', 'Rainy', 'Cool']
        },
        cost: {
          housing: 800,
          food: 400,
          transportation: 100,
          entertainment: 300,
          costOfLivingIndex: 60
        },
        infrastructure: {
          averageWifiSpeed: 55,
          coworkingSpaces: 45
        },
        qualityOfLife: {
          healthcareIndex: 80,
          safetyIndex: 65,
          pollutionIndex: 40
        },
        digitalNomad: {
          communitySize: 5000,
          monthlyMeetups: 25,
          visaRequirements: 'Visa on arrival'
        }
      }
    },
    {
      id: 'chiang-mai',
      name: 'Chiang Mai',
      country: 'Thailand',
      coordinates: { lat: 18.7883, lng: 98.9853 },
      metrics: {
        climate: {
          averageTemperature: 25,
          precipitation: 1150,
          seasons: ['Hot', 'Rainy', 'Cool']
        },
        cost: {
          housing: 500,
          food: 300,
          transportation: 80,
          entertainment: 200,
          costOfLivingIndex: 45
        },
        infrastructure: {
          averageWifiSpeed: 50,
          coworkingSpaces: 35
        },
        qualityOfLife: {
          healthcareIndex: 75,
          safetyIndex: 75,
          pollutionIndex: 35
        },
        digitalNomad: {
          communitySize: 3500,
          monthlyMeetups: 20,
          visaRequirements: 'Visa on arrival'
        }
      }
    },
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      coordinates: { lat: -8.4095, lng: 115.1889 },
      metrics: {
        climate: {
          averageTemperature: 27,
          precipitation: 1700,
          seasons: ['Dry', 'Wet']
        },
        cost: {
          housing: 600,
          food: 350,
          transportation: 90,
          entertainment: 250,
          costOfLivingIndex: 50
        },
        infrastructure: {
          averageWifiSpeed: 45,
          coworkingSpaces: 40
        },
        qualityOfLife: {
          healthcareIndex: 70,
          safetyIndex: 80,
          pollutionIndex: 30
        },
        digitalNomad: {
          communitySize: 4000,
          monthlyMeetups: 30,
          visaRequirements: 'Visa on arrival'
        }
      }
    }
  ];

  const tabs = [
    { id: 'intelligence', label: 'City Intelligence', icon: Globe },
    { id: 'planner', label: 'Journey Planner', icon: Calendar },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const handleCityInputChange = (index: number, value: string) => {
    const newInputs = [...cityInputs];
    newInputs[index] = { name: value };
    setCityInputs(newInputs);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'intelligence':
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-semibold">City {index + 1}</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter city name"
                        value={cityInputs[index].name}
                        onChange={(e) => handleCityInputChange(index, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CityComparison
              selectedCities={defaultCities}
              onCitySelect={() => {}}
            />
          </>
        );

      case 'planner':
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan Your Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Departure</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter departure city"
                      value={cityInputs[0].name}
                      onChange={(e) => handleCityInputChange(0, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Arrival</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter arrival city"
                      value={cityInputs[1].name}
                      onChange={(e) => handleCityInputChange(1, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <JourneyPlanner selectedCities={defaultCities.slice(0, 2)} />
          </>
        );

      case 'discover':
        return <Discover cities={defaultCities} />;

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