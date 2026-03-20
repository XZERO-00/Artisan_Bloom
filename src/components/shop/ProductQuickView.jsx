import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { useReviewStore } from '../../store/useReviewStore';
import toast from 'react-hot-toast';

export const ProductQuickView = ({ product, isOpen, onClose }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { getProductReviews, addReview } = useReviewStore();
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', user: '' });
  
  if (!product) return null;

  const reviews = getProductReviews(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
      iconTheme: { primary: '#DFAA9D', secondary: '#fff' }
    });
    onClose();
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    addReview(product.id, newReview);
    setNewReview({ rating: 5, comment: '', user: '' });
    toast.success('Review added successfully!', {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col md:flex-row relative cursor-default"
            onClick={(e) => e.stopPropagation()} // Prevent card clicks from triggering
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-background/80 hover:bg-background rounded-full transition-colors border border-black/5">
              <X className="w-5 h-5" />
            </button>

            {/* Product Image */}
            <div className="md:w-1/2 h-64 md:h-auto bg-background rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none overflow-hidden shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Details and Reviews */}
            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[90vh] hide-scrollbar rounded-b-[2rem] md:rounded-r-[2rem] md:rounded-bl-none">
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">{product.category}</span>
                <h2 className="text-3xl font-serif font-bold text-textMain mb-2">{product.name}</h2>
                <p className="text-textLight mb-2">By <span className="font-semibold text-textMain">{product.author}</span></p>
                <div className="flex items-center mb-4">
                  <div className="flex text-[#DFAA9D] mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4" fill={product.rating >= star ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-sm text-textLight">({product.rating} average • {product.reviewCount + reviews.length} reviews)</span>
                </div>
                <p className="text-2xl font-semibold text-textMain mb-6">₹{product.price.toFixed(2)}</p>
                
                <Button variant="primary" className="w-full !py-4 text-sm tracking-wide bg-[#DFAA9D] hover:bg-[#DFAA9D]/80" onClick={handleAddToCart}>
                  ADD TO CART
                </Button>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-black/5 pt-6 mt-6">
                 <h3 className="text-xl font-serif font-bold text-textMain mb-4">Customer Reviews</h3>
                 
                 {/* Add Review Form */}
                 <form onSubmit={handleSubmitReview} className="mb-8 bg-background p-4 rounded-2xl border border-black/5">
                   <h4 className="text-sm font-bold uppercase tracking-wide mb-3">Write a Review</h4>
                   <div className="flex items-center mb-3">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <Star 
                         key={star} 
                         className={`w-5 h-5 cursor-pointer transition-colors ${newReview.rating >= star ? 'text-[#DFAA9D]' : 'text-gray-300'}`}
                         fill={newReview.rating >= star ? 'currentColor' : 'none'}
                         onClick={() => setNewReview({...newReview, rating: star})}
                       />
                     ))}
                   </div>
                   <input 
                     type="text" 
                     placeholder="Your Name (Optional)" 
                     value={newReview.user}
                     onChange={(e) => setNewReview({...newReview, user: e.target.value})}
                     className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-2 text-sm mb-3 focus:outline-none focus:border-primary"
                   />
                   <textarea 
                     placeholder="Tell us what you think..." 
                     required
                     value={newReview.comment}
                     onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                     className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm mb-3 min-h-[80px] focus:outline-none focus:border-primary resize-none"
                   />
                   <Button type="submit" variant="secondary" className="w-full !py-2 text-xs">SUBMIT REVIEW</Button>
                 </form>

                 {/* Reviews List */}
                 <div className="space-y-4">
                   {reviews.length === 0 ? (
                     <p className="text-sm text-textLight italic">No reviews yet. Be the first to review!</p>
                   ) : (
                     reviews.map((review) => (
                       <div key={review.id} className="bg-background p-4 rounded-2xl border border-black/5">
                         <div className="flex justify-between items-start mb-2">
                           <span className="font-semibold text-sm text-textMain">{review.user}</span>
                           <span className="text-xs text-textLight">{new Date(review.date).toLocaleDateString()}</span>
                         </div>
                         <div className="flex text-[#DFAA9D] mb-2">
                           {[1, 2, 3, 4, 5].map((star) => (
                             <Star key={star} className="w-3 h-3" fill={review.rating >= star ? 'currentColor' : 'none'} />
                           ))}
                         </div>
                         <p className="text-sm text-textLight">{review.comment}</p>
                       </div>
                     ))
                   )}
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
