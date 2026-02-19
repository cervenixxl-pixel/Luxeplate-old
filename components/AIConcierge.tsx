
import React, { useState } from 'react';
import { Chef } from '../types';
import { getAIConciergeSuggestion } from '../services/geminiService';

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  chefs: Chef[];
  onSelectChef: (chef: Chef) => void;
}

const AIConcierge: React.FC<AIConciergeProps> = ({ isOpen, onClose, chefs, onSelectChef }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Chef[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setHasSearched(false);
    
    // Create a mapping of names to chef objects for easy retrieval
    const chefMap = new Map(chefs.map(c => [c.name, c]));
    const chefNames = chefs.map(c => c.name);

    try {
      const suggestedNames = await getAIConciergeSuggestion(prompt, chefNames);
      
      const matchedChefs = suggestedNames
        .map(name => chefMap.get(name))
        .filter((c): c is Chef => !!c);

      setRecommendations(matchedChefs);
      setHasSearched(true);
    } catch (error) {
      console.error("AI Concierge error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-brand-dark p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-brand-gold/10 opacity-30"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
                     <span className="text-3xl">✨</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-white">AI Concierge</h2>
                <p className="text-brand-gold text-sm mt-2 uppercase tracking-widest font-bold">Your Personal Dining Curator</p>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto">
            {!hasSearched && !loading && (
                <div className="text-center mb-8">
                    <p className="text-gray-500 mb-6">Tell me about your dream event. Mention cuisine, vibe, occasion, or dietary needs.</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-400 border border-gray-100">"Japanese tasting menu for 6 in Soho"</span>
                        <span className="px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-400 border border-gray-100">"Romantic Italian dinner with wine pairing"</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSearch} className="relative mb-8">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your perfect menu..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pr-14 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all text-gray-800 placeholder:text-gray-400"
                />
                <button 
                    type="submit" 
                    disabled={loading || !prompt.trim()}
                    className="absolute bottom-4 right-4 p-2 bg-brand-dark text-white rounded-xl shadow-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    )}
                </button>
            </form>

            {loading && (
                <div className="text-center py-10 animate-pulse">
                    <div className="text-2xl mb-2">🤔</div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Analyzing your request...</p>
                </div>
            )}

            {hasSearched && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Top Recommendations</h3>
                    {recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {recommendations.map(chef => (
                                <div 
                                    key={chef.id} 
                                    onClick={() => { onSelectChef(chef); onClose(); }}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-brand-gold hover:shadow-lg transition-all cursor-pointer bg-white group"
                                >
                                    <img src={chef.imageUrl} className="w-14 h-14 rounded-xl object-cover" alt={chef.name} />
                                    <div>
                                        <h4 className="font-serif font-bold text-gray-900 group-hover:text-brand-dark">{chef.name}</h4>
                                        <p className="text-xs text-gray-500">{chef.cuisines.slice(0, 2).join(', ')}</p>
                                    </div>
                                    <div className="ml-auto">
                                         <svg className="w-5 h-5 text-gray-300 group-hover:text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 text-sm">No exact matches found. Try broadening your request.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;
