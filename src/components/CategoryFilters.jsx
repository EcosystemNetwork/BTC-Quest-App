import React from 'react';

function CategoryFilters({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="category-filters">
      {categories.map(category => (
        <button
          key={category.id}
          className={`filter-button ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.icon} {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilters;
