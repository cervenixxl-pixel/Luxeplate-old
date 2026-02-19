
import React from 'react';

interface FooterProps {
  onAdminClick: () => void;
  onChefClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, onChefClick }) => {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-30"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-serif font-bold text-xl text-brand-dark">L</div>
              <span className="font-serif font-bold text-2xl text-white">LuxePlate</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Curating unforgettable private dining experiences with the world's finest culinary talent. Michelin-standard hospitality in the comfort of your home.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Icons Placeholder */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-gold hover:text-brand-dark flex items-center justify-center transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                </div>
              ))}
            </div>
          </div>

          {/* Diners Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-6">Concierge</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><button className="hover:text-white transition-colors">How it Works</button></li>
              <li><button className="hover:text-white transition-colors">Gift Cards</button></li>
              <li><button className="hover:text-white transition-colors">Corporate Events</button></li>
              <li><button className="hover:text-white transition-colors">LuxePlate Select Membership</button></li>
              <li><button className="hover:text-white transition-colors">Safety & Standards</button></li>
            </ul>
          </div>

          {/* Chefs Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-6">Partners</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <button onClick={onChefClick} className="hover:text-white transition-colors flex items-center group">
                  Chef Login
                  <svg className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </li>
              <li><button className="hover:text-white transition-colors">Apply to Join</button></li>
              <li><button className="hover:text-white transition-colors">Partner Resources</button></li>
              <li><button className="hover:text-white transition-colors">Code of Conduct</button></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><button className="hover:text-white transition-colors">About Us</button></li>
              <li><button className="hover:text-white transition-colors">Careers</button></li>
              <li><button className="hover:text-white transition-colors">Press & Media</button></li>
              <li><button className="hover:text-white transition-colors">Contact Support</button></li>
              <li className="pt-4 border-t border-white/5 mt-4">
                <button onClick={onAdminClick} className="flex items-center text-xs font-bold text-gray-600 hover:text-brand-gold transition-colors uppercase tracking-wider">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2024 LuxePlate Experience Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <button className="hover:text-white transition-colors">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
