import React, { useState } from 'react';
import { Map, Calendar, Bus, Plane, Train, Building2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { City } from '../../types';

interface JourneyPlannerProps {
  selectedCities: City[];
}

export default function JourneyPlanner({ selectedCities }: JourneyPlannerProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<'flight' | 'train' | 'bus'>('flight');
  const [startCity, setStartCity] = useState<City | null>(null);
  const [destinationCity, setDestinationCity] = useState<City | null>(null);

  const steps = [
    { number: 1, title: 'Route Planning', icon: Map },
    { number: 2, title: 'Dates', icon: Calendar },
    { number: 3, title: 'Transportation', icon: Plane },
    { number: 4, title: 'Accommodation', icon: Building2 }
  ];

  const transportOptions = [
    { id: 'flight', label: 'Flight', icon: Plane, price: 500 },
    { id: 'train', label: 'Train', icon: Train, price: 200 },
    { id: 'bus', label: 'Bus', icon: Bus, price: 100 }
  ];

  const accommodationTypes = [
    { type: 'hotel', name: 'Luxury Hotel', price: 150, rating: 4.8 },
    { type: 'airbnb', name: 'City Apartment', price: 80, rating: 4.5 },
    { type: 'hostel', name: 'Backpackers Hostel', price: 30, rating: 4.2 }
  ];

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= activeStep + 1) {
      setActiveStep(stepNumber);
    }
  };

  const handleNext = () => {
    if (activeStep === 4) {
      console.log('Journey planning completed!', {
        startCity,
        destinationCity,
        dates: { start: startDate, end: endDate },
        transport: selectedTransport
      });
      return;
    }
    setActiveStep(Math.min(4, activeStep + 1));
  };

  const handlePrevious = () => {
    setActiveStep(Math.max(1, activeStep - 1));
  };

  const handleCitySelection = (city: City, type: 'start' | 'destination') => {
    if (type === 'start') {
      if (destinationCity && destinationCity.id === city.id) return;
      setStartCity(city);
    } else {
      if (startCity && startCity.id === city.id) return;
      setDestinationCity(city);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Select Your Route</h3>

              {/* Start & Destination Selection */}
              <div className="flex flex-col space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Start City</h4>
                  <div className="flex overflow-x-scroll space-x-3 py-2 scrollbar-hide">
                    {selectedCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelection(city, 'start')}
                        className={`px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
                          startCity?.id === city.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                  {startCity && (
                    <p className="mt-2 text-blue-500 font-medium">
                      Selected Start: {startCity.name}, {startCity.country}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Destination City</h4>
                  <div className="flex overflow-x-scroll space-x-3 py-2 scrollbar-hide">
                    {selectedCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelection(city, 'destination')}
                        className={`px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
                          destinationCity?.id === city.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                  {destinationCity && (
                    <p className="mt-2 text-green-500 font-medium">
                      Selected Destination: {destinationCity.name}, {destinationCity.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Select Your Travel Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select end date"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          {steps.map(({ number, title, icon: Icon }) => (
            <button
              key={number}
              onClick={() => handleStepClick(number)}
              className={`flex flex-col items-center w-1/4 ${
                number <= activeStep + 1 ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  number <= activeStep 
                    ? 'bg-blue-500 text-white' 
                    : number === activeStep + 1
                    ? 'bg-gray-200 hover:bg-gray-300'
                    : 'bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-center">{title}</span>
            </button>
          ))}
        </div>
      </div>

      {renderStepContent()}

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 rounded-lg ${
            activeStep === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={activeStep === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
        >
          {activeStep === 4 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

