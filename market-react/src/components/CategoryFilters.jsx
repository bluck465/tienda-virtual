export default function CategoryFilters({ categories, selected, onChange }) {
  return (
    <div id="category-filters" className="search-row">
      {categories.map(category => (
        <button
          key={category}
          className={`pill ${selected === category ? 'active' : ''}`}
          data-category={category}
          onClick={() => onChange(category)}
        >
          {category === 'all' ? 'Ver todo' : category}
        </button>
      ))}
    </div>
  );
}
