import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { Link } from 'react-router-dom';
import { Package, Calendar, MapPin, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyOrders = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { orders, subscribeToUserOrders } = useOrderStore();

  // Subscribe to Firestore real-time orders for this user
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToUserOrders(user.uid);
    return unsub;
  }, [user?.uid, subscribeToUserOrders]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <Package className="w-16 h-16 text-textLight mb-4" strokeWidth={1} />
        <h2 className="text-2xl font-serif font-bold text-textMain mb-2">Please log in</h2>
        <p className="text-textLight mb-6">You must be logged in to view your order history.</p>
        <Link to="/login" className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-textMain tracking-wide mb-2">My Orders</h1>
        <p className="text-textLight">View and track your previous purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface p-12 rounded-[2rem] text-center shadow-sm border border-black/5">
          <Truck className="w-12 h-12 text-textLight mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-xl font-medium text-textMain mb-2">No orders yet</h3>
          <p className="text-textLight mb-6">Looks like you haven't placed an order yet.</p>
          <Link to="/collections">
            <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium">
              Browse Collection
            </button>
          </Link>
        </div>
      ) : (
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="bg-surface p-6 rounded-[2rem] shadow-sm border border-black/5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-black/5 pb-4 mb-4 gap-4">
                <div>
                  <div className="flex items-center text-sm text-textLight mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-sm font-medium text-textMain">
                    Order <span className="text-textLight">#{order.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex flex-col md:items-end text-sm">
                  <div className="font-bold text-textMain">Total: ₹{order.total?.toFixed(2)}</div>
                  <div className={`flex items-center mt-1 ${
                    order.status === 'Delivered' ? 'text-green-600' :
                    order.status === 'Shipped' ? 'text-blue-600' :
                    'text-amber-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      order.status === 'Delivered' ? 'bg-green-500' :
                      order.status === 'Shipped' ? 'bg-blue-500' :
                      'bg-amber-500'
                    }`} />
                    {order.status || 'Processing'}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" loading="lazy" />
                    <div className="flex-1">
                      <h4 className="font-medium text-textMain uppercase tracking-wide text-sm">{item.name}</h4>
                      {item.vendorName && <p className="text-xs text-textLight">By {item.vendorName}</p>}
                      <p className="text-xs text-textLight mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-semibold text-textMain text-sm">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-background rounded-2xl p-4 text-sm flex items-start text-textLight">
                  <MapPin className="w-4 h-4 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-textMain">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                    <p className="mt-0.5">📞 {order.shippingAddress.phone}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
