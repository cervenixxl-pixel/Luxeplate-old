
import React, { useState, useEffect } from 'react';
import { Chef, Menu, SearchParams, ViewState, User, Booking, MenuRecommendation } from './types';
import { db } from './services/databaseService';
import { getAIConciergeSuggestion, generateBookingConfirmation, getSimilarMenus } from './services/geminiService';
import { authService } from './services/authService';
import { sendConfirmationEmail } from './services/emailService';

import ChefCard from './components/ChefCard';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import ChefDashboard from './components/ChefDashboard';
import AdminLogin from './components/AdminLogin';
import ChefLogin from './components/ChefLogin';
import ChefProfile from './components/ChefProfile';
import BookingFlow from './components/BookingFlow';
import BookingSuccess from './components/BookingSuccess';
import Footer from './components/Footer';
import AIConcierge from './components/AIConcierge';

const App: React.FC = () => {
  // --- Global State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [chefLoginMode, setChefLoginMode] = useState(false);

  // --- Navigation State ---
  const [view, setView] = useState<ViewState>('HOME'); 
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'FAVORITES' | 'EVENTS' | 'PROFILE'>('EXPLORE');
  
  // --- Data State ---
  const [searchParams, setSearchParams] = useState<SearchParams>({ location: 'London', guests: 6, date: '' });
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [favoriteChefs, setFavoriteChefs] = useState<Chef[]>([]);
  const [myChefProfile, setMyChefProfile] = useState<Chef | null>(null);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [similarMenus, setSimilarMenus] = useState<MenuRecommendation[]>([]);
  
  // --- UI/Interaction State ---
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  
  const [bookingDetails, setBookingDetails] = useState({
      date: new Date(),
      time: '19:00',
      guests: 6
  });

  // --- Effects ---
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setCurrentUser(user);
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    loadInitialChefs();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role === 'CHEF') {
      const existingChef = db.getChefById(currentUser.id);
      if (existingChef) {
        setMyChefProfile(existingChef);
        setView('CHEF_DASHBOARD');
      }
    }
  }, [currentUser]);
  
   useEffect(() => {
    if (view === 'CHEF_PROFILE' && selectedChef && selectedMenu) {
        setLoading(true);
        getSimilarMenus(selectedChef.cuisines[0], selectedMenu.pricePerHead, selectedChef.name)
            .then(setSimilarMenus)
            .finally(() => setLoading(false));
    }
  }, [view, selectedChef, selectedMenu]);

  // --- Data Fetching & Handling ---
  const loadInitialChefs = async () => {
    setLoading(true);
    const results = db.getChefs();
    setChefs(results);
    setLoading(false);
  }

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearchParams(params);
    const results = db.searchChefs(params);
    setChefs(results);
    setLoading(false);
    setView('SEARCH_RESULTS');
  };

  const handleToggleFavorite = (e: React.MouseEvent, chef: Chef) => {
    e.stopPropagation();
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    const isFav = currentUser.favoriteChefIds.includes(chef.id);
    let newFavIds = isFav 
      ? currentUser.favoriteChefIds.filter(id => id !== chef.id)
      : [...currentUser.favoriteChefIds, chef.id];

    const updatedUser = { ...currentUser, favoriteChefIds: newFavIds };
    setCurrentUser(updatedUser);
    authService.updateCurrentUser(updatedUser);
    if (view === 'USER_PROFILE' && activeTab === 'FAVORITES') {
        setFavoriteChefs(db.getChefsByIds(newFavIds));
    }
  };

  const handleUpdateChefGeneric = (updatedChef: Chef) => {
    db.saveChef(updatedChef);
    if (selectedChef?.id === updatedChef.id) setSelectedChef(updatedChef);
    if (myChefProfile?.id === updatedChef.id) setMyChefProfile(updatedChef);
    setChefs(prev => prev.map(c => c.id === updatedChef.id ? updatedChef : c));
  };
  
  // --- Navigation & View Changers ---
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
    if (tab === 'EXPLORE') { setView('HOME'); return; }
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    if (tab === 'FAVORITES') setFavoriteChefs(db.getChefsByIds(currentUser.favoriteChefIds || []));
    setView('USER_PROFILE');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setMyChefProfile(null);
    setActiveTab('EXPLORE');
    setChefLoginMode(false);
    setView('HOME');
  };
  
  const handleSelectChef = (chef: Chef) => {
    setSelectedChef(chef);
    setSelectedMenu(chef.menus[0]); // Default to first menu
    setView('CHEF_PROFILE');
    window.scrollTo(0, 0);
  };
  
  const handleBookMenu = (chef: Chef, menu: Menu) => {
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    setSelectedChef(chef);
    setSelectedMenu(menu);
    setView('BOOKING_FLOW');
  };
  
  const handleBookingSuccess = async (booking: Booking) => {
    if (!currentUser) return;
    setLoading(true);
    db.createBooking(booking);
    const aiMessage = await generateBookingConfirmation(booking.chefName, booking.menuName, booking.guests, booking.date, booking.time);
    await sendConfirmationEmail(currentUser, booking, aiMessage);
    setLastBooking(booking);
    setLoading(false);
    setView('BOOKING_SUCCESS');
  };

  // --- Component Rendering ---
  
  const renderSearchResults = () => (
     <div id="chef-results" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-4xl font-serif font-bold text-gray-900">Available Talent</h2>
                <p className="text-gray-500 mt-2">Vetted professionals in {searchParams.location}</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {chefs.map(chef => (
                <ChefCard 
                    key={chef.id} 
                    chef={chef} 
                    onSelect={handleSelectChef} 
                    isFavorite={currentUser?.favoriteChefIds?.includes(chef.id)} 
                    onToggleFavorite={handleToggleFavorite} 
                />
            ))}
        </div>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'HOME':
        return (
          <>
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1550966841-391ad55a0006?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover brightness-[0.4]" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <span className="text-brand-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Michelin Standard Private Dining</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-10 leading-tight">Your Home,<br/>Our Professional Kitchen.</h1>
                    
                    <div className="flex flex-col gap-4">
                        <div className="bg-white/10 backdrop-blur-2xl p-2 rounded-3xl border border-white/20 shadow-2xl max-w-3xl mx-auto w-full">
                            <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchParams); }} className="flex flex-col md:flex-row gap-2 items-center">
                                <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full">
                                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <input type="text" value={searchParams.location} onChange={e => setSearchParams({...searchParams, location: e.target.value})} className="bg-transparent text-white focus:outline-none w-full text-sm font-medium placeholder:text-white/30" placeholder="e.g. London" />
                                </div>
                                <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full border-t md:border-t-0 md:border-l border-white/10">
                                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    <select value={searchParams.guests} onChange={e => setSearchParams({...searchParams, guests: parseInt(e.target.value)})} className="bg-transparent text-white focus:outline-none w-full text-sm font-medium">
                                        {[...Array(15)].map((_, i) => <option key={i} value={i+1} className="bg-brand-dark">{i+1} Guest{i > 0 ? 's' : ''}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="bg-brand-gold text-brand-dark px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all w-full md:w-auto">Search Chefs</button>
                            </form>
                        </div>
                        
                        <div className="flex justify-center">
                            <button 
                                onClick={() => setIsConciergeOpen(true)}
                                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-full text-white text-xs font-bold uppercase tracking-widest transition-all border border-white/10"
                            >
                                <span className="text-lg">✨</span>
                                Ask AI Concierge
                            </button>
                        </div>
                    </div>

                </div>
            </section>
            <div className="bg-white">{renderSearchResults()}</div>
            <Footer 
                onAdminClick={() => { window.scrollTo(0,0); setView('ADMIN_LOGIN'); }} 
                onChefClick={() => { window.scrollTo(0,0); setChefLoginMode(true); }} 
            />
          </>
        );
      case 'SEARCH_RESULTS': return <div className="pt-24">{renderSearchResults()}</div>;
      case 'CHEF_PROFILE':
        return selectedChef && (
          <div className="pt-20">
            <ChefProfile 
              chef={selectedChef} 
              currentUser={currentUser} 
              isFavorite={currentUser?.favoriteChefIds?.includes(selectedChef.id) || false}
              onBack={() => setView('SEARCH_RESULTS')} 
              onToggleFavorite={handleToggleFavorite} 
              onBookMenu={(menu) => handleBookMenu(selectedChef, menu)}
              similarMenus={similarMenus}
              onUpdateChef={handleUpdateChefGeneric}
            />
          </div>
        );
      case 'BOOKING_FLOW':
        return selectedChef && selectedMenu && (
            <BookingFlow
                chef={selectedChef}
                menu={selectedMenu}
                user={currentUser}
                onCancel={() => setView('CHEF_PROFILE')}
                onBookingSuccess={handleBookingSuccess}
            />
        );
       case 'BOOKING_SUCCESS':
         return lastBooking && <BookingSuccess booking={lastBooking} onDone={() => setView('HOME')} />;
      case 'USER_PROFILE':
        return currentUser && (
          <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
            <div className="flex items-center gap-4 mb-10">
                {(['BOOKINGS', 'FAVORITES', 'PROFILE'] as any[]).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm font-bold uppercase tracking-widest pb-2 ${activeTab === tab ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-gray-400'}`}>
                        {tab}
                    </button>
                ))}
            </div>
            {activeTab === 'FAVORITES' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {favoriteChefs.map(chef => <ChefCard key={chef.id} chef={chef} onSelect={handleSelectChef} isFavorite onToggleFavorite={handleToggleFavorite} />)}
                </div>
            )}
             {activeTab === 'PROFILE' && (
                <div className="bg-brand-light p-10 rounded-[3rem] border border-brand-accent flex flex-col md:flex-row items-center gap-10">
                  <img src={currentUser.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-xl" alt="" />
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-serif font-bold text-gray-900">{currentUser.name}</h2>
                    <p className="text-gray-500 mb-6">{currentUser.email}</p>
                    <div className="flex gap-4">
                      <button onClick={handleLogout} className="px-6 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest border border-red-100">Sign Out</button>
                      {currentUser.role === 'ADMIN' && <button onClick={() => setView('ADMIN')} className="px-6 py-2 bg-brand-dark text-white rounded-full text-xs font-bold uppercase tracking-widest">Admin Panel</button>}
                    </div>
                  </div>
                </div>
             )}
          </div>
        );
      default: return null;
    }
  };

  // --- SPECIAL VIEWS (ADMIN/CHEF) ---
  if (view === 'ADMIN') return <AdminDashboard onExit={() => setView('HOME')} />;
  if (view === 'ADMIN_LOGIN') return <AdminLogin onLoginSuccess={(u) => { setCurrentUser(u); setView('ADMIN'); }} onCancel={() => setView('HOME')} />;
  if (chefLoginMode && !currentUser) return <ChefLogin onLoginSuccess={(u) => { setCurrentUser(u); setChefLoginMode(false); }} onCancel={() => setChefLoginMode(false)} />;
  if (view === 'CHEF_DASHBOARD' && currentUser?.role === 'CHEF' && myChefProfile) {
    return <ChefDashboard chef={myChefProfile} onUpdateChef={handleUpdateChefGeneric} onExit={handleLogout} />;
  }

  return (
    <div className="min-h-screen font-sans text-brand-dark bg-white">
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled || !['HOME', 'CHEF_PROFILE'].includes(view) ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div onClick={() => setView('HOME')} className="flex items-center space-x-2 cursor-pointer">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold ${scrolled || !['HOME', 'CHEF_PROFILE'].includes(view) ? 'bg-brand-dark text-brand-gold' : 'bg-white text-brand-dark'}`}>L</div>
            <span className={`font-serif font-bold text-xl ${scrolled || !['HOME', 'CHEF_PROFILE'].includes(view) ? 'text-brand-dark' : 'text-white'}`}>LuxePlate</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {!currentUser && <button onClick={() => setChefLoginMode(true)} className={`text-sm font-bold uppercase tracking-widest hidden md:block ${scrolled || !['HOME', 'CHEF_PROFILE'].includes(view) ? 'text-gray-500' : 'text-white/80'}`}>Chef Portal</button>}
            {currentUser ? (
              <button onClick={() => { setActiveTab('PROFILE'); setView('USER_PROFILE'); }} className="flex items-center space-x-3 bg-gray-100 p-1 pr-4 rounded-full border border-gray-200">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                <span className="text-xs font-bold text-gray-800">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${scrolled || !['HOME', 'CHEF_PROFILE'].includes(view) ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark'}`}>Sign In</button>
            )}
          </div>
        </div>
      </header>

      <main className="transition-all duration-500">{renderContent()}</main>

      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-20 px-6 flex justify-around items-center z-[90] md:max-w-md md:mx-auto md:bottom-4 md:rounded-3xl md:shadow-2xl md:border-none transition-transform duration-500 ${view === 'BOOKING_FLOW' ? 'translate-y-full' : 'translate-y-0'}`}>
        <button onClick={() => handleTabChange('EXPLORE')} className={`flex flex-col items-center gap-1 ${activeTab === 'EXPLORE' ? 'text-brand-gold' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <span className="text-[10px] font-bold">Explore</span>
        </button>
        <button onClick={() => handleTabChange('FAVORITES')} className={`flex flex-col items-center gap-1 ${activeTab === 'FAVORITES' ? 'text-brand-gold' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span className="text-[10px] font-bold">Saved</span>
        </button>
        <button onClick={() => handleTabChange('EVENTS')} className={`flex flex-col items-center gap-1 ${activeTab === 'EVENTS' ? 'text-brand-gold' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span className="text-[10px] font-bold">Bookings</span>
        </button>
        <button onClick={() => handleTabChange('PROFILE')} className={`flex flex-col items-center gap-1 ${activeTab === 'PROFILE' ? 'text-brand-gold' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={setCurrentUser} />
      <AIConcierge 
        isOpen={isConciergeOpen} 
        onClose={() => setIsConciergeOpen(false)} 
        chefs={chefs}
        onSelectChef={handleSelectChef}
      />
      {loading && (
        <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default App;
