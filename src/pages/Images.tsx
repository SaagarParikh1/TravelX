import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, Image as ImageIcon } from 'lucide-react';
import { useDestination } from '../context/DestinationContext';

interface Image {
  id: string;
  url: string;
  description: string;
}

interface ImageError {
  message: string;
}

const PEXELS_API_KEY = 'bdWRHidIPDmtRSXOhv1EWAfK0zLRUNXCTEbVLsiFFftvqVWDjq1Kgkf6';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

const Images = () => {
  const { destination, setDestination } = useDestination();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(destination);
  const [error, setError] = useState<string | null>(null);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    setDestination(newLocation);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${PEXELS_API_URL}?query=${location}&per_page=12`,
          {
            headers: {
              Authorization: PEXELS_API_KEY
            }
          }
        );
        
        const formattedImages = response.data.photos.map((img: any) => ({
          id: img.id.toString(),
          url: img.src.large,
          description: img.alt || 'Travel destination image'
        }));
        
        setImages(formattedImages);
      } catch (err) {
        const error = err as ImageError;
        setError(error?.message || 'Failed to load images. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-sky-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Location Images</h1>
          <p className="text-gray-600">Discover beautiful photos of {location}</p>
        </div>
        
        <div className="mb-12">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="Enter location..."
                className="w-full px-6 py-4 text-lg border-2 border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ImageIcon className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="group relative overflow-hidden rounded-2xl shadow-xl bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-500"
              >
                <img
                  src={image.url}
                  alt={image.description}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white text-lg font-medium">{image.description}</p>
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

export default Images;