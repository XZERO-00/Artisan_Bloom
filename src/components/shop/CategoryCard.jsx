import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const CategoryCard = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="group cursor-pointer"
    >
      <Link 
        to={`/collections?category=${category.slug}`}
        className="block w-full"
      >
        <div className={`relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden mb-6 ${category.bgColor || 'bg-black/5'} transition-all duration-500 group-hover:shadow-soft`}>
          <img 
            src={category.image} 
            alt={category.title}
            loading="lazy"
            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
          />
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-2xl font-serif text-textMain mb-2 tracking-tight transition-colors duration-300">
            {category.title}
          </h3>
          <p className="text-sm text-textLight">
            {category.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
