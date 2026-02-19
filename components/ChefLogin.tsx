
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface ChefLoginProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
}

const ChefLogin: React.FC<ChefLoginProps> = ({ onLoginSuccess, onCancel }) => {
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
      if (user.role !== 'CHEF') {
        setError('This portal is strictly for registered chefs. Standard users please use the main app.');
        setLoading(false);
        return;
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-md space-y-10">
            <div className="text-center">
                <div className="w-20 h-20 bg-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L1 21h22L12 2zm0 3.45L20.21 19H3.79L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
                    </svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Chef Console</h2>
                <p className="text-gray-500 mt-2 font-medium">Manage your professional culinary identity.</p>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Professional Email</label>
                    <input 
                        type="email" 
                        required 
                        className="w-full border-b-2 border-gray-100 py-3 text-lg font-bold text-gray-900 focus:border-brand-dark outline-none transition-colors"
                        placeholder="chef@luxeplate.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Access Pin</label>
                    <input 
                        type="password" 
                        required 
                        className="w-full border-b-2 border-gray-100 py-3 text-lg font-bold text-gray-900 focus:border-brand-dark outline-none transition-colors"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    disabled={loading}
                    className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Open Console'}
                </button>
            </form>
            
            <button onClick={onCancel} className="w-full text-center text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-gray-600 transition-colors">Cancel Access</button>
        </div>
    </div>
  );
};

export default ChefLogin;
