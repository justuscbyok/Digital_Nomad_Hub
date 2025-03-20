import { City } from '../types';

// Define types for the mock data
export interface Flight {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  airline: string;
  price: number;
  stops: number;
  flightNumber: string;
}

export interface Train {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  trainCompany: string;
  price: number;
  stops: number;
  trainNumber: string;
  class: 'economy' | 'business' | 'first';
}

export interface Bus {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  busCompany: string;
  price: number;
  stops: number;
  amenities: string[];
}

export interface Accommodation {
  id: string;
  name: string;
  city: string;
  type: 'hotel' | 'hostel' | 'apartment';
  pricePerNight: number;
  rating: number;
  amenities: string[];
  imageUrl: string;
  address: string;
}

// Helper to generate random prices with some variability based on cities
const generatePrice = (base: number, city1: string, city2: string): number => {
  // Popular, expensive destinations have higher prices
  const expensiveCities = ['Tokyo', 'New York', 'London', 'Singapore', 'Paris'];
  let modifier = 1.0;
  
  if (expensiveCities.includes(city1) || expensiveCities.includes(city2)) {
    modifier += 0.5;
  }
  
  // Add some randomness (±20%)
  const randomFactor = 0.8 + (Math.random() * 0.4);
  return Math.round(base * modifier * randomFactor);
};

// Function to generate mock flights based on selected cities and dates
export const getMockFlights = (
  departureCity: City,
  arrivalCity: City,
  departureDate: Date
): Flight[] => {
  const airlines = ['SkyWings', 'Global Air', 'Ocean Pacific', 'Atlas Airways', 'Northern Flights'];
  const flights: Flight[] = [];
  
  // Generate 5-8 flight options
  const numFlights = 5 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numFlights; i++) {
    // Generate departure time (between 6 AM and 10 PM)
    const depHour = 6 + Math.floor(Math.random() * 16);
    const depMinute = Math.floor(Math.random() * 60);
    const formattedDepHour = depHour.toString().padStart(2, '0');
    const formattedDepMinute = depMinute.toString().padStart(2, '0');
    
    // Duration between 1.5 hours and 15 hours depending on randomness
    const durationHours = 1 + Math.floor(Math.random() * 14);
    const durationMinutes = Math.floor(Math.random() * 60);
    
    // Calculate arrival time
    let arrHour = (depHour + durationHours) % 24;
    let arrMinute = (depMinute + durationMinutes) % 60;
    let daysLater = 0;
    
    if (depHour + durationHours >= 24) {
      daysLater = Math.floor((depHour + durationHours) / 24);
    }
    
    const formattedArrHour = arrHour.toString().padStart(2, '0');
    const formattedArrMinute = arrMinute.toString().padStart(2, '0');
    
    const daysLaterText = daysLater > 0 ? ` (+${daysLater})` : '';
    
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const stops = Math.random() > 0.6 ? Math.floor(Math.random() * 2) + 1 : 0;
    const basePrice = 200 + (durationHours * 50) - (stops * 30);
    const price = generatePrice(basePrice, departureCity.name, arrivalCity.name);
    
    flights.push({
      id: `FL-${i + 1000}`,
      departureCity: departureCity.name,
      arrivalCity: arrivalCity.name,
      departureTime: `${formattedDepHour}:${formattedDepMinute}`,
      arrivalTime: `${formattedArrHour}:${formattedArrMinute}${daysLaterText}`,
      duration: `${durationHours}h ${durationMinutes}m`,
      airline,
      price,
      stops,
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${1000 + Math.floor(Math.random() * 9000)}`
    });
  }
  
  // Sort by price (lowest first)
  return flights.sort((a, b) => a.price - b.price);
};

// Function to generate mock trains based on selected cities and dates
export const getMockTrains = (
  departureCity: City,
  arrivalCity: City,
  departureDate: Date
): Train[] => {
  const trainCompanies = ['EuroRail', 'Express Transit', 'Velocity Rail', 'Continental Railways', 'Metro Connect'];
  const trainClasses: ('economy' | 'business' | 'first')[] = ['economy', 'business', 'first'];
  const trains: Train[] = [];
  
  // Generate 4-7 train options
  const numTrains = 4 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numTrains; i++) {
    // Generate departure time (between 5 AM and 11 PM)
    const depHour = 5 + Math.floor(Math.random() * 18);
    const depMinute = Math.floor(Math.random() * 60);
    const formattedDepHour = depHour.toString().padStart(2, '0');
    const formattedDepMinute = depMinute.toString().padStart(2, '0');
    
    // Trains are typically faster than buses but slower than flights for the same route
    // Duration between 1 and 8 hours depending on randomness
    const durationHours = 1 + Math.floor(Math.random() * 7);
    const durationMinutes = Math.floor(Math.random() * 60);
    
    // Calculate arrival time
    let arrHour = (depHour + durationHours) % 24;
    let arrMinute = (depMinute + durationMinutes) % 60;
    let daysLater = 0;
    
    if (depHour + durationHours >= 24) {
      daysLater = Math.floor((depHour + durationHours) / 24);
    }
    
    const formattedArrHour = arrHour.toString().padStart(2, '0');
    const formattedArrMinute = arrMinute.toString().padStart(2, '0');
    
    const daysLaterText = daysLater > 0 ? ` (+${daysLater})` : '';
    
    const trainCompany = trainCompanies[Math.floor(Math.random() * trainCompanies.length)];
    const stops = Math.floor(Math.random() * 4); // 0-3 stops
    const trainClass = trainClasses[Math.floor(Math.random() * trainClasses.length)];
    
    // Base price calculations - first class is more expensive, business is middle, economy is cheaper
    let classMultiplier = 1;
    if (trainClass === 'business') classMultiplier = 1.5;
    if (trainClass === 'first') classMultiplier = 2;
    
    const basePrice = 80 + (durationHours * 25) - (stops * 5);
    const price = Math.round(generatePrice(basePrice, departureCity.name, arrivalCity.name) * classMultiplier);
    
    trains.push({
      id: `TR-${i + 1000}`,
      departureCity: departureCity.name,
      arrivalCity: arrivalCity.name,
      departureTime: `${formattedDepHour}:${formattedDepMinute}`,
      arrivalTime: `${formattedArrHour}:${formattedArrMinute}${daysLaterText}`,
      duration: `${durationHours}h ${durationMinutes}m`,
      trainCompany,
      price,
      stops,
      trainNumber: `${trainCompany.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`,
      class: trainClass
    });
  }
  
  // Sort by price (lowest first)
  return trains.sort((a, b) => a.price - b.price);
};

// Function to generate mock buses based on selected cities and dates
export const getMockBuses = (
  departureCity: City,
  arrivalCity: City,
  departureDate: Date
): Bus[] => {
  const busCompanies = ['GreyDog', 'Continental Express', 'EuroCoach', 'InterCity Bus', 'TransNational'];
  const possibleAmenities = ['WiFi', 'Power Outlets', 'Reclining Seats', 'Restroom', 'Snacks', 'Entertainment System', 'Extra Legroom', 'Air Conditioning'];
  const buses: Bus[] = [];
  
  // Generate 3-6 bus options
  const numBuses = 3 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numBuses; i++) {
    // Generate departure time (between 4 AM and 10 PM)
    const depHour = 4 + Math.floor(Math.random() * 18);
    const depMinute = Math.floor(Math.random() * 60);
    const formattedDepHour = depHour.toString().padStart(2, '0');
    const formattedDepMinute = depMinute.toString().padStart(2, '0');
    
    // Buses are typically slower than trains and flights
    // Duration between 2 and 12 hours depending on randomness
    const durationHours = 2 + Math.floor(Math.random() * 10);
    const durationMinutes = Math.floor(Math.random() * 60);
    
    // Calculate arrival time
    let arrHour = (depHour + durationHours) % 24;
    let arrMinute = (depMinute + durationMinutes) % 60;
    let daysLater = 0;
    
    if (depHour + durationHours >= 24) {
      daysLater = Math.floor((depHour + durationHours) / 24);
    }
    
    const formattedArrHour = arrHour.toString().padStart(2, '0');
    const formattedArrMinute = arrMinute.toString().padStart(2, '0');
    
    const daysLaterText = daysLater > 0 ? ` (+${daysLater})` : '';
    
    const busCompany = busCompanies[Math.floor(Math.random() * busCompanies.length)];
    const stops = Math.floor(Math.random() * 5); // 0-4 stops
    
    // Select 2-5 random amenities
    const numAmenities = 2 + Math.floor(Math.random() * 4);
    const amenities = [...possibleAmenities]
      .sort(() => 0.5 - Math.random())
      .slice(0, numAmenities);
    
    // Buses are generally cheaper than trains and flights
    const basePrice = 30 + (durationHours * 10) - (stops * 2);
    const price = generatePrice(basePrice, departureCity.name, arrivalCity.name);
    
    buses.push({
      id: `BU-${i + 1000}`,
      departureCity: departureCity.name,
      arrivalCity: arrivalCity.name,
      departureTime: `${formattedDepHour}:${formattedDepMinute}`,
      arrivalTime: `${formattedArrHour}:${formattedArrMinute}${daysLaterText}`,
      duration: `${durationHours}h ${durationMinutes}m`,
      busCompany,
      price,
      stops,
      amenities
    });
  }
  
  // Sort by price (lowest first)
  return buses.sort((a, b) => a.price - b.price);
};

// Function to generate mock accommodations based on destination city and dates
export const getMockAccommodations = (
  city: City,
  checkInDate: Date,
  checkOutDate: Date
): Accommodation[] => {
  const accommodationTypes: ('hotel' | 'hostel' | 'apartment')[] = ['hotel', 'hostel', 'apartment'];
  const hotelPrefixes = ['Grand', 'Royal', 'City', 'Central', 'Park', 'Harbor', 'Ocean', 'Golden', 'Imperial'];
  const hotelSuffixes = ['Hotel', 'Resort', 'Inn', 'Suites', 'Lodge', 'Palace', 'Plaza'];
  const hostelNames = ['Backpackers Haven', 'Wanderers Hostel', 'Nomad House', 'Global Hostel', 'Travelers Rest'];
  const apartmentNames = ['Modern Downtown Apartment', 'City Center Suites', 'Luxury Loft', 'Urban Apartments', 'Executive Suites'];
  
  const hotelAmenities = ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', 'Bar', 'Airport Shuttle', 'Breakfast included'];
  const hostelAmenities = ['Free WiFi', 'Shared Kitchen', 'Laundry', 'Common Room', 'Breakfast included', 'Lockers', 'Bike Rental'];
  const apartmentAmenities = ['Free WiFi', 'Kitchen', 'Washing Machine', 'Air Conditioning', 'TV', 'Balcony', 'Parking'];
  
  const accommodations: Accommodation[] = [];
  
  // Generate 10-15 accommodation options
  const numAccommodations = 10 + Math.floor(Math.random() * 6);
  
  for (let i = 0; i < numAccommodations; i++) {
    const type = accommodationTypes[Math.floor(Math.random() * accommodationTypes.length)];
    let name = '';
    let priceBase = 0;
    let amenities: string[] = [];
    
    switch (type) {
      case 'hotel':
        name = `${hotelPrefixes[Math.floor(Math.random() * hotelPrefixes.length)]} ${hotelSuffixes[Math.floor(Math.random() * hotelSuffixes.length)]}`;
        priceBase = 100;
        // Select 4-6 random amenities
        amenities = [...hotelAmenities].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 3));
        break;
      
      case 'hostel':
        name = hostelNames[Math.floor(Math.random() * hostelNames.length)];
        priceBase = 30;
        amenities = [...hostelAmenities].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3));
        break;
      
      case 'apartment':
        name = apartmentNames[Math.floor(Math.random() * apartmentNames.length)];
        priceBase = 80;
        amenities = [...apartmentAmenities].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3));
        break;
    }
    
    const rating = (3 + Math.random() * 2).toFixed(1);
    const pricePerNight = generatePrice(priceBase, city.name, '');
    
    accommodations.push({
      id: `ACC-${i + 1000}`,
      name,
      city: city.name,
      type,
      pricePerNight,
      rating: parseFloat(rating),
      amenities,
      imageUrl: `https://placehold.co/600x400?text=${name.replace(' ', '+')}`,
      address: `${Math.floor(Math.random() * 200) + 1} ${city.name} Street, ${city.country}`
    });
  }
  
  // Sort by price (lowest first)
  return accommodations.sort((a, b) => a.pricePerNight - b.pricePerNight);
}; 