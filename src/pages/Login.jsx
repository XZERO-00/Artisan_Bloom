import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authService.login(email, password);
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      login(response.user, response.token);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-[2.5rem] shadow-sm border border-black/5">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-textMain mb-2">Welcome Back</h1>
          <p className="text-textLight text-sm">Sign in to your Artisan Bloom account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-textMain">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@artisanbloom.com" 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-xs font-bold tracking-wide uppercase text-textMain">Password</label>
               <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primaryHover transition-colors">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********" 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <Button 
            variant="primary" 
            type="submit"
            disabled={isSubmitting}
            className={`w-full !py-3.5 mt-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'bg-[#DFAA9D] hover:bg-[#DFAA9D]/90'}`}
          >
            {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-textLight">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primaryHover border-b border-primary/30 transition-colors pb-0.5">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};
