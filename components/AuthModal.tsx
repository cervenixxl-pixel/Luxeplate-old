import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await authService.login(formData.email, formData.password);
      } else {
        user = await authService.register(formData.name, formData.email, formData.password);
      }
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-brand-dark p-6 text-center">
            <h3 className="text-2xl font-serif font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Join LuxePlate'}
            </h3>
            <p className="text-brand-gold text-sm mt-1">
                {isLogin ? 'Sign in to access your bookings' : 'Create an account to book chefs'}
            </p>
        </div>

        <div className="p-8">
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <input 
                            type="text"
                            required 
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                )}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input 
                        type="email"
                        required 
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                    <input 
                        type="password"
                        required 
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-black transition-colors mt-6 flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-brand-dark font-bold hover:underline"
                >
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
