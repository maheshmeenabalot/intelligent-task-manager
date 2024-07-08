import React from 'react';

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  applyFilters // Function to apply filters
}) => {
  return (
    <div className='mb-6'>
      <div className='relative flex items-center w-full'>
        <input
          type='text'
          placeholder='Search tasks...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <div className='flex items-center space-x-2 px-2'>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='completed'>Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Priorities</option>
            <option value='low'>Low</option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
