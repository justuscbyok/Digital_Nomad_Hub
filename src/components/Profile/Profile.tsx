import React, { useState, useEffect } from 'react';
import { User, Star, Share2, AlertCircle, Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProfile } from '../../store/slices/profileSlice';
import ProfileEdit from './ProfileEdit';
import Reviews from './Reviews';

export default function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleSectionClick = (label: string) => {
    if (label === 'Profile') {
      setIsEditModalOpen(true);
    } else {
      setSelectedSection(label);
    }
  };

  const renderSelectedSection = () => {
    if (!selectedSection) return null;

    switch(selectedSection) {
      case 'Reviews':
        return <Reviews onClose={() => setSelectedSection(null)} />;
      // Implement other sections as needed
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedSection}</h2>
              <button 
                onClick={() => setSelectedSection(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <p className="text-gray-600">
              This feature is coming soon! Check back later for updates.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Show the section grid only if no section is selected */}
      {!selectedSection && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { icon: User, label: 'Profile', description: 'Manage your personal information and preferences' },
              { icon: Star, label: 'Reviews', description: 'View and manage your city reviews and ratings' },
              { icon: Share2, label: 'Share', description: 'Share your travel experiences and itineraries' },
              { icon: AlertCircle, label: 'Emergency Info', description: 'Access important emergency contacts and information' },
              { icon: Mail, label: 'Notifications', description: 'Manage your notification preferences' }
            ].map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSectionClick(label)}
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{label}</h3>
                <p className="text-sm text-gray-600 text-center">{description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show the selected section */}
      {renderSelectedSection()}

      {/* User Profile Summary Card - only show if no section is selected */}
      {profile && !selectedSection && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-medium">{profile.name}</h3>
              <p className="text-gray-500">{profile.email}</p>
              
              {profile.location && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Location:</span> {profile.location}
                </p>
              )}
              
              {profile.occupation && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Occupation:</span> {profile.occupation}
                </p>
              )}
              
              {profile.bio && (
                <div className="mt-3">
                  <p className="text-sm text-gray-700">{profile.bio}</p>
                </div>
              )}
              
              {profile.interests && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Interests:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.interests.split(',').map((interest, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                      >
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <ProfileEdit onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}