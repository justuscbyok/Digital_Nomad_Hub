import React from 'react';
import { Clock, Banknote, Target } from 'lucide-react';

type SortOption = 'price' | 'duration' | 'stops';

interface TransportSorterProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function TransportSorter({ currentSort, onSortChange }: TransportSorterProps) {
  const handleSortChange = (sort: SortOption) => {
    console.log(`Setting sort to: ${sort} (current: ${currentSort})`);
    onSortChange(sort);
  };

  return (
    <div className="flex mb-4 justify-end space-x-2">
      <span className="text-sm text-gray-500 mr-2 self-center">Sort by:</span>
      <button 
        onClick={() => handleSortChange('price')}
        className={`text-xs px-3 py-1 rounded-full ${currentSort === 'price' ? 'bg-blue-500 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <Banknote className="inline-block h-3 w-3 mr-1" />
        Price
      </button>
      <button 
        onClick={() => handleSortChange('duration')}
        className={`text-xs px-3 py-1 rounded-full ${currentSort === 'duration' ? 'bg-blue-500 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <Clock className="inline-block h-3 w-3 mr-1" />
        Duration
      </button>
      <button 
        onClick={() => handleSortChange('stops')}
        className={`text-xs px-3 py-1 rounded-full ${currentSort === 'stops' ? 'bg-blue-500 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <Target className="inline-block h-3 w-3 mr-1" />
        Stops
      </button>
    </div>
  );
} 