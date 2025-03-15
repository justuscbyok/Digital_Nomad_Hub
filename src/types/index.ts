export interface City {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  metrics: {
    climate: ClimateMetrics;
    cost: CostMetrics;
    infrastructure: InfrastructureMetrics;
    qualityOfLife: QualityOfLifeMetrics;
    digitalNomad: DigitalNomadMetrics;
  };
}

interface ClimateMetrics {
  averageTemperature: number;
  precipitation: number;
  seasons: string[];
}

interface CostMetrics {
  housing: number;
  food: number;
  transportation: number;
  entertainment: number;
  costOfLivingIndex: number;
}

interface InfrastructureMetrics {
  averageWifiSpeed: number;
  coworkingSpaces: number;
}

interface QualityOfLifeMetrics {
  healthcareIndex: number;
  safetyIndex: number;
  pollutionIndex: number;
}

interface DigitalNomadMetrics {
  communitySize: number;
  monthlyMeetups: number;
  visaRequirements: string;
}

export interface TravelPlan {
  id: string;
  cities: City[];
  dateRange: {
    start: Date;
    end: Date;
  };
  transportation: TransportationOption[];
  accommodation: AccommodationOption[];
  budget: Budget;
}

interface TransportationOption {
  type: 'flight' | 'train' | 'bus';
  from: string;
  to: string;
  price: number;
  duration: number;
}

interface AccommodationOption {
  type: 'hotel' | 'airbnb' | 'hostel';
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
}

interface Budget {
  total: number;
  transportation: number;
  accommodation: number;
  activities: number;
  food: number;
  misc: number;
}