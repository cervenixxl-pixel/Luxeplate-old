import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authService.login(email, password);
      
      if (user.role !== 'ADMIN') {
        setError('Access Denied: You do not have administrator privileges.');
        setLoading(false);
        return;
      }

      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const useDemoCredentials = () => {
      setEmail('admin@luxeplate.com');
      setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 animate-in fade-in duration-500 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-gold opacity-[0.03] blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500 opacity-[0.03] blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner group">
                    <svg className="w-10 h-10 text-brand-gold group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Executive Portal</h2>
                <p className="text-gray-400 text-sm mt-3 uppercase tracking-[0.2em] font-medium">Internal Administration Only</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-start animate-in slide-in-from-top-2">
                    <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest ml-1">Email Terminal</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        </div>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                            placeholder="admin@luxeplate.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest ml-1">Access Key</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <input 
                            type="password" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-gold hover:bg-white text-brand-dark font-black py-4 rounded-2xl shadow-xl shadow-brand-gold/10 transition-all transform active:scale-[0.98] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin"></div>
                    ) : (
                        'Authenticate'
                    )}
                </button>
            </form>

            {/* Quick Access Helper */}
            <div className="mt-10 p-5 bg-white/5 border border-white/5 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Development Helper</p>
                <button 
                    onClick={useDemoCredentials}
                    className="text-brand-gold hover:text-white text-xs font-bold transition-colors underline underline-offset-4 decoration-1"
                >
                    Use Demo Credentials
                </button>
            </div>
        </div>

        <div className="mt-8 text-center">
            <button 
                onClick={onCancel}
                className="group inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors"
            >
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Return to Concierge
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;