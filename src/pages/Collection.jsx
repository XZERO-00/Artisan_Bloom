import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, ArrowLeft, SearchX } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductSkeleton } from '../components/shop/ProductSkeleton';
import { Link, useLocation } from 'react-router-dom';

const mockProducts = [
  { id: 1, name: 'Ocean Blue Coaster Set', price: 45, image: 'https://picsum.photos/seed/resin1/500/500', category: 'resin', tags: ['blue', 'coaster', 'ocean', 'home'] },
  { id: 2, name: 'Geometric Display Tray', price: 68, image: 'https://picsum.photos/seed/resin2/500/500', category: 'resin', tags: ['geometric', 'tray', 'display', 'modern'] },
  { id: 3, name: 'Initial Keychains', price: 45, image: 'https://picsum.photos/seed/keychain/500/500', category: 'resin', tags: ['keychain', 'initial', 'personal', 'glitter'] },
  { id: 4, name: 'Decorite Wall Hanging', price: 60, image: 'https://picsum.photos/seed/wallart/500/500', category: 'lippan', tags: ['wall', 'hanging', 'decor', 'floral'] },
  { id: 5, name: 'Rose Bouquet', price: 55, image: 'https://picsum.photos/seed/bouquet1/500/500', category: 'bouquets', tags: ['rose', 'bouquet', 'floral', 'red'] },
  { id: 6, name: 'Dried Flower Bouquet', price: 40, image: 'https://picsum.photos/seed/bouquet2/500/500', category: 'bouquets', tags: ['dried', 'flower', 'rustic', 'boho'] },
  { id: 7, name: 'Custom 3D Figurine', price: 85, image: 'https://picsum.photos/seed/3dtoy/500/500', category: '3d-printing', tags: ['3d', 'figurine', 'custom', 'toy'] },
  { id: 8, name: 'Wooden LED Nameplate', price: 95, image: 'https://picsum.photos/seed/nameplate/500/500', category: 'nameplates', tags: ['wooden', 'led', 'nameplate', 'office'] },
];

export const Collection = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const rawSearchQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Simulate network fetch/delay for skeleton presentation
    return () => clearTimeout(timer);
  }, [rawSearchQuery, initialCategory]);

  const filteredProducts = useMemo(() => {
    let result = mockProducts;
    
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
    
    return result;
  }, [rawSearchQuery, initialCategory]);

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
          
          <div className="hidden lg:flex justify-end mb-6 space-x-3">
             {['Price', 'Color', 'Bestselling'].map(filter => (
                <button key={filter} className="flex items-center bg-surface px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-black/5 hover:bg-background transition-colors">
                  {filter} <ChevronDown className="w-4 h-4 ml-2 text-textLight" />
                </button>
             ))}
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
