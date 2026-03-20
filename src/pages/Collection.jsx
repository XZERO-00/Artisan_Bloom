import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, ArrowLeft, SearchX } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductSkeleton } from '../components/shop/ProductSkeleton';
import { Link, useLocation } from 'react-router-dom';

export const Collection = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const rawSearchQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category');

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate an external API fetch to our JSON database
    fetch('/api/products.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        // Minimum delay to show off the skeleton loading state
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch(error => {
        console.error("Error fetching products from Faux API:", error);
        setIsLoading(false);
      });
      
  }, [rawSearchQuery, initialCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Process explicit category URLs
    if (initialCategory && initialCategory !== 'all') {
      result = result.filter(p => p.category === initialCategory);
    }
    
    // Process search strings across Name, Category, and Tags
    if (rawSearchQuery) {
        const q = rawSearchQuery.toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.category.toLowerCase().includes(q) ||
            p.tags.some(tag => tag.toLowerCase().includes(q))
        );
    }
    // Sorting logic
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'author-asc':
        result.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'author-desc':
        result.sort((a, b) => b.author.localeCompare(a.author));
        break;
      case 'reviews-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'featured' - maintain default order (by id)
        result.sort((a, b) => a.id - b.id);
        break;
    }
    
    return result;
  }, [rawSearchQuery, initialCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header and Top Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-surface/50">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Link to="/" className="flex items-center text-sm font-medium text-textLight hover:text-textMain transition-colors bg-surface px-4 py-2 rounded-full shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Link>
        </div>
        
        <div className="text-center md:flex-1">
          <h1 className="text-4xl font-serif font-bold text-textMain tracking-wide">
             {rawSearchQuery ? `Search: "${rawSearchQuery}"` : (initialCategory ? `${initialCategory.toUpperCase()} Collection` : 'All Collections')}
          </h1>
        </div>
        
        <div className="text-sm font-medium text-textLight">
          {filteredProducts.length} items
        </div>
      </div>

      {/* Main Layout (Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center bg-surface p-4 rounded-2xl shadow-sm">
          <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center font-medium">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> FILTER
          </button>
        </div>

        {/* Sidebar Filters */}
        <div className={`lg:w-1/4 ${filterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-surface/60 rounded-3xl p-6 shadow-sm border border-black/5 sticky top-28 backdrop-blur-md">
            <div className="mb-6 flex items-center border-b border-black/5 pb-4">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <span className="font-medium tracking-wide">FILTER</span>
            </div>
            
            <div className="space-y-6">
              {['Price', 'Color', 'Bestselling'].map((filter) => (
                <div key={filter} className="border-b border-black/5 pb-4">
                  <button className="flex w-full justify-between items-center text-left font-medium text-textMain hover:text-primary transition-colors">
                    {filter}
                    <ChevronDown className="w-4 h-4 text-textLight" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          
          <div className="hidden lg:flex justify-end mb-6 space-x-3 items-center">
             <label htmlFor="sort-select" className="text-sm font-medium text-textLight mr-2">Sort By:</label>
             <select 
               id="sort-select"
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="bg-surface px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-black/5 hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
               style={{ backgroundImage: 'none' }} // Hide default arrow as we might want a custom one, but standard is fine mostly
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
               <motion.div 
                 key="skeletons"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0, transition: { duration: 0.2 } }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 items-stretch"
               >
                 {[...Array(8)].map((_, i) => (
                   <ProductSkeleton key={`skeleton-${i}`} />
                 ))}
               </motion.div>
            ) : filteredProducts.length > 0 ? (
                <motion.div 
                  key="products"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 items-stretch"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.08 }
                    }
                  }}
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
              </motion.div>
            ) : (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center justify-center py-20 text-center"
               >
                   <SearchX className="w-16 h-16 text-textLight mb-4" strokeWidth={1} />
                   <h2 className="text-2xl font-serif font-bold text-textMain mb-2">No products found</h2>
                   <p className="text-textLight max-w-md">We couldn't find anything matching your current filters or search query. Try switching up your terms.</p>
                   <Link to="/collections">
                       <button className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primaryHover transition-colors font-medium">Clear Filters & Search</button>
                   </Link>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
