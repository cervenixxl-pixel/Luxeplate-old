import React, { useState } from 'react';
import { Chef } from '../types';

interface ChefCardProps {
  chef: Chef;
  onSelect: (chef: Chef) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, chef: Chef) => void;
}

const ChefCard: React.FC<ChefCardProps> = ({ chef, onSelect, isFavorite = false, onToggleFavorite }) => {
  const [imgError, setImgError] = useState(false);

  // Create a rich accessible label for the card action
  const cardLabel = `View profile for Chef ${chef.name}. Rated ${chef.rating} stars. Price starting from £${chef.minPrice} per person.`;

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col h-full relative"
    >
      {/* Main Card Action - Accessible Overlay Button */}
      <button
        type="button"
        className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer focus:opacity-100 focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 rounded-2xl"
        onClick={() => onSelect(chef)}
        aria-label={cardLabel}
      />

      {/* Cover Image Section */}
      <div className="relative h-64 w-full bg-gray-100 pointer-events-none overflow-hidden">
        {!imgError && chef.imageUrl ? (
            <img 
            src={chef.imageUrl} 
            alt="" 
            aria-hidden="true"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
            />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 relative">
                {/* Abstract pattern background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-200/50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 -ml-10 -mb-10"></div>
                
                <div className="z-10 bg-white p-4 rounded-full shadow-sm mb-2 border border-gray-100">
                    <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3C10.9 3 10 3.9 10 5C10 5.25 10.06 5.49 10.16 5.71C8.76 6.36 7.63 7.6 7.15 9.13C6.46 9.05 5.75 9.3 5.26 9.79C4.47 10.58 4.47 11.87 5.26 12.66C5.61 13.01 6.07 13.2 6.54 13.24V19C6.54 20.1 7.44 21 8.54 21H15.46C16.56 21 17.46 20.1 17.46 19V13.24C17.93 13.2 18.39 13.01 18.74 12.66C19.53 11.87 19.53 10.58 18.74 9.79C18.25 9.3 17.54 9.05 16.85 9.13C16.37 7.6 15.24 6.36 13.84 5.71C13.94 5.49 14 5.25 14 5C14 3.9 13.1 3 12 3ZM15.46 19H8.54V14H15.46V19Z" />
                    </svg>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest z-10">Chef Profile</span>
            </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" aria-hidden="true"></div>
        
        {/* Badges - Top Left */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[70%]" role="list" aria-label="Chef badges">
            {chef.badges && chef.badges.map((badge, idx) => (
                <span key={idx} role="listitem" className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md
                    ${badge.toLowerCase().includes('luxury') ? 'bg-black/80 text-white' : 'bg-white/90 text-gray-900'}`}>
                    {badge}
                </span>
            ))}
            {!chef.badges?.length && (
                 <span role="listitem" className="bg-white/90 text-gray-900 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
                    Premium
                 </span>
            )}
        </div>

        {/* Favorite Button - Top Right - Higher Z-index to sit above overlay */}
        {onToggleFavorite && (
          <button 
            onClick={(e) => {
                e.stopPropagation(); // Stop propagation just in case
                onToggleFavorite(e, chef);
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors focus:outline-none focus:bg-white/40 z-20 pointer-events-auto"
            aria-label={isFavorite ? `Remove Chef ${chef.name} from favorites` : `Add Chef ${chef.name} to favorites`}
            aria-pressed={isFavorite}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'fill-transparent text-white'}`} 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}

        {/* Overlapping Avatar - Bottom Right */}
        <div className="absolute -bottom-8 right-4 z-0" aria-hidden="true">
             <div className="relative">
                <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chef.name)}&background=random&size=128`}
                    alt="" 
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
                />
                {/* Verified Badge */}
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white" title="Verified Chef">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
             </div>
        </div>
      </div>
      
      {/* Content Section - pointer-events-none ensures clicks pass to the overlay button */}
      <div className="pt-10 px-5 pb-5 flex flex-col flex-grow pointer-events-none">
        
        {/* Name and Rating */}
        <div className="flex flex-col mb-2">
          <h3 className="text-xl font-serif font-bold text-gray-900 leading-tight group-hover:text-brand-gold transition-colors">{chef.name}</h3>
          
          <div 
            className="flex items-center text-gray-700 mt-1 space-x-2" 
            aria-label={`Rating: ${chef.rating} out of 5 stars based on ${chef.reviewsCount} reviews`}
            role="img"
          >
             <div className="flex items-center bg-orange-50 px-1.5 py-0.5 rounded text-orange-700" aria-hidden="true">
                 <svg className="w-3.5 h-3.5 fill-current mr-1" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                 <span className="font-bold text-xs">{chef.rating}</span>
             </div>
             <span className="text-gray-400 text-xs font-medium" aria-hidden="true">({chef.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Credential Tags */}
        <div className="mb-4">
            <p className="text-sm text-gray-600 font-medium line-clamp-1">
                {chef.tags && chef.tags.length > 0 ? chef.tags.join(" • ") : `${chef.yearsExperience} Years Experience`}
            </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-2" aria-hidden="true"></div>

        {/* Stats Rows */}
        <div className="space-y-2.5 mt-auto pt-2">
            {/* Events */}
            <div className="flex items-center text-xs text-gray-500 font-medium">
                <div className="w-6 flex justify-center mr-2" aria-hidden="true">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <span>{chef.eventsCount || 42} bookings on LuxePlate</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center text-xs text-gray-500 font-medium">
                 <div className="w-6 flex justify-center mr-2" aria-hidden="true">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 </div>
                {chef.location}
            </div>

             {/* Price - Removed aria-hidden from text content for better read-mode accessibility */}
             <div className="flex items-center text-sm text-gray-900 font-bold">
                 <div className="w-6 flex justify-center mr-2" aria-hidden="true">
                    <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                <span>From £{chef.minPrice}<span className="text-xs font-normal text-gray-500 ml-1">/person</span></span>
                <span className="mx-2 text-gray-300" aria-hidden="true">•</span>
                <span className="text-xs font-normal text-gray-500">Min £{chef.minSpend || 300}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChefCard;