// Fix: All errors were related to a missing or faulty React import. This has been corrected.
import React, { useState, useEffect } from 'react';
import { Chef, Booking, User, Menu } from '../types';
import { db } from '../services/databaseService';
import ChefMenuManager from './ChefMenuManager';

interface ChefDashboardProps {
  chef: Chef;
  onUpdateChef: (chef: Chef) => void;
  onExit: () => void;
}

type DashboardTab = 'PROFILE' | 'MENUS' | 'BOOKINGS';

const ChefDashboard: React.FC<ChefDashboardProps> = ({ chef, onUpdateChef, onExit }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('PROFILE');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editableChef, setEditableChef] = useState<Chef>(chef);

  useEffect(() => {
    setBookings(db.getBookingsByChefId(chef.id));
    setEditableChef(chef);
  }, [chef]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateChef(editableChef);
    alert('Profile updated successfully!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'PROFILE':
        return (
          <form onSubmit={handleProfileSave} className="space-y-8 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                value={editableChef.name}
                onChange={(e) => setEditableChef({ ...editableChef, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Bio</label>
              <textarea
                value={editableChef.bio}
                onChange={(e) => setEditableChef({ ...editableChef, bio: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Location</label>
                <input
                  type="text"
                  value={editableChef.location}
                  onChange={(e) => setEditableChef({ ...editableChef, location: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={editableChef.yearsExperience}
                  onChange={(e) => setEditableChef({ ...editableChef, yearsExperience: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="bg-brand-dark text-white font-bold py-3 px-10 rounded-xl hover:bg-black transition-colors">
                Save Profile
              </button>
            </div>
          </form>
        );
      case 'MENUS':
        return (
            <div className="animate-in fade-in duration-300">
                <ChefMenuManager chef={chef} onUpdate={onUpdateChef} />
            </div>
        );
      case 'BOOKINGS':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            {bookings.length > 0 ? (
                bookings.map(booking => (
                    <div key={booking.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-800">{booking.date} at {booking.time}</p>
                            <p className="text-sm text-gray-500">{booking.menuName} for {booking.guests} guests</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-500'
                        }`}>{booking.status}</span>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500">No active bookings found.</p>
                </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex justify-between items-center pb-8 border-b border-gray-200 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Chef Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {chef.name}.</p>
          </div>
          <button onClick={onExit} className="text-sm font-bold text-gray-500 hover:text-red-600">
            Sign Out
          </button>
        </header>

        <div className="flex space-x-8 mb-10">
            {(['PROFILE', 'MENUS', 'BOOKINGS'] as DashboardTab[]).map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab 
                        ? 'border-b-2 border-brand-dark text-brand-dark' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div>
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;