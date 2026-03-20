import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { user } = useAuthStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('visa');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    
    // Simulate network request for payment processing
    const paymentPromise = new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Capture form data
    const formData = new FormData(e.target);
    const orderData = {
      userEmail: user?.email || 'guest@example.com',
      items: [...cart],
      total: total,
      paymentMethod: formData.get('payment'),
      shipping: {
        name: formData.get('fullName'),
        address: formData.get('address'),
        city: formData.get('city'),
        zipCode: formData.get('zipCode'),
        phone: formData.get('phone')
      }
    };

    toast.promise(paymentPromise, {
      loading: 'Processing payment securely...',
      success: () => {
        addOrder(orderData);
        clearCart();
        setIsProcessing(false);
        setTimeout(() => navigate(user ? '/orders' : '/'), 1000);
        return 'Payment successful! Order confirmed.';
      },
      error: 'Payment failed. Please try again.',
    }, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Checkout Header */}
      <motion.div 
        className="flex justify-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-serif font-bold text-textMain tracking-wide uppercase">Checkout</h1>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Order Details Preview */}
        <motion.div 
          className="lg:w-[45%] order-2 lg:order-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-serif font-bold text-textMain mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-surface p-3 rounded-2xl shadow-sm border border-black/5">
                <img src={item.image} alt={item.name} loading="lazy" className="w-16 h-16 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-textMain uppercase tracking-wide">{item.name}</h3>
                  <p className="text-xs text-textLight">Qty {item.quantity}</p>
                </div>
                <div className="font-semibold text-textMain text-sm">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-surface p-6 rounded-3xl shadow-sm border border-black/5">
             <div className="flex justify-between items-center mb-3 text-textMain text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center mb-4 text-textMain text-sm border-b border-black/5 pb-4">
                <span>Shipping</span>
                <span className="font-semibold">₹{shipping.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center text-lg font-serif text-textMain font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
             </div>
          </div>
        </motion.div>

        {/* Checkout Forms */}
        <motion.div 
          className="lg:w-[55%] order-1 lg:order-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
            <form onSubmit={handleCheckout} className="bg-surface p-6 lg:p-8 rounded-[2rem] shadow-sm border border-black/5">
              <h2 className="text-2xl font-serif font-bold text-textMain mb-6">Place Order</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2">Address</label>
                  <input type="text" name="fullName" required placeholder="FULL NAME" className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 mb-3 min-h-[44px]" />
                  <input type="text" name="address" required placeholder="SHIPPING ADDRESS" className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 mb-3 min-h-[44px]" />
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <input type="text" name="city" required placeholder="CITY" className="w-full sm:w-2/3 bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 min-h-[44px]" />
                    <input type="text" name="zipCode" required pattern="[0-9]{5}" title="Five digit zip code" placeholder="ZIP CODE" className="w-full sm:w-1/3 bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 min-h-[44px]" />
                  </div>
                  <input type="tel" name="phone" required pattern="[0-9]{10}" title="Ten digit phone number" placeholder="PHONE NUMBER (10 digits)" className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 min-h-[44px]" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2">Payment</label>
                  
                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <label className={`flex flex-col items-center justify-center gap-1 border ${paymentMethod === 'visa' ? 'border-primary ring-1 ring-primary' : 'border-primary/30'} rounded-xl p-3 cursor-pointer bg-background hover:border-primary transition-all min-h-[50px]`}>
                      <input type="radio" name="payment" value="visa" checked={paymentMethod === 'visa'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <span className="font-bold italic text-blue-800 text-sm">VISA</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center gap-1 border ${paymentMethod === 'upi' ? 'border-primary ring-1 ring-primary' : 'border-primary/30'} rounded-xl p-3 cursor-pointer bg-background hover:border-primary transition-all min-h-[50px]`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <span className="font-bold text-[#FF7A00] text-sm tracking-wide">UPI</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center gap-1 border ${paymentMethod === 'gpay' ? 'border-primary ring-1 ring-primary' : 'border-primary/30'} rounded-xl p-3 cursor-pointer bg-background hover:border-primary transition-all min-h-[50px]`}>
                      <input type="radio" name="payment" value="gpay" checked={paymentMethod === 'gpay'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <span className="font-bold text-gray-700 text-sm">GPay</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center gap-1 border ${paymentMethod === 'cod' ? 'border-primary ring-1 ring-primary' : 'border-primary/30'} rounded-xl p-3 cursor-pointer bg-background hover:border-primary transition-all min-h-[50px]`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      <span className="font-bold text-green-700 text-sm">COD</span>
                    </label>
                  </div>
                  
                  {/* Dynamic Payment Details */}
                  <div className="min-h-[60px]">
                    {paymentMethod === 'visa' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col sm:flex-row gap-3 transition-opacity duration-300 overflow-hidden"
                      >
                        <input type="text" required pattern="[0-9]{16}" title="16 digit card number" placeholder="CARD NUMBER" className="w-full sm:w-1/2 bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 min-h-[44px]" />
                        <div className="flex gap-3 w-full sm:w-1/2">
                          <input type="text" required pattern="(0[1-9]|1[0-2])\/[0-9]{2}" title="MM/YY format" placeholder="MM/YY" className="w-1/2 bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 min-h-[44px]" />
                          <input type="text" required pattern="[0-9]{3,4}" title="3 or 4 digit CVC" placeholder="CVC" className="w-1/2 bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 min-h-[44px]" />
                        </div>
                      </motion.div>
                    )}

                    {(paymentMethod === 'upi' || paymentMethod === 'gpay') && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col gap-3 transition-opacity duration-300 overflow-hidden"
                      >
                        <input type="text" name="upiId" required placeholder="Enter UPI ID (e.g. name@bank)" className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DFAA9D]/40 focus:border-[#DFAA9D] transition-all duration-300 min-h-[44px]" />
                      </motion.div>
                    )}

                    {paymentMethod === 'cod' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-sm text-textLight bg-surface border border-primary/20 rounded-xl px-4 py-3"
                      >
                        You will pay in cash when the order is delivered to your address.
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="primary" 
                    type="submit"
                    className={`w-full !py-4 text-sm tracking-wide shadow-md min-h-[50px] ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'bg-[#F47C62] hover:bg-[#F47C62]/90'}`}
                    disabled={cart.length === 0 || isProcessing}
                  >
                    {isProcessing ? 'PROCESSING...' : `PLACE ORDER & PAY ₹${total.toFixed(2)}`}
                  </Button>
                </div>
                
                <div className="mt-4 text-center">
                  <Link to="/cart" className="text-sm border-b border-textMain pb-0.5 hover:text-primary transition-colors">
                    Go Back to Cart
                  </Link>
                </div>

              </div>
            </form>
        </motion.div>

      </div>
    </div>
  );
};
