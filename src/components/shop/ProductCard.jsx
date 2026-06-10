import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { ProductQuickView } from './ProductQuickView';
import { ChatWidget } from '../chat/ChatWidget';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { user, isAuthenticated } = useAuthStore();
  const { getOrCreateThread } = useChatStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatThreadId, setChatThreadId] = useState(null);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
      iconTheme: { primary: '#DFAA9D', secondary: '#fff' },
    });
  };

  const handleAskMaker = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role === 'vendor' || user?.role === 'admin') {
      toast.error('Only customers can message vendors.');
      return;
    }
    const vendorId = product.vendorId || 'vendor-001';
    const vendorName = product.vendorName || product.author || 'The Maker';
    const threadId = getOrCreateThread({
      customerId: user.id, customerName: user.name,
      vendorId, vendorName,
      productId: String(product.id), productName: product.name,
    });
    setChatThreadId(threadId);
    setIsChatOpen(true);
  };

  return (
    <motion.div 
      className="group flex flex-col items-center bg-transparent h-full cursor-pointer"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -10, rotateZ: 1, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-4 bg-background shadow-sm group-hover:shadow-[10px_15px_40px_rgba(0,0,0,0.12)] transition-shadow duration-500">
        <motion.img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
        
        {/* Hover Actions / Touch Actions on Mobile */}
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-100 lg:opacity-0 group-hover:opacity-100 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-400 ease-out flex flex-col lg:flex-row justify-center gap-2 bg-gradient-to-t from-black/20 to-transparent">
          <Button 
            variant="secondary" 
            className="w-full lg:w-auto min-h-[44px] flex items-center justify-center !py-1.5 !px-3 text-xs bg-surface/90 backdrop-blur"
            onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
          >
            QUICK VIEW
          </Button>
          <Button 
            variant="primary" 
            className="w-full lg:w-auto min-h-[44px] flex items-center justify-center !py-1.5 !px-3 text-xs bg-[#DFAA9D]/90 backdrop-blur hover:bg-[#DFAA9D]"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </Button>
          <Button
            variant="secondary"
            className="w-full lg:w-auto min-h-[44px] flex items-center justify-center !py-1.5 !px-3 text-xs bg-surface/90 backdrop-blur gap-1"
            onClick={handleAskMaker}
          >
            <MessageCircle className="w-3 h-3" /> ASK MAKER
          </Button>
        </div>
      </div>
      
      <div className="text-center w-full px-2 mt-auto">
        <h3 className="text-sm font-medium text-textMain uppercase tracking-wide truncate mb-1">{product.name}</h3>
        {(product.vendorName || product.author) && (
          <p className="text-xs text-textLight mb-1">By {product.vendorName || product.author}</p>
        )}
        {product.rating && (
          <div className="flex items-center justify-center mb-1 text-[#DFAA9D]">
            <Star className="w-3 h-3 block" fill="currentColor" />
            <span className="text-xs text-textMain ml-1 font-medium">{product.rating}</span>
            <span className="text-xs text-textLight ml-1">({product.reviewCount})</span>
          </div>
        )}
        <p className="text-sm font-semibold text-textMain">₹{product.price.toFixed(2)}</p>
      </div>
      <ProductQuickView product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialThreadId={chatThreadId} />
    </motion.div>
  );
};
