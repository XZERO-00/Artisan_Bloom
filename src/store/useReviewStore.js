import { create } from 'zustand';

// Pre-fill with some mock reviews for demo purposes
const initialReviews = {
  1: [
    { id: 'r1', user: 'Alice', rating: 5, comment: 'I love these coasters!', date: '2023-10-15T08:00:00Z' },
    { id: 'r2', user: 'Bob', rating: 4, comment: 'Very nice, but a bit small.', date: '2023-11-01T12:30:00Z' }
  ],
  2: [
    { id: 'r3', user: 'Charlie', rating: 5, comment: 'Perfect display piece.', date: '2024-01-20T14:15:00Z' }
  ]
};

export const useReviewStore = create((set, get) => ({
  reviewsByProduct: initialReviews,
  
  // Calculate average rating dynamically if needed (mostly mockProducts have initial but we can update)
  getProductReviews: (productId) => get().reviewsByProduct[productId] || [],
  
  addReview: (productId, reviewData) => set((state) => {
    const existingReviews = state.reviewsByProduct[productId] || [];
    const newReview = {
      id: `r${Date.now()}`,
      user: reviewData.user || 'Guest',
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString()
    };
    return {
      reviewsByProduct: {
        ...state.reviewsByProduct,
        [productId]: [newReview, ...existingReviews]
      }
    };
  })
}));
