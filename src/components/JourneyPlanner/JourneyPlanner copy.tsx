import React, { useState } from 'react';
import { Map, Calendar, Bus, Plane, Train, Building2, DollarSign, Import as Passport } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MapView from './MapView';
import { City } from '../../types';

interface JourneyPlannerProps {
  selectedCities: City[];
}

export default function JourneyPlanner({ selectedCities }: JourneyPlannerProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<'flight' | 'train' | 'bus'>('flight');
  const [budget, setBudget] = useState({
    transportation: 0,
    accommodation: 0,
    activities: 0,
    food: 0,
    misc: 0
  });

  const steps = [
    { number: 1, title: 'Route Planning', icon: Map },
    { number: 2, title: 'Dates', icon: Calendar },
    { number: 3, title: 'Transportation', icon: Plane },
    { number: 4, title: 'Accommodation', icon: Building2 },
    { number: 5, title: 'Budget', icon: DollarSign },
    { number: 6, title: 'Requirements', icon: Passport }
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
    if (activeStep === 6) {
      console.log('Journey planning completed!', {
        cities: selectedCities,
        dates: { start: startDate, end: endDate },
        transport: selectedTransport,
        budget
      });
      return;
    }
    setActiveStep(Math.min(6, activeStep + 1));
  };

  const handlePrevious = () => {
    setActiveStep(Math.max(1, activeStep - 1));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Selected Cities</h3>
              <div className="space-y-2">
                {selectedCities.map((city, index) => (
                  <div key={city.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
                      {index + 1}
                    </span>
                    <span className="ml-3 font-medium">{city.name}, {city.country}</span>
                  </div>
                ))}
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

      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Choose Transportation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {transportOptions.map(({ id, label, icon: Icon, price }) => (
                <button
                  key={id}
                  onClick={() => setSelectedTransport(id as any)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedTransport === id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-center">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-gray-500">from ${price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Find Accommodation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accommodationTypes.map((acc) => (
                <div key={acc.type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{acc.name}</h4>
                    <div className="flex items-center">
                      <span className="ml-1 text-sm">{acc.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">Starting from ${acc.price}/night</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Budget Calculator</h3>
            <div className="space-y-4">
              {Object.entries(budget).map(([category, amount]) => (
                <div key={category} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {category}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setBudget({ ...budget, [category]: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${category} budget`}
                  />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Budget:</span>
                  <span className="text-xl font-bold">
                    ${Object.values(budget).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Travel Requirements</h3>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">Visa Requirements</h4>
                {selectedCities.map((city) => (
                  <div key={city.id} className="flex items-center text-sm text-gray-600 mb-2">
                    <Passport className="w-4 h-4 mr-2" />
                    <span>{city.name}: {city.metrics.digitalNomad.visaRequirements}</span>
                  </div>
                ))}
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
              className={`flex flex-col items-center ${
                number < steps.length ? 'w-1/6' : ''
              } ${number <= activeStep + 1 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
              {number < steps.length && (
                <div
                  className={`h-1 w-full mt-2 transition-colors ${
                    number < activeStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {renderStepContent()}

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 rounded-lg ${
            activeStep === 1
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={activeStep === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className={`px-6 py-2 rounded-lg ${
            activeStep === 6
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {activeStep === 6 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}