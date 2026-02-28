import React from 'react';
import { Slider } from '@/components/ui/slider.jsx';
import { Label } from '@/components/ui/label.jsx';

const FilterBar = ({ filters, onFilterChange }) => {
  const categories = ["All", "Men's Clothing", "Women's Clothing", "Accessories"];
  const ratings = [
    { label: "All Ratings", value: 0 },
    { label: "4+ Stars", value: 4 },
    { label: "3+ Stars", value: 3 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
      
      {/* Category Filter */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-3 block">Category</Label>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-3 block">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={500}
          step={10}
          value={filters.priceRange}
          onValueChange={(value) => onFilterChange({ ...filters, priceRange: value })}
          className="mt-2"
        />
      </div>

      {/* Rating Filter */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-3 block">Minimum Rating</Label>
        <div className="space-y-2">
          {ratings.map(rating => (
            <label key={rating.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating.value}
                checked={filters.minRating === rating.value}
                onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">{rating.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
