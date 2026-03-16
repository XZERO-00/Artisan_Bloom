import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authService.resetPassword(email);
      toast.success(response.message);
      setIsSubmitted(true);
    } catch (error) {
      toast.success(error.message); // Say success anyway to prevent email enumeration
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-[2.5rem] shadow-sm border border-black/5">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-textMain mb-2">Reset Password</h1>
          <p className="text-textLight text-sm">
            {isSubmitted 
              ? "Check your email for a reset link." 
              : "Enter your email to receive a password reset link."}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleReset} className="space-y-5">
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

            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
              className={`w-full !py-3.5 mt-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'bg-[#DFAA9D] hover:bg-[#DFAA9D]/90'}`}
            >
              {isSubmitting ? 'SENDING LINK...' : 'SEND RESET LINK'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <Link to="/login">
                <Button variant="secondary" className="w-full !py-3.5">
                    Return to Login
                </Button>
            </Link>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-textLight">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primaryHover border-b border-primary/30 transition-colors pb-0.5">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};
