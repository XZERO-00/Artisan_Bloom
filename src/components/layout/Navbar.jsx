import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Flower2, User, LogOut, Package } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cart = useCartStore((state) => state.cart);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname + location.search;
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Shop All', path: '/collections' },
    { name: 'Resin Art', path: '/collections?category=resin' },
    { name: 'Lippen Art', path: '/collections?category=lippan' },
    { name: 'Flower Bouquets', path: '/collections?category=bouquets' },
    { name: 'Landscape Paintings', path: '/collections?category=landscape' },
    { name: 'Scenery Paintings', path: '/collections?category=scenery' },
    { name: 'Gift Hampers', path: '/collections?category=hampers' },
    { name: 'Frames & Memory Gifts', path: '/collections?category=frames' },
    { name: '3D Printing', path: '/collections?category=3d' },
    { name: 'Nameplates', path: '/collections?category=nameplates' },
    { name: 'Keychains', path: '/collections?category=keychains' },
    { name: 'Wall Hangings', path: '/collections?category=wall-hangings' },
    { name: 'Community', path: '/community' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="h-20 w-full shrink-0"></div>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-md border-b-transparent' 
            : 'bg-background/80 backdrop-blur-sm border-b border-surface/50'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <Flower2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold leading-none tracking-wide text-textMain">THE CRAFT</span>
              <span className="font-serif text-[0.8rem] leading-none tracking-widest text-textLight">NEST</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div 
             className="hidden lg:flex flex-1 mx-4 overflow-x-auto pb-1 -mb-1 custom-scrollbar-hide"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="bg-surface/60 backdrop-blur rounded-full px-2 py-1 flex items-center shadow-sm border border-black/5 whitespace-nowrap min-w-max m-auto">
              {navLinks.map((link, idx) => {
                const isActive = currentPath === link.path || (link.path === '/collections' && location.pathname === '/collections' && location.search === '');
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive ? 'text-textMain' : 'text-textLight hover:text-textMain hover:bg-black/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/15 rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-4 shrink-0">
            
            {/* Search Input Toggle */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="absolute right-0 flex items-center w-[65vw] sm:w-[250px]"
                    style={{ originX: 1 }}
                  >
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface border border-primary/30 rounded-full px-4 py-2 pr-10 text-base sm:text-sm focus:outline-none focus:border-primary shadow-sm min-h-[44px]"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative z-10 text-textLight hover:text-textMain transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-transparent rounded-full hover:bg-surface"
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
            </div>

            <Link to="/cart" className="relative text-textLight hover:text-textMain transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-surface">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    key={cartItemCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="absolute top-1 right-1 translate-x-1/4 -translate-y-1/4 bg-[#DFAA9D] text-white text-[0.65rem] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            <div className="relative flex items-center">
              {!isAuthenticated ? (
                <Link to="/login">
                  <Button variant="secondary" className="!px-3 !py-1 text-xs sm:!px-4 sm:!py-1.5 sm:text-sm !rounded-full">
                    Login
                  </Button>
                </Link>
              ) : (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-surface p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-black/5"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="bg-[#DFAA9D] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-textMain hidden lg:block max-w-[100px] truncate">{user?.name}</span>
                </div>
              )}
              
              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && isAuthenticated && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-2xl shadow-md border border-black/5 overflow-hidden z-20"
                  >
                    <div className="px-4 py-3 border-b border-black/5 bg-background/50">
                      <p className="text-sm font-medium text-textMain truncate">{user?.name}</p>
                      <p className="text-xs text-textLight truncate">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-textMain hover:bg-background transition-colors flex items-center" onClick={() => { setIsProfileOpen(false); navigate('/orders'); }}>
                        <Package className="w-4 h-4 mr-2" /> My Orders
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-[#F47C62] hover:bg-background transition-colors flex items-center" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center p-1 rounded-full hover:bg-surface text-textLight hover:text-textMain ml-1 sm:ml-2">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
            />
            
            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-[340px] bg-background shadow-2xl z-[100] flex flex-col overflow-y-auto lg:hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-primary/20 bg-surface/50">
                <span className="font-serif font-bold text-lg text-textMain tracking-wide">MENU</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-textLight hover:text-textMain bg-transparent rounded-full hover:bg-surface transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = currentPath === link.path || (link.path === '/collections' && location.pathname === '/collections' && location.search === '');
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors border-b border-black/5 last:border-0 ${
                        isActive ? 'bg-primary/10 text-textMain font-bold' : 'text-textLight hover:bg-surface hover:text-textMain'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer / Auth */}
              <div className="mt-auto p-6 border-t border-primary/20 bg-surface/30">
                {!isAuthenticated ? (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center min-h-[48px] text-base">
                      Login / Register
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <div className="px-2 py-1 text-sm text-textLight flex items-center">
                       <User className="w-4 h-4 mr-2" /> Hello, {user?.name}
                    </div>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); navigate('/orders'); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-textMain hover:bg-surface border border-primary/20 transition-colors flex items-center min-h-[48px]"
                    >
                      <Package className="w-5 h-5 mr-3 text-primary" /> My Orders
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-white bg-[#F47C62] hover:bg-[#F47C62]/90 transition-colors flex items-center min-h-[48px] justify-center shadow-soft mt-2"
                    >
                      <LogOut className="w-5 h-5 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
    </>
  );
};
