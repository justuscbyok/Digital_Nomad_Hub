import React, { useState, useEffect } from 'react';
import { Map, Calendar, Bus, Plane, Train, Building2, Search, Clock, Banknote, Target, Star, Wifi, Coffee, Home, Zap, Snowflake } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { City } from '../../types';
import { 
  Flight, getMockFlights, 
  Train as TrainType, getMockTrains,
  Bus as BusType, getMockBuses,
  Accommodation, getMockAccommodations 
} from '../../services/mockTravelData';
import TransportSorter from './TransportSorter';

interface JourneyPlannerProps {
  cities: City[];
}

export default function JourneyPlanner({ cities }: JourneyPlannerProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<'flight' | 'train' | 'bus'>('flight');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<TrainType | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [startCity, setStartCity] = useState<City | null>(null);
  const [destinationCity, setDestinationCity] = useState<City | null>(null);
  const [startCitySearch, setStartCitySearch] = useState('');
  const [destCitySearch, setDestCitySearch] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [trains, setTrains] = useState<TrainType[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'stops'>('price');
  const [accommodationSortBy, setAccommodationSortBy] = useState<'price' | 'rating'>('price');
  const [accommodationFilter, setAccommodationFilter] = useState<'all' | 'hotel' | 'hostel' | 'apartment'>('all');

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

  // Filter cities based on search input
  const filteredStartCities = cities.filter(city => 
    city.name.toLowerCase().includes(startCitySearch.toLowerCase()) ||
    (city.country && city.country.toLowerCase().includes(startCitySearch.toLowerCase()))
  );

  const filteredDestCities = cities.filter(city => 
    city.name.toLowerCase().includes(destCitySearch.toLowerCase()) ||
    (city.country && city.country.toLowerCase().includes(destCitySearch.toLowerCase()))
  );

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= activeStep + 1) {
      setActiveStep(stepNumber);
    }
  };

  const handleNext = () => {
    if (activeStep === 4) {
      // Display summary in an alert
      const totalNights = getTotalNights();
      const transportCost = getTransportationPrice();
      const accommodationCost = selectedAccommodation ? (selectedAccommodation.pricePerNight * totalNights) : 0;
      const totalCost = transportCost + accommodationCost;
      
      alert(
        `Trip Summary:\n\n` +
        `Route: ${startCity?.name} → ${destinationCity?.name}\n` +
        `Dates: ${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()} (${totalNights} nights)\n\n` +
        `Transportation: ${getTransportationName()} - $${transportCost}\n` +
        `Accommodation: ${selectedAccommodation?.name} - $${accommodationCost}\n\n` +
        `Total Cost: $${totalCost}`
      );
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

  // Handle selection of transportation options
  const handleTransportSelection = (type: 'flight' | 'train' | 'bus', id: string) => {
    if (type === 'flight') {
      const flight = flights.find(f => f.id === id) || null;
      setSelectedFlight(flight);
      setSelectedTrain(null);
      setSelectedBus(null);
    } else if (type === 'train') {
      const train = trains.find(t => t.id === id) || null;
      setSelectedTrain(train);
      setSelectedFlight(null);
      setSelectedBus(null);
    } else if (type === 'bus') {
      const bus = buses.find(b => b.id === id) || null;
      setSelectedBus(bus);
      setSelectedFlight(null);
      setSelectedTrain(null);
    }
  };

  // Load mock flights when cities and dates are selected
  useEffect(() => {
    if (startCity && destinationCity && startDate) {
      const mockFlights = getMockFlights(startCity, destinationCity, startDate);
      setFlights(mockFlights);
      
      // Reset selected options when cities or dates change
      setSelectedFlight(null);
      setSelectedTrain(null);
      setSelectedBus(null);
    }
  }, [startCity, destinationCity, startDate]);

  // Load mock trains when cities and dates are selected
  useEffect(() => {
    if (startCity && destinationCity && startDate) {
      const mockTrains = getMockTrains(startCity, destinationCity, startDate);
      setTrains(mockTrains);
    }
  }, [startCity, destinationCity, startDate]);

  // Load mock buses when cities and dates are selected
  useEffect(() => {
    if (startCity && destinationCity && startDate) {
      const mockBuses = getMockBuses(startCity, destinationCity, startDate);
      setBuses(mockBuses);
    }
  }, [startCity, destinationCity, startDate]);

  // Load mock accommodations when destination city and dates are selected
  useEffect(() => {
    if (destinationCity && startDate && endDate) {
      const mockAccommodations = getMockAccommodations(destinationCity, startDate, endDate);
      setAccommodations(mockAccommodations);
      
      // Reset selected accommodation when cities or dates change
      setSelectedAccommodation(null);
    }
  }, [destinationCity, startDate, endDate]);

  // Sort flights based on chosen criterion
  const getSortedFlights = () => {
    if (!flights.length) return [];
    
    switch (sortBy) {
      case 'price':
        return [...flights].sort((a, b) => a.price - b.price);
      case 'duration':
        return [...flights].sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]);
          const durationB = parseInt(b.duration.split('h')[0]);
          return durationA - durationB;
        });
      case 'stops':
        return [...flights].sort((a, b) => a.stops - b.stops);
      default:
        return flights;
    }
  };

  // Sort trains based on chosen criterion
  const getSortedTrains = () => {
    if (!trains.length) return [];
    
    switch (sortBy) {
      case 'price':
        return [...trains].sort((a, b) => a.price - b.price);
      case 'duration':
        return [...trains].sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]);
          const durationB = parseInt(b.duration.split('h')[0]);
          return durationA - durationB;
        });
      case 'stops':
        return [...trains].sort((a, b) => a.stops - b.stops);
      default:
        return trains;
    }
  };

  // Sort buses based on chosen criterion
  const getSortedBuses = () => {
    if (!buses.length) return [];
    
    switch (sortBy) {
      case 'price':
        return [...buses].sort((a, b) => a.price - b.price);
      case 'duration':
        return [...buses].sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]);
          const durationB = parseInt(b.duration.split('h')[0]);
          return durationA - durationB;
        });
      case 'stops':
        return [...buses].sort((a, b) => a.stops - b.stops);
      default:
        return buses;
    }
  };

  // Sort and filter accommodations
  const getFilteredAccommodations = () => {
    if (!accommodations.length) return [];
    
    // Filter by type if needed
    let filtered = accommodations;
    if (accommodationFilter !== 'all') {
      filtered = accommodations.filter(acc => acc.type === accommodationFilter);
    }
    
    // Sort by selected criterion
    switch (accommodationSortBy) {
      case 'price':
        return [...filtered].sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  };

  // Calculate total nights for accommodation
  const getTotalNights = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  // Get the selected transportation option, regardless of type
  const getSelectedTransportation = () => {
    if (selectedFlight) return selectedFlight;
    if (selectedTrain) return selectedTrain;
    if (selectedBus) return selectedBus;
    return null;
  };

  // Check if any transportation option is selected
  const hasSelectedTransportation = !!selectedFlight || !!selectedTrain || !!selectedBus;

  // Get the selected transportation price
  const getTransportationPrice = () => {
    if (selectedFlight) return selectedFlight.price;
    if (selectedTrain) return selectedTrain.price;
    if (selectedBus) return selectedBus.price;
    return 0;
  };

  // Get the selected transportation name
  const getTransportationName = () => {
    if (selectedFlight) return `${selectedFlight.airline} Flight ${selectedFlight.flightNumber}`;
    if (selectedTrain) return `${selectedTrain.trainCompany} Train ${selectedTrain.trainNumber} (${selectedTrain.class})`;
    if (selectedBus) return `${selectedBus.busCompany} Bus`;
    return '';
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
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={startCitySearch}
                      onChange={(e) => setStartCitySearch(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-2.5"
                      placeholder="Search cities..."
                    />
                  </div>
                  <div className="flex overflow-x-scroll space-x-3 py-2 scrollbar-hide">
                    {filteredStartCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelection(city, 'start')}
                        className={`px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
                          startCity?.id === city.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {city.name}, {city.country}
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
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={destCitySearch}
                      onChange={(e) => setDestCitySearch(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-2.5"
                      placeholder="Search cities..."
                    />
                  </div>
                  <div className="flex overflow-x-scroll space-x-3 py-2 scrollbar-hide">
                    {filteredDestCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelection(city, 'destination')}
                        className={`px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
                          destinationCity?.id === city.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {city.name}, {city.country}
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

      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Select Transportation</h3>
            
            {/* Route and Date Summary */}
            {startCity && destinationCity && (
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="font-medium">
                  {startCity.name} → {destinationCity.name}
                </p>
                <p className="text-sm text-gray-600">
                  {startDate?.toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Transport Type Tabs */}
            <div className="flex mb-6 border-b">
              <button
                onClick={() => setSelectedTransport('flight')}
                className={`px-4 py-2 mr-2 ${selectedTransport === 'flight' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
              >
                <Plane className="inline-block h-4 w-4 mr-1" />
                Flights
              </button>
              <button 
                onClick={() => setSelectedTransport('train')}
                className={`px-4 py-2 mr-2 ${selectedTransport === 'train' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
              >
                <Train className="inline-block h-4 w-4 mr-1" />
                Trains
              </button>
              <button 
                onClick={() => setSelectedTransport('bus')}
                className={`px-4 py-2 ${selectedTransport === 'bus' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
              >
                <Bus className="inline-block h-4 w-4 mr-1" />
                Buses
              </button>
            </div>
            
            {/* Sort Controls */}
            <TransportSorter 
              currentSort={sortBy} 
              onSortChange={(sort) => {
                console.log(`Sort changed to: ${sort}`);
                setSortBy(sort);
              }} 
            />

            {/* Flight List */}
            {selectedTransport === 'flight' && (
              <div className="space-y-4">
                {!startCity || !destinationCity ? (
                  <div className="text-center py-8 text-gray-500">
                    Please select your route and dates first
                  </div>
                ) : flights.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading flights...
                  </div>
                ) : (
                  getSortedFlights().map(flight => (
                    <div 
                      key={flight.id}
                      onClick={() => handleTransportSelection('flight', flight.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedFlight?.id === flight.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{flight.airline}</span>
                        <span className="font-bold text-lg">${flight.price}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <div>
                          <div className="text-lg font-medium">{flight.departureTime}</div>
                          <div className="text-sm text-gray-500">{flight.departureCity}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                          <div className="w-24 h-px bg-gray-300 relative">
                            {flight.stops > 0 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-medium">{flight.arrivalTime}</div>
                          <div className="text-sm text-gray-500">{flight.arrivalCity}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Flight {flight.flightNumber}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Train List */}
            {selectedTransport === 'train' && (
              <div className="space-y-4">
                {!startCity || !destinationCity ? (
                  <div className="text-center py-8 text-gray-500">
                    Please select your route and dates first
                  </div>
                ) : trains.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading trains...
                  </div>
                ) : (
                  getSortedTrains().map(train => (
                    <div 
                      key={train.id}
                      onClick={() => handleTransportSelection('train', train.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedTrain?.id === train.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{train.trainCompany}</span>
                        <span className="font-bold text-lg">${train.price}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <div>
                          <div className="text-lg font-medium">{train.departureTime}</div>
                          <div className="text-sm text-gray-500">{train.departureCity}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-gray-500 mb-1">{train.duration}</div>
                          <div className="w-24 h-px bg-gray-300 relative">
                            {train.stops > 0 && Array(train.stops).fill(0).map((_, i) => (
                              <div 
                                key={i}
                                className="absolute top-1/2 transform -translate-y-1/2 w-1 h-1 rounded-full bg-gray-400"
                                style={{ left: `${(i + 1) * 100 / (train.stops + 1)}%` }}
                              ></div>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {train.stops === 0 ? 'Direct' : `${train.stops} stop${train.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-medium">{train.arrivalTime}</div>
                          <div className="text-sm text-gray-500">{train.arrivalCity}</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <div className="text-gray-500">
                          Train {train.trainNumber}
                        </div>
                        <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                          {train.class} class
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Bus List */}
            {selectedTransport === 'bus' && (
              <div className="space-y-4">
                {!startCity || !destinationCity ? (
                  <div className="text-center py-8 text-gray-500">
                    Please select your route and dates first
                  </div>
                ) : buses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading buses...
                  </div>
                ) : (
                  getSortedBuses().map(bus => (
                    <div 
                      key={bus.id}
                      onClick={() => handleTransportSelection('bus', bus.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedBus?.id === bus.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{bus.busCompany}</span>
                        <span className="font-bold text-lg">${bus.price}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <div>
                          <div className="text-lg font-medium">{bus.departureTime}</div>
                          <div className="text-sm text-gray-500">{bus.departureCity}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-gray-500 mb-1">{bus.duration}</div>
                          <div className="w-24 h-px bg-gray-300 relative">
                            {bus.stops > 0 && Array(bus.stops).fill(0).map((_, i) => (
                              <div 
                                key={i}
                                className="absolute top-1/2 transform -translate-y-1/2 w-1 h-1 rounded-full bg-gray-400"
                                style={{ left: `${(i + 1) * 100 / (bus.stops + 1)}%` }}
                              ></div>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {bus.stops === 0 ? 'Direct' : `${bus.stops} stop${bus.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-medium">{bus.arrivalTime}</div>
                          <div className="text-sm text-gray-500">{bus.arrivalCity}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                        <div className="flex flex-wrap gap-1">
                          {bus.amenities.map((amenity, index) => (
                            <span key={index} className="inline-flex items-center bg-gray-100 text-xs px-2 py-0.5 rounded-full">
                              {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                              {amenity === 'Power Outlets' && <Zap className="h-3 w-3 mr-1" />}
                              {amenity === 'Air Conditioning' && <Snowflake className="h-3 w-3 mr-1" />}
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Select Accommodation</h3>
            
            {/* Destination and Date Summary */}
            {destinationCity && startDate && endDate && (
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="font-medium">
                  {destinationCity.name}, {destinationCity.country}
                </p>
                <p className="text-sm text-gray-600">
                  {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} 
                  ({getTotalNights()} nights)
                </p>
              </div>
            )}
            
            {/* Type Filters */}
            <div className="flex mb-6 border-b">
              <button
                onClick={() => setAccommodationFilter('all')}
                className={`px-4 py-2 mr-2 ${accommodationFilter === 'all' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
              >
                All Types
              </button>
              <button 
                onClick={() => setAccommodationFilter('hotel')}
                className={`px-4 py-2 mr-2 ${accommodationFilter === 'hotel' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
              >
                <Building2 className="inline-block h-4 w-4 mr-1" />
                Hotels
              </button>
              <button 
                onClick={() => setAccommodationFilter('hostel')}
                className={`px-4 py-2 mr-2 ${accommodationFilter === 'hostel' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
              >
                <Home className="inline-block h-4 w-4 mr-1" />
                Hostels
              </button>
              <button 
                onClick={() => setAccommodationFilter('apartment')}
                className={`px-4 py-2 mr-2 ${accommodationFilter === 'apartment' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
              >
                <Building2 className="inline-block h-4 w-4 mr-1" />
                Apartments
              </button>
            </div>
            
            {/* Sort Controls */}
            <div className="flex mb-4 justify-end space-x-2">
              <span className="text-sm text-gray-500 mr-2 self-center">Sort by:</span>
              <button 
                onClick={() => {
                  console.log('Sorting by price, current sortBy:', sortBy);
                  setSortBy('price');
                }}
                className={`text-xs px-3 py-1 rounded-full ${sortBy === 'price' ? 'bg-blue-500 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Banknote className="inline-block h-3 w-3 mr-1" />
                Price
              </button>
              <button 
                onClick={() => {
                  console.log('Sorting by duration, current sortBy:', sortBy);
                  setSortBy('duration');
                }}
                className={`text-xs px-3 py-1 rounded-full ${sortBy === 'duration' ? 'bg-blue-500 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Clock className="inline-block h-3 w-3 mr-1" />
                Duration
              </button>
              <button 
                onClick={() => {
                  console.log('Sorting by stops, current sortBy:', sortBy);
                  setSortBy('stops');
                }}
                className={`text-xs px-3 py-1 rounded-full ${sortBy === 'stops' ? 'bg-blue-500 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Target className="inline-block h-3 w-3 mr-1" />
                Stops
              </button>
            </div>

            {/* Accommodation List */}
            {accommodations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Loading accommodations...
              </div>
            ) : (
              getFilteredAccommodations().map(accommodation => (
                <div 
                  key={accommodation.id}
                  onClick={() => setSelectedAccommodation(accommodation)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedAccommodation?.id === accommodation.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{accommodation.name}</span>
                    <span className="font-bold text-lg">${accommodation.pricePerNight}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {accommodation.type === 'hotel' ? (
                      <>
                        <span className="mr-2">⭐</span>
                        {accommodation.rating.toFixed(1)}
                      </>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                        {accommodation.type}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Bar */}
      <div className="flex-grow">
        {renderStepContent()}
      </div>

      {/* Footer Bar */}
      <div className="flex-grow-0">
        <div className="flex justify-between items-center p-4">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          >
            {activeStep === 4 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}