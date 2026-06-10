import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { MyOrders } from './pages/MyOrders';
import { CustomerProfile } from './pages/profiles/CustomerProfile';
import { VendorProfile } from './pages/profiles/VendorProfile';
import { AdminProfile } from './pages/profiles/AdminProfile';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/layout/PageTransition';
import { Preloader } from './components/layout/Preloader';
import { useAuthStore } from './store/useAuthStore';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/collections" element={<PageTransition><Collection /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/orders" element={<PageTransition><MyOrders /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          {/* Role-based profile routes */}
          <Route path="/profile/customer" element={<PageTransition><CustomerProfile /></PageTransition>} />
          <Route path="/profile/vendor" element={<PageTransition><VendorProfile /></PageTransition>} />
          <Route path="/profile/admin" element={<PageTransition><AdminProfile /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isPreloading, setIsPreloading] = useState(true);
  const { isLoading: isAuthLoading, initAuthListener } = useAuthStore();

  // Boot Firebase auth state listener once on mount
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe?.();
  }, [initAuthListener]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isPreloading && <Preloader key="preloader" onComplete={() => setIsPreloading(false)} />}
      </AnimatePresence>
      
      {!isPreloading && (
        <Router>
          <Toaster position="bottom-right" />
          <AnimatedRoutes />
        </Router>
      )}
    </>
  );
}

export default App;
