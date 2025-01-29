import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Calendar, Clock, Star, Loader, Compass } from 'lucide-react';
import { useDestination } from '../context/DestinationContext';

interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  rating: number;
  price: string;
}

interface ActivityError {
  message: string;
}

const Activities = () => {
  const { destination, setDestination } = useDestination();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(destination);
  const [error, setError] = useState<string | null>(null);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setDestination(newCity);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulated API response for demonstration
        const mockActivities: Activity[] = [
          {
            id: '1',
            name: 'City Walking Tour',
            description: 'Explore the historic city center with a knowledgeable guide.',
            location: 'City Center',
            duration: '2 hours',
            rating: 4.8,
            price: '$25'
          },
          {
            id: '2',
            name: 'Food Tasting Experience',
            description: 'Sample local delicacies and learn about the culinary culture.',
            location: 'Local Market',
            duration: '3 hours',
            rating: 4.9,
            price: '$45'
          },
          {
            id: '3',
            name: 'Museum Visit',
            description: 'Discover art and history at the city\'s premier museum.',
            location: 'Arts District',
            duration: '4 hours',
            rating: 4.7,
            price: '$15'
          }
        ];
        
        setActivities(mockActivities);
      } catch (err) {
        const error = err as ActivityError;
        setError(error?.message || 'Failed to load activities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [city]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Things to Do</h1>
          <p className="text-gray-600">Discover amazing activities in {city}</p>
        </div>
        
        <div className="mb-12">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-6 py-4 text-lg border-2 border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Compass className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{activity.name}</h3>
                  <p className="text-gray-600 mb-6 text-lg">{activity.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-emerald-500" />
                      <span className="text-lg">{activity.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-3 text-emerald-500" />
                      <span className="text-lg">{activity.duration}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Star className="h-5 w-5 mr-3 text-yellow-500" />
                      <span className="text-lg">{activity.rating} / 5.0</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between items-center">
                    <span className="text-2xl font-bold text-emerald-500">{activity.price}</span>
                    <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;