import { City } from '../types';

export const mockCities: City[] = [
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
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    coordinates: { lat: 38.7223, lng: -9.1393 },
    metrics: {
      climate: {
        averageTemperature: 17,
        precipitation: 725,
        seasons: ['Spring', 'Summer', 'Fall', 'Winter']
      },
      cost: {
        housing: 1200,
        food: 500,
        transportation: 120,
        entertainment: 400,
        costOfLivingIndex: 70
      },
      infrastructure: {
        averageWifiSpeed: 75,
        coworkingSpaces: 60
      },
      qualityOfLife: {
        healthcareIndex: 85,
        safetyIndex: 85,
        pollutionIndex: 25
      },
      digitalNomad: {
        communitySize: 6000,
        monthlyMeetups: 35,
        visaRequirements: 'Digital nomad visa'
      }
    }
  },
  {
    id: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexico',
    coordinates: { lat: 19.4326, lng: -99.1332 },
    metrics: {
      climate: {
        averageTemperature: 19,
        precipitation: 850,
        seasons: ['Dry', 'Rainy']
      },
      cost: {
        housing: 900,
        food: 400,
        transportation: 100,
        entertainment: 300,
        costOfLivingIndex: 55
      },
      infrastructure: {
        averageWifiSpeed: 60,
        coworkingSpaces: 50
      },
      qualityOfLife: {
        healthcareIndex: 75,
        safetyIndex: 60,
        pollutionIndex: 45
      },
      digitalNomad: {
        communitySize: 4500,
        monthlyMeetups: 28,
        visaRequirements: 'Visa-free'
      }
    }
  }
];

