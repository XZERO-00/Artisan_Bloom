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
      <section className="relative w-full overflow-hidden bg-background pt-4 md:pt-8 pb-10 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto relative h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden clip-path-curved shadow-soft">
          
          <img 
            src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1600&auto=format&fit=crop" 
            alt="Handmade Artisan Gifts" 
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F1E9E4] via-[#F1E9E4]/60 to-[#F1E9E4]/30"></div>
          
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto z-10">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9, rotate: -2, y: 40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-5xl md:text-5xl lg:text-7xl font-serif font-bold text-textMain mb-4 md:mb-6 leading-tight drop-shadow-sm"
            >
              Gifts that don't end up<br/>in the 're-gift' pile.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.2 }}
              className="text-lg md:text-xl text-textMain/90 mb-10 max-w-2xl font-medium drop-shadow-sm"
            >
              Personalized, handmade, and curated just for you. &hearts;
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.4 }}
            >
              <Link to="/collections">
                <Button className="!px-8 !py-4 text-lg bg-[#DFAA9D] hover:bg-[#DFAA9D]/80 hover:shadow-lg transition-shadow">
                  Browse the Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop by Vibe Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-textMain">Shop by Vibe</h2>
            <p className="mt-2 text-textLight">Find the perfect aesthetic for your loved ones.</p>
          </div>
          <Link to="/collections" className="hidden md:flex text-primary hover:text-primaryHover font-medium items-center transition-colors">
            View all categories &rarr;
          </Link>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
             visible: {
               transition: {
                 staggerChildren: 0.15
               }
             }
          }}
          className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, idx) => (
            <motion.div 
               key={category.id}
               variants={{
                 hidden: { opacity: 0, y: 30 },
                 visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
               }}
               className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center shrink-0"
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};
