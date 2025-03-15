import React from 'react';
import { User, Star, Share2, AlertCircle, Mail } from 'lucide-react';

export default function Profile() {
  return (
    <div className="space-y-6">
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
    </div>
  );
}