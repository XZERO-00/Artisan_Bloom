import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (pwd) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return regex.test(pwd);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validations
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('Password must be at least 8 chars, contain 1 uppercase, 1 lowercase, and 1 number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.register(formData);
      toast.success(response.message);
      // Wait for toast then redirect
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-[2.5rem] shadow-sm border border-black/5">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-textMain mb-2">Create Account</h1>
          <p className="text-textLight text-sm">Join the Artisan Bloom community.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-textMain">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              required 
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jane Doe" 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-textMain">Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@artisanbloom.com" 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-textMain">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              required 
              pattern="[0-9]{10}"
              title="10 digit phone number"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567" 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
             <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-textMain">Password</label>
             <input 
              type="password" 
              name="password"
              required 
              value={formData.password}
              onChange={handleChange}
              placeholder="********" 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div>
             <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-textMain">Confirm Password</label>
             <input 
              type="password" 
              name="confirmPassword"
              required 
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********" 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <Button 
            variant="primary" 
            type="submit"
            disabled={isSubmitting}
            className={`w-full !py-3.5 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'bg-[#DFAA9D] hover:bg-[#DFAA9D]/90'}`}
          >
            {isSubmitting ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-textLight">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primaryHover border-b border-primary/30 transition-colors pb-0.5">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};
