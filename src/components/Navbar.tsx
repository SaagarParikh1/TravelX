import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useDestination } from '../context/DestinationContext';
import logo from '../images/travelx.png';

const Navbar = () => {
  const { destination } = useDestination();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={logo}
                alt="TravelX" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center">
            {destination && (
              <div className="flex items-center mr-8 px-4 py-2 bg-sky-50 rounded-lg border border-sky-100">
                <MapPin className="h-5 w-5 mr-2 text-sky-500" />
                <span className="font-medium text-sky-700">{destination}</span>
              </div>
            )}
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-sky-500 transition-all duration-300 font-medium hover:scale-105 transform">
                Main Page
              </Link>
              <Link to="/weather" className="text-gray-700 hover:text-sky-500 transition-all duration-300 font-medium hover:scale-105 transform">
                Weather Info
              </Link>
              <Link to="/images" className="text-gray-700 hover:text-sky-500 transition-all duration-300 font-medium hover:scale-105 transform">
                Images
              </Link>
              <Link to="/activities" className="text-gray-700 hover:text-sky-500 transition-all duration-300 font-medium hover:scale-105 transform">
                Activities
              </Link>
              <Link to="/questions" className="text-gray-700 hover:text-sky-500 transition-all duration-300 font-medium hover:scale-105 transform">
                Questions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;