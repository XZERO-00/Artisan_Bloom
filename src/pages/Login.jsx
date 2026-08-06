import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Store } from 'lucide-react';

export const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'customer' // 'customer' or 'vendor'
  });
  

  const login = useAuthStore(state => state.login);
  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        if (!formData.fullName) {
          toast.error('Please provide your full name.');
          setIsSubmitting(false);
          return;
        }
        await register(formData);
        const user = useAuthStore.getState().user;
        toast.success(`Account created successfully as a ${user.role}!`);
        navigate(`/profile/${user.role}`);
      } else {
        await login(formData.email, formData.password);
        const user = useAuthStore.getState().user;
        toast.success(`Welcome back, ${user.name}!`);
        navigate(`/profile/${user.role}`);
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first.');
      return;
    }
    try {
      await authService.resetPassword(formData.email);
      toast.success('Password reset link sent to your email.');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link.');
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-[2.5rem] shadow-sm border border-black/5">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-textMain mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-textLight text-sm">
            {mode === 'login' ? 'Sign in to your The CraftNest account.' : 'Join our community of makers and lovers of handmade crafts.'}
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
          
          {mode === 'signup' && (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-textLight" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  aria-label="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-black/5 rounded-xl pl-12 pr-4 py-3 text-sm text-textMain focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-textLight" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                aria-label="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-background border border-black/5 rounded-xl pl-12 pr-4 py-3 text-sm text-textMain focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-textLight" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                aria-label="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-background border border-black/5 rounded-xl pl-12 pr-4 py-3 text-sm text-textMain focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="pt-2">
              <p className="text-xs font-bold uppercase text-textLight mb-2 px-1">How will you use The CraftNest?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                  className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.role === 'customer' ? 'border-primary bg-primary/5 text-primary' : 'border-black/5 bg-background text-textLight hover:border-primary/30'}`}
                >
                  <span className="font-semibold text-sm">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'vendor' }))}
                  className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.role === 'vendor' ? 'border-primary bg-primary/5 text-primary' : 'border-black/5 bg-background text-textLight hover:border-primary/30'}`}
                >
                  <span className="font-semibold text-sm">Vendor / Maker</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-xs text-primary hover:text-primaryHover font-medium"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <Button 
            type="submit"
            variant="primary" 
            disabled={isSubmitting}
            className={`w-full !py-3.5 mt-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'bg-[#DFAA9D] hover:bg-[#DFAA9D]/90'}`}
          >
            {isSubmitting ? 'PLEASE WAIT...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </Button>
        </form>

        <div className="text-center text-sm text-textLight">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-primary font-bold hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
};
