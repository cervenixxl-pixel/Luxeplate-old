
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/databaseService';
import { Booking, Chef, JobPosting, Contract, User } from '../types';

type AdminTab = 'OVERVIEW' | 'BOOKINGS' | 'CHEFS' | 'USERS' | 'PAYOUTS' | 'MARKETING' | 'RECRUITMENT' | 'SEO_SEARCH' | 'SETTINGS';

const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data State
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allChefs, setAllChefs] = useState<Chef[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allJobs, setAllJobs] = useState<JobPosting[]>([]);
  
  // SEO State
  const [metaTitle, setMetaTitle] = useState('LuxePlate | Private Chef Experiences');
  const [metaDescription, setMetaDescription] = useState('Book world-class private chefs for your home. Michelin standard dining experiences starting from £40pp.');

  useEffect(() => {
    setAllBookings(db.getBookings());
    // FIX: Corrected method call from getCachedChefs to getChefs
    setAllChefs(db.getChefs());
    setAllUsers(db.getUsers());
    setAllJobs(db.getJobs());
  }, []);

  const NAV_ITEMS = [
    { id: 'OVERVIEW', label: 'Overview', icon: '📊' },
    { id: 'BOOKINGS', label: 'Bookings', icon: '📅' },
    { id: 'CHEFS', label: 'Chefs', icon: '👨‍🍳' },
    { id: 'USERS', label: 'Users', icon: '👥' },
    { id: 'PAYOUTS', label: 'Payouts', icon: '💰' },
    { id: 'MARKETING', label: 'Marketing', icon: '📣' },
    { id: 'RECRUITMENT', label: 'Recruitment', icon: '🤝' },
    { id: 'SEO_SEARCH', label: 'SEO & Search', icon: '🔍' },
    { id: 'SETTINGS', label: 'Settings', icon: '⚙️' },
  ];

  // --- MODULES ---

  const OverviewModule = () => {
    const stats = useMemo(() => {
        const totalRevenue = allBookings.reduce((acc, b) => acc + b.totalPrice, 0);
        const confirmed = allBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
        return { totalRevenue, confirmed, activeChefs: allChefs.length };
    }, [allBookings, allChefs]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header>
                <h2 className="text-5xl font-serif font-bold text-gray-900 leading-tight">Platform Command</h2>
                <p className="text-gray-500 mt-2">Executive snapshot of the LuxePlate ecosystem.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total GMV</p>
                    <div className="text-4xl font-serif font-bold text-gray-900">£{stats.totalRevenue.toLocaleString()}</div>
                    <div className="mt-4 flex items-center text-xs font-bold text-green-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        +8.2% vs prev. month
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Completed Events</p>
                    <div className="text-4xl font-serif font-bold text-gray-900">{stats.confirmed}</div>
                    <p className="mt-4 text-xs text-brand-gold font-bold uppercase tracking-tight">Top Performance Tier</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Global Chefs</p>
                    <div className="text-4xl font-serif font-bold text-gray-900">{stats.activeChefs}</div>
                    <p className="mt-4 text-xs text-gray-400 font-medium italic">Verified Vetted Talent</p>
                </div>
            </div>

            <div className="bg-brand-dark rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <h3 className="text-2xl font-serif font-bold mb-6 text-brand-gold">Operations Health</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Escrow Hold</p>
                        <p className="text-xl font-bold">£{(stats.totalRevenue * 0.4).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Platform Take</p>
                        <p className="text-xl font-bold">12%</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Tickets</p>
                        <p className="text-xl font-bold">0</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Server Uptime</p>
                        <p className="text-xl font-bold text-green-400">99.98%</p>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const BookingsModule = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-end">
            <div>
                <h2 className="text-5xl font-serif font-bold text-gray-900">Event Ledger</h2>
                <p className="text-gray-500 mt-2">Comprehensive tracking of all global reservations.</p>
            </div>
            <button className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">Download Audit</button>
        </header>
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl">
            <table className="w-full text-left">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Detail</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Talent</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Investment</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {allBookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50/30 transition-colors">
                            <td className="p-6">
                                <div className="font-bold text-gray-900">{b.date}</div>
                                <div className="text-[10px] text-gray-400 uppercase mt-1">ID: {b.id.toUpperCase()} • {b.guests} Guests</div>
                            </td>
                            <td className="p-6">
                                <div className="font-bold text-gray-700">{b.chefName}</div>
                                <div className="text-xs text-gray-400 truncate max-w-[180px]">{b.menuName}</div>
                            </td>
                            <td className="p-6 font-bold text-gray-900">£{b.totalPrice.toFixed(2)}</td>
                            <td className="p-6">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {b.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const ChefsModule = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-end">
            <div>
                <h2 className="text-5xl font-serif font-bold text-gray-900">Talent Registry</h2>
                <p className="text-gray-500 mt-2">Vetting and performance management for elite chefs.</p>
            </div>
            <button className="bg-brand-gold text-brand-dark px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Approve New</button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allChefs.map(chef => (
                <div key={chef.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex gap-6 items-center shadow-sm hover:shadow-md transition-all">
                    <img src={chef.imageUrl} className="w-20 h-20 rounded-2xl object-cover grayscale hover:grayscale-0 transition-all shadow-lg" alt="" />
                    <div className="flex-grow">
                        <div className="flex justify-between">
                            <h3 className="text-xl font-serif font-bold text-gray-900">{chef.name}</h3>
                            <span className="text-brand-gold font-bold text-sm">★ {chef.rating}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{chef.location}</p>
                        <div className="flex gap-4 mt-3">
                            <button className="text-[9px] font-black uppercase text-brand-gold hover:underline">Full Profile</button>
                            <button className="text-[9px] font-black uppercase text-red-400 hover:underline">Suspend</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const UsersModule = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <header>
            <h2 className="text-5xl font-serif font-bold text-gray-900">CRM</h2>
            <p className="text-gray-500 mt-2">Manage customer identity and historical data.</p>
        </header>
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Identity</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Permission</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {allUsers.map(user => (
                        <tr key={user.id}>
                            <td className="p-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center font-bold text-brand-gold">{user.name.charAt(0)}</div>
                                <div>
                                    <p className="font-bold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                </div>
                            </td>
                            <td className="p-6">
                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${user.role === 'ADMIN' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-6 text-xs text-gray-400 font-bold">2024-Q1</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const PayoutsModule = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <header>
            <h2 className="text-5xl font-serif font-bold text-gray-900">Financial Ledger</h2>
            <p className="text-gray-500 mt-2">Treasury operations and chef disbursements.</p>
        </header>
        <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 flex flex-col items-center text-center shadow-xl">
            <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center text-4xl mb-8">💷</div>
            <h3 className="text-2xl font-serif font-bold text-gray-900">Disbursement Cycle</h3>
            <p className="text-gray-400 max-w-sm mt-4 mb-10 leading-relaxed">Automated chef payouts are calculated every Sunday. Platform commission (12%) is deducted at source.</p>
            <div className="grid grid-cols-2 gap-10 w-full max-w-md border-t border-gray-50 pt-10">
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Pending Payouts</p>
                    <p className="text-2xl font-bold text-gray-900">14</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Next Run</p>
                    <p className="text-2xl font-bold text-brand-gold">In 3 Days</p>
                </div>
            </div>
        </div>
    </div>
  );

  const SEOScreen = () => (
    <div className="flex flex-col md:flex-row gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex-1 space-y-8">
            <header className="mb-10">
                <div className="flex items-center gap-4 text-gray-400 text-sm font-medium mb-2">
                    <span>Terminal</span> <span>/</span> <span>SEO & Search</span>
                </div>
                <h2 className="text-5xl font-serif font-bold text-gray-900 leading-tight">Search Engine Meta</h2>
                <p className="text-gray-500 mt-2">Optimize the global discoverability of LuxePlate.</p>
            </header>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-10 space-y-8">
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Meta Title</label>
                        <span className="text-[9px] font-bold text-gray-300">{metaTitle.length}/60</span>
                    </div>
                    <input 
                        type="text" 
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full bg-gray-50 border border-transparent focus:border-brand-gold focus:bg-white rounded-2xl p-5 text-gray-900 font-medium transition-all outline-none"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Meta Description</label>
                        <span className="text-[9px] font-bold text-gray-300">{metaDescription.length}/160</span>
                    </div>
                    <textarea 
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full bg-gray-50 border border-transparent focus:border-brand-gold focus:bg-white rounded-2xl p-5 text-gray-900 font-medium transition-all outline-none h-32 resize-none"
                    />
                </div>
                <button className="bg-brand-dark text-brand-gold px-12 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg hover:bg-black transition-all">Update Index</button>
            </div>
        </div>
        <div className="w-full md:w-96 pt-12">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Live Preview</h4>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px]">L</div>
                    <span className="text-xs text-gray-400">luxeplate.com</span>
                </div>
                <h5 className="text-blue-700 text-xl font-medium hover:underline cursor-pointer leading-tight">{metaTitle}</h5>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{metaDescription}</p>
            </div>
        </div>
    </div>
  );

  const RecruitmentModule = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-end">
            <div>
                <h2 className="text-5xl font-serif font-bold text-gray-900">Acquisition</h2>
                <p className="text-gray-500 mt-2">Manage open chef positions and recruiting campaigns.</p>
            </div>
            <button className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">+ New Job</button>
        </header>
        <div className="space-y-4">
            {allJobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-gray-900">{job.title}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{job.location} • {job.type}</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Applicants</p>
                            <p className="text-lg font-bold text-brand-gold">{job.applicants}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${job.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {job.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  // --- RENDER CONTENT LOGIC ---
  const renderContent = () => {
    switch (activeTab) {
      case 'OVERVIEW': return <OverviewModule />;
      case 'BOOKINGS': return <BookingsModule />;
      case 'CHEFS': return <ChefsModule />;
      case 'USERS': return <UsersModule />;
      case 'PAYOUTS': return <PayoutsModule />;
      case 'MARKETING': return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-5xl font-serif font-bold text-gray-900">Campaigns</h2>
            <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 text-center">
                <div className="text-4xl mb-6">📣</div>
                <h3 className="text-2xl font-serif font-bold">Active Reach</h3>
                <p className="text-gray-400 max-w-sm mx-auto mt-4 mb-8 italic">Meta and Google Ads integration is currently streaming analytics to the main hub.</p>
                <button className="text-[10px] font-black uppercase text-brand-gold hover:underline tracking-widest">Connect Facebook Pixel</button>
            </div>
        </div>
      );
      case 'RECRUITMENT': return <RecruitmentModule />;
      case 'SEO_SEARCH': return <SEOScreen />;
      default: return <OverviewModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex relative overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 bg-brand-dark z-[120] transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-72 flex flex-col shadow-2xl`}>
        <div className="p-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center font-serif font-black text-xl">L</div>
            <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-white">LuxePlate</span>
                <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.3em]">Executive Hub</span>
            </div>
        </div>
        <nav className="flex-grow px-6 space-y-2 overflow-y-auto pb-10">
            {NAV_ITEMS.map((item) => (
                <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as AdminTab); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${activeTab === item.id 
                            ? 'bg-white/10 text-brand-gold shadow-lg' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                    <span className="text-lg opacity-80">{item.icon}</span>
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
        <div className="p-8 mt-auto">
             <button onClick={onExit} className="w-full py-4 bg-white/5 text-gray-500 hover:text-white hover:bg-red-500/10 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all">Exit Admin</button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow min-h-screen flex flex-col">
        <header className="sticky top-0 bg-[#fcfcfc]/80 backdrop-blur-md z-[100] px-10 py-6 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="w-12 h-12 flex flex-col justify-center items-center gap-1.5 bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all group"
                >
                    <span className="w-5 h-0.5 bg-brand-dark rounded-full group-hover:bg-brand-gold transition-colors"></span>
                    <span className="w-5 h-0.5 bg-brand-dark rounded-full group-hover:bg-brand-gold transition-colors"></span>
                    <span className="w-3 h-0.5 bg-brand-dark self-start ml-[14px] rounded-full group-hover:bg-brand-gold transition-colors"></span>
                </button>
                <div className="flex flex-col">
                    <h1 className="text-xl font-serif font-bold text-gray-900">Console Hub</h1>
                    <span className="text-[9px] font-black text-brand-gold uppercase tracking-[0.2em]">Sebastian_B • Root</span>
                </div>
            </div>
            <div className="hidden sm:flex items-center gap-8">
                <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Ops</p>
                    <p className="text-xs font-bold text-green-500 flex items-center gap-1 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Healthy
                    </p>
                </div>
                <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center font-serif font-bold text-gray-900 shadow-sm ring-4 ring-gray-50">SB</div>
            </div>
        </header>

        <div className="p-10 md:p-14 max-w-7xl w-full mx-auto flex-grow pb-24">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;