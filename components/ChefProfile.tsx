
import React, { useState, useMemo, useEffect } from 'react';
import { Chef, Menu, MenuRecommendation, User } from '../types';
import MenuDisplay from './MenuDisplay';

interface ChefProfileProps {
  chef: Chef;
  currentUser: User | null;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (e: React.MouseEvent, chef: Chef) => void;
  onBookMenu: (menu: Menu) => void;
  similarMenus: MenuRecommendation[];
  onUpdateChef?: (chef: Chef) => void;
}

const ChefProfile: React.FC<ChefProfileProps> = ({
  chef,
  currentUser,
  isFavorite,
  onBack,
  onToggleFavorite,
  onBookMenu,
  similarMenus,
  onUpdateChef
}) => {
  const [activeMenu, setActiveMenu] = useState<Menu>(chef.menus[0]);
  const isOwner = currentUser?.id === chef.id || currentUser?.role === 'ADMIN';

  useEffect(() => {
      // Ensure activeMenu is always valid, e.g., if chef data changes
      if (!chef.menus.find(m => m.id === activeMenu.id)) {
          setActiveMenu(chef.menus[0]);
      }
  }, [chef, activeMenu.id]);

  const handleUpdateMenu = (updatedMenu: Menu) => {
      if (!onUpdateChef) return;
      const updatedMenus = chef.menus.map(m => m.id === updatedMenu.id ? updatedMenu : m);
      onUpdateChef({ ...chef, menus: updatedMenus });
      // Also update the active menu state if it's the one being edited
      if(activeMenu.id === updatedMenu.id) {
          setActiveMenu(updatedMenu);
      }
  };

  return (
    <div className="pb-32 min-h-screen bg-white animate-in fade-in duration-300">
        <div className="relative h-72 md:h-96 w-full">
            <img src={chef.imageUrl} className="w-full h-full object-cover" alt="" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <button onClick={onBack} className="absolute top-6 left-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-gray-800 hover:bg-white z-20 transition-transform active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                <button onClick={(e) => onToggleFavorite(e, chef)} className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-gray-800 hover:bg-white transition-transform active:scale-90">
                    <svg className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-shadow-lg">{chef.name}</h1>
                <p className="text-lg font-medium mt-2 text-shadow max-w-2xl">{chef.tags.join(' • ')}</p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column - Chef Details */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50">
                        <p className="text-gray-600 leading-relaxed italic text-center">"{chef.bio}"</p>
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
                             <div className="flex flex-col">
                                <span className="text-2xl font-bold text-brand-dark">{chef.rating.toFixed(1)}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-brand-dark">{chef.yearsExperience}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Years</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-brand-dark">{chef.eventsCount}+</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Events</span>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50">
                        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">Specialisms</h3>
                        <div className="flex flex-wrap gap-2">
                            {chef.cuisines.map(c => (
                                <span key={c} className="px-3 py-1 bg-brand-light text-brand-dark rounded-full text-xs font-bold border border-brand-accent/50">{c}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Menus */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gray-50/70 rounded-3xl p-4 flex items-center gap-2 overflow-x-auto scrollbar-hide border border-gray-100">
                         {chef.menus.map(menu => (
                            <button
                                key={menu.id}
                                onClick={() => setActiveMenu(menu)}
                                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                                    activeMenu.id === menu.id 
                                    ? 'bg-white text-brand-dark shadow-lg' 
                                    : 'bg-transparent text-gray-500 hover:text-brand-dark'
                                }`}
                            >
                                {menu.name}
                            </button>
                         ))}
                    </div>
                    
                    <MenuDisplay
                        key={activeMenu.id} 
                        menu={activeMenu} 
                        onBook={() => onBookMenu(activeMenu)}
                        onUpdateMenu={isOwner ? handleUpdateMenu : undefined}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default ChefProfile;
