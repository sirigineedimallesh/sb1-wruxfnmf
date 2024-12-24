import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more"
          className="w-full py-2 px-4 pr-10 rounded-sm text-gray-900 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}