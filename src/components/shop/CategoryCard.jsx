import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link 
        to={`/collections?category=${category.slug}`}
        className={`group relative block w-full aspect-[4/5] rounded-[1.5rem] p-6 overflow-hidden shadow-soft transition-all duration-300 hover:shadow-md ${category.bgColor}`}
      >
        <div className="relative z-10 flex flex-col h-full">
          <div>
            <h3 className="text-xl font-serif font-semibold text-textMain mb-2 uppercase tracking-wide">
              {category.title}
            </h3>
            <p className="text-sm text-textMain/80 max-w-[80%]">
              {category.description}
            </p>
          </div>
          
          <div className="mt-auto self-end opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center space-x-1 text-sm font-medium text-textMain bg-surface/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="absolute inset-0 z-0">
          <img 
            src={category.image} 
            alt={category.title}
            loading="lazy"
            className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </Link>
    </motion.div>
  );
};
