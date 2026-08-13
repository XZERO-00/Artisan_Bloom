import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { CategoryCard } from '../components/shop/CategoryCard';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    title: 'The Resin Room',
    description: 'A pair of glistening, multi-colored coasters',
    image: '/category_resin.png',
    bgColor: 'bg-cardBeige',
    slug: 'resin'
  },
  {
    id: 2,
    title: 'The Lippan Studio',
    description: 'Round Lippan art piece with mirror details',
    image: '/category_lippan.png',
    bgColor: 'bg-cardDarkBeige',
    slug: 'lippan'
  },
  {
    id: 3,
    title: 'Blooms & Petals',
    description: 'A rustic bouquet in eco-friendly paper',
    image: '/category_bouquets.png',
    bgColor: 'bg-cardGreen',
    slug: 'bouquets'
  },
  {
    id: 4,
    title: 'Mind & Soul',
    description: 'Curated wellness gifts and candles',
    image: '/category_wellness.png',
    bgColor: 'bg-cardBrown',
    slug: 'wellness'
  }
];

export const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-8 flex flex-col items-center justify-center min-h-[75vh]">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-surface/50 text-textLight text-xs md:text-sm font-medium tracking-widest uppercase mb-8 backdrop-blur-sm shadow-minimal"
          >
            The Premier Artisan Marketplace
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-textMain mb-6 leading-[1.1] tracking-tight"
          >
            Discover Unique <br className="hidden md:block"/> Handcrafted Goods.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="text-lg md:text-xl text-textLight mb-10 max-w-2xl font-sans font-light"
          >
            A curated space empowering local makers. Shop personalized, artisanal gifts directly from the creators themselves.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/collections" className="w-full sm:w-auto">
              <Button className="w-full !px-8 !py-4 text-base sm:text-lg">
                Explore Collections
              </Button>
            </Link>
            <Link to="/community" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full !px-8 !py-4 text-base sm:text-lg">
                Meet the Artisans
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Curated Selections Section */}
      <section className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden border-t border-black/5 dark:border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col md:flex-row justify-between items-end mb-16"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-textMain tracking-tight">Curated Selections</h2>
            <p className="mt-4 text-lg text-textLight font-sans font-light">Explore our meticulously selected aesthetics to find the perfect addition to your home or the ideal gift for someone special.</p>
          </div>
          <Link to="/collections" className="hidden md:flex text-textMain hover:text-primary font-medium items-center transition-colors group">
            <span className="relative pb-1">
              View all collections
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-textMain group-hover:bg-primary transition-colors duration-300"></span>
            </span>
          </Link>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
             visible: {
               transition: {
                 staggerChildren: 0.1
               }
             }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>
        
        <div className="mt-10 md:hidden flex justify-center">
          <Link to="/collections" className="text-textMain font-medium pb-1 relative group">
             View all collections
             <span className="absolute bottom-0 left-0 w-full h-[1px] bg-textMain group-hover:bg-primary transition-colors duration-300"></span>
          </Link>
        </div>
      </section>
    </div>
  );
};
