import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui/Button';
import { Minus, Plus, Trash2 } from 'lucide-react';

export const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Cart Header */}
      <div className="flex justify-center mb-12">
        <h1 className="text-3xl font-serif font-bold text-textMain tracking-wide uppercase">Cart</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-serif font-bold text-textMain mb-6">Order Summary</h2>
          
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-3xl border border-primary/20">
              <p className="text-textLight mb-6 text-lg">Your cart is currently empty.</p>
              <Link to="/collections">
                <Button variant="primary">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-surface p-4 rounded-3xl shadow-sm border border-black/5"
                  >
                    <img src={item.image} alt={item.name} loading="lazy" className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-2xl" />
                    
                    <div className="flex-1 w-full">
                      <h3 className="text-lg font-medium text-textMain uppercase tracking-wide truncate">{item.name}</h3>
                      <p className="font-semibold text-textMain mt-1">₹{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start space-x-0 sm:space-x-4 mt-2 sm:mt-0">
                      <div className="flex items-center border border-primary/30 rounded-full px-2 py-1 bg-background">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-textLight hover:text-textMain transition-colors p-2 sm:p-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-2 font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-textLight hover:text-textMain transition-colors p-2 sm:p-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-textLight hover:text-red-500 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <div className="mt-8 bg-surface p-6 rounded-3xl shadow-sm border border-black/5">
                <p className="text-sm font-bold tracking-wide uppercase mb-3">Add a note to your gift</p>
                <textarea 
                  className="w-full bg-background border border-primary/30 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary resize-none h-24"
                  placeholder="Enter your personalized message here..."
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary & Actions */}
        <div className="lg:w-1/3">
           <div className="bg-surface p-8 rounded-[2rem] shadow-sm border border-black/5 sticky top-28">
              <div className="flex justify-between items-center mb-4 text-textMain">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-textMain border-b border-black/5 pb-6">
                <span className="font-medium">Shipping</span>
                <span className="font-semibold">{subtotal > 0 ? `₹${shipping.toFixed(2)}` : '—'}</span>
              </div>
              
              <div className="flex justify-between items-center mb-8 text-xl font-serif text-textMain font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="mb-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2">
                <input type="text" placeholder="Gift Cards or promo code" className="flex-1 bg-background border border-primary/30 rounded-full px-4 text-sm focus:outline-none focus:border-primary min-h-[44px]" />
                <Button variant="secondary" className="!px-6 min-h-[44px] w-full sm:w-auto">APPLY</Button>
              </div>

              <Button 
                variant="primary" 
                className="w-full !py-4 text-sm tracking-wide bg-[#DFAA9D] hover:bg-[#DFAA9D]/80"
                onClick={() => navigate('/checkout')}
                disabled={cart.length === 0}
              >
                PROCEED TO CHECKOUT
              </Button>
              
              <div className="mt-4 text-center">
                <Link to="/collections" className="text-sm border-b border-textMain pb-0.5 hover:text-primary transition-colors">
                  Go Back to Shop
                </Link>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
