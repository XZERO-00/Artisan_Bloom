import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, ArrowLeft, SearchX, X } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductSkeleton } from '../components/shop/ProductSkeleton';
import { Link, useLocation } from 'react-router-dom';

const COLORS = [
  { name: 'All', value: null, hex: null },
  { name: 'Blue', value: 'blue', hex: '#93C5FD' },
  { name: 'Pink', value: 'pink', hex: '#F9A8D4' },
  { name: 'Green', value: 'green', hex: '#6EE7B7' },
  { name: 'White', value: 'white', hex: '#F3F4F6' },
  { name: 'Brown', value: 'brown', hex: '#A16207' },
  { name: 'Gold', value: 'gold', hex: '#FCD34D' },
];

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500+', min: 2500, max: Infinity },
];

const CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Resin Art', value: 'resin' },
  { label: 'Lippan Art', value: 'lippan' },
  { label: 'Bouquets', value: 'bouquets' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Scenery', value: 'scenery' },
  { label: 'Gift Hampers', value: 'hampers' },
  { label: 'Frames', value: 'frames' },
  { label: '3D Printing', value: '3d-printing' },
  { label: 'Nameplates', value: 'nameplates' },
  { label: 'Keychains', value: 'keychains' },
  { label: 'Wall Hangings', value: 'wall-hangings' },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-black/5 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full justify-between items-center text-left font-semibold text-sm text-textMain hover:text-primary transition-colors mb-2"
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-textLight" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Collection = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const location = useLocation();

  // Active filter state
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const rawSearchQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category');

  // Sync category from URL to state
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    else setSelectedCategory(null);
  }, [initialCategory]);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/products.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch(() => setIsLoading(false));
  }, [rawSearchQuery, initialCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search
    if (rawSearchQuery) {
      const q = rawSearchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags || []).some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Price range
    const priceRange = PRICE_RANGES[selectedPriceIdx];
    if (priceRange.min > 0 || priceRange.max !== Infinity) {
      result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    }

    // Color filter (check tags or a color field)
    if (selectedColor) {
      result = result.filter(p =>
        (p.tags || []).some(t => t.toLowerCase().includes(selectedColor)) ||
        (p.color || '').toLowerCase() === selectedColor
      );
    }

    // Bestsellers filter (rating >= 4.5)
    if (onlyBestsellers) {
      result = result.filter(p => p.rating >= 4.5);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'author-asc': result.sort((a, b) => (a.author || '').localeCompare(b.author || '')); break;
      case 'author-desc': result.sort((a, b) => (b.author || '').localeCompare(a.author || '')); break;
      case 'reviews-desc': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: result.sort((a, b) => a.id - b.id); break;
    }

    return result;
  }, [rawSearchQuery, selectedCategory, selectedPriceIdx, selectedColor, onlyBestsellers, sortBy, products]);

  const activeFilterCount = [
    selectedPriceIdx !== 0,
    selectedColor !== null,
    selectedCategory !== null && !initialCategory,
    onlyBestsellers,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedPriceIdx(0);
    setSelectedColor(null);
    setOnlyBestsellers(false);
    if (!initialCategory) setSelectedCategory(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-surface/50">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Link to="/" className="flex items-center text-sm font-medium text-textLight hover:text-textMain transition-colors bg-surface px-4 py-2 rounded-full shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> BACK
          </Link>
        </div>
        <div className="text-center md:flex-1">
          <h1 className="text-4xl font-serif font-bold text-textMain tracking-wide">
            {rawSearchQuery ? `Search: "${rawSearchQuery}"` : (initialCategory ? `${initialCategory.toUpperCase()} Collection` : 'All Collections')}
          </h1>
        </div>
        <div className="text-sm font-medium text-textLight">{filteredProducts.length} items</div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center bg-surface p-4 rounded-2xl shadow-sm">
          <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center font-medium gap-2">
            <SlidersHorizontal className="w-4 h-4" /> FILTER
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="text-xs text-primary flex items-center gap-1">
              <X className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>

        {/* Sidebar Filters */}
        <div className={`lg:w-1/4 ${filterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-surface/60 rounded-3xl p-6 shadow-sm border border-black/5 sticky top-28 backdrop-blur-md">
            {/* Filter Header */}
            <div className="mb-5 flex justify-between items-center border-b border-black/5 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-semibold tracking-wide text-sm">FILTERS</span>
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-medium">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Price Range */}
              <FilterSection title="Price Range">
                <div className="space-y-1 mt-2">
                  {PRICE_RANGES.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceIdx(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        selectedPriceIdx === idx
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-textLight hover:bg-background hover:text-textMain'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Category */}
              <FilterSection title="Category">
                <div className="space-y-1 mt-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.label}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        selectedCategory === cat.value
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-textLight hover:bg-background hover:text-textMain'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Color */}
              <FilterSection title="Color" defaultOpen={false}>
                <div className="flex flex-wrap gap-2 mt-3">
                  {COLORS.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.name}
                      className={`flex flex-col items-center gap-1 transition-all`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === color.value
                            ? 'border-primary scale-110 shadow-md'
                            : 'border-black/10 hover:border-primary/50'
                        }`}
                        style={{ backgroundColor: color.hex || '#E5E7EB' }}
                      />
                      <span className={`text-[0.6rem] font-medium ${selectedColor === color.value ? 'text-primary' : 'text-textLight'}`}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Bestselling */}
              <FilterSection title="Availability" defaultOpen={false}>
                <label className="flex items-center gap-3 mt-2 cursor-pointer group">
                  <div
                    onClick={() => setOnlyBestsellers(!onlyBestsellers)}
                    className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${
                      onlyBestsellers ? 'bg-primary' : 'bg-black/10'
                    }`}
                  >
                    <motion.div
                      animate={{ x: onlyBestsellers ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="w-4 h-4 bg-white rounded-full shadow absolute"
                    />
                  </div>
                  <span className="text-sm text-textMain group-hover:text-primary transition-colors">
                    ⭐ Bestsellers Only
                  </span>
                </label>
              </FilterSection>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          {/* Sort */}
          <div className="hidden lg:flex justify-end mb-6 space-x-3 items-center">
            <label htmlFor="sort-select" className="text-sm font-medium text-textLight mr-2">Sort By:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-black/5 hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
              style={{ backgroundImage: 'none' }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="author-asc">Author: A - Z</option>
              <option value="author-desc">Author: Z - A</option>
              <option value="reviews-desc">Highest Rated</option>
            </select>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 items-stretch">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <motion.div key="products"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 items-stretch"
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center">
                <SearchX className="w-16 h-16 text-textLight mb-4" strokeWidth={1} />
                <h2 className="text-2xl font-serif font-bold text-textMain mb-2">No products found</h2>
                <p className="text-textLight max-w-md">Nothing matches your current filters. Try clearing them to see all products.</p>
                <button onClick={resetFilters}
                  className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium">
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
