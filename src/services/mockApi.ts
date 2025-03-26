// Define UserProfile type to avoid circular dependencies
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  location?: string;
  occupation?: string;
  interests?: string;
  profilePicture?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// Mock user data stored in localStorage
const STORAGE_KEY = 'mock_user_profile';

// Default user profile
const defaultProfile: UserProfile = {
  id: '1',
  email: 'user@example.com',
  name: 'Digital Nomad',
  bio: '',
  location: '',
  occupation: '',
  interests: '',
  profilePicture: '',
  preferences: {
    theme: 'light',
    notifications: true,
  },
};

// Safe localStorage wrapper to handle potential errors
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
      return false;
    }
  }
};

// Initialize profile in localStorage if it doesn't exist
const initializeProfile = () => {
  if (!safeStorage.getItem(STORAGE_KEY)) {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
  }
};

// Mock API functions
export const mockApi = {
  // Get user profile
  getProfile: (): Promise<UserProfile> => {
    initializeProfile();
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedData = safeStorage.getItem(STORAGE_KEY);
        const profile = storedData ? JSON.parse(storedData) : defaultProfile;
        console.log("Retrieved profile from localStorage:", profile);
        resolve(profile);
      }, 300); // Simulate network delay
    });
  },

  // Update user profile
  updateProfile: (updatedProfile: Partial<UserProfile>): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedData = safeStorage.getItem(STORAGE_KEY);
        const currentProfile = storedData ? JSON.parse(storedData) : defaultProfile;
        
        // Ensure we're not losing preferences if they're not included in the update
        if (!updatedProfile.preferences && currentProfile.preferences) {
          updatedProfile.preferences = currentProfile.preferences;
        }
        
        const newProfile = { ...currentProfile, ...updatedProfile };
        
        const saveSuccess = safeStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
        console.log("Saved profile to localStorage:", newProfile, "Success:", saveSuccess);
        
        resolve(newProfile);
      }, 500); // Simulate network delay
    });
  },
};

export default mockApi; 