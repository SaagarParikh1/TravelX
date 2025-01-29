import React from 'react';
import { Search } from 'lucide-react';
import { useDestination } from '../context/DestinationContext';
import travelImage from '../images/travel.png';

const Home = () => {
  const { destination, setDestination } = useDestination();
  const [searchQuery, setSearchQuery] = React.useState(destination);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setDestination(searchQuery.trim());
    }
  };

  return (
    <div className="relative h-screen">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center">
            the joy of <img src={travelImage} alt="TRAVEL" className="h-16 ml-4" />
          </h1>
          <p className="text-xl text-white">Discover your next adventure</p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a destination..."
              className="w-full px-6 py-4 text-lg rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;