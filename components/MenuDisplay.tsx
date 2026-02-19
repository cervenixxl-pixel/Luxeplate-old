import React, { useState } from 'react';
import { Menu, Dish } from '../types';

interface MenuDisplayProps {
  menu: Menu;
  onBook: (menu: Menu) => void;
  onUpdateMenu?: (menu: Menu) => void;
}

const COURSE_TITLES: Record<string, string> = {
    starter: "To Start",
    main: "Main Course",
    dessert: "Dessert"
};

const getAllergenIcon = (allergen: string) => {
    const lower = allergen.toLowerCase();
    if (lower.includes('gluten') || lower.includes('wheat')) return "🌾";
    if (lower.includes('dairy') || lower.includes('milk')) return "🥛";
    if (lower.includes('nut') || lower.includes('peanut')) return "🥜";
    if (lower.includes('shellfish') || lower.includes('crustacean') || lower.includes('shrimp')) return "🦐";
    if (lower.includes('egg')) return "🥚";
    if (lower.includes('soy')) return "🫘";
    if (lower.includes('fish') || lower.includes('salmon') || lower.includes('tuna') || lower.includes('cod')) return "🐟";
    if (lower.includes('sulphite') || lower.includes('wine')) return "🍷";
    if (lower.includes('mustard')) return "🌭"; 
    if (lower.includes('celery')) return "🥬";
    if (lower.includes('sesame')) return "🌱";
    if (lower.includes('mollusc') || lower.includes('squid') || lower.includes('octopus')) return "🐙";
    if (lower.includes('lupin')) return "🌸";
    return null;
};

const DishDetailModal: React.FC<{ dish: Dish; onClose: () => void }> = ({ dish, onClose }) => {
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-title"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
            <div 
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                 <div className="relative h-64 sm:h-72 w-full bg-gray-50">
                     {dish.image ? (
                        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                     ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                             <span className="text-5xl mb-2">🍽️</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No Image Available</span>
                         </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50"></div>
                     <button 
                         onClick={onClose}
                         className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur rounded-full p-2 text-white transition-colors shadow-sm border border-white/10"
                         aria-label="Close details"
                     >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                     </button>
                 </div>
                 
                 <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 id="dish-title" className="text-2xl font-serif font-bold text-gray-900">{dish.name}</h3>
                        <div className="flex gap-1 flex-wrap justify-end max-w-[30%]">
                            {dish.allergens?.map((alg, i) => {
                                const icon = getAllergenIcon(alg);
                                return icon ? (
                                    <span key={i} title={alg} className="text-xl cursor-help hover:scale-110 transition-transform" role="img" aria-label={alg}>
                                        {icon}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm">{dish.description}</p>
                    
                    <div className="space-y-6">
                        {dish.ingredients && dish.ingredients.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Key Ingredients</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {dish.ingredients.map((ing, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-700 font-medium">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                                Allergens
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {dish.allergens && dish.allergens.length > 0 ? (
                                    dish.allergens.map((allergen, i) => (
                                        <span key={i} className="cursor-help flex items-center px-2.5 py-1 bg-orange-50 border border-orange-100 rounded-lg text-xs text-orange-800 font-medium transition-colors hover:bg-orange-100">
                                            <span className="mr-1.5 text-base">{getAllergenIcon(allergen) || "⚠️"}</span>
                                            {allergen}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-green-600 flex items-center bg-green-50 px-2.5 py-1 rounded-lg border border-green-100 font-bold uppercase tracking-wide">
                                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        No Allergens
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

const CourseSection: React.FC<{ 
    title: string; 
    dishes: Dish[]; 
    onViewDetails: (dish: Dish) => void;
    dragHandle?: React.ReactNode;
}> = ({ title, dishes, onViewDetails, dragHandle }) => (
  <div className="mb-12 last:mb-0 select-none">
    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
        {dragHandle}
        <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">{title}</h5>
    </div>
    {/* Grid optimization for mobile */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {dishes.map((dish, idx) => (
        <div 
            key={idx} 
            className="flex flex-col group cursor-pointer"
            onClick={() => onViewDetails(dish)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') onViewDetails(dish) }}
        >
           <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-sm border border-gray-100 transition-all group-hover:shadow-md">
               {dish.image ? (
                   <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <span className="text-4xl grayscale opacity-30">🍽️</span>
                   </div>
               )}
               
               <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button 
                        className="w-9 h-9 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-brand-dark shadow-lg border border-white hover:bg-brand-gold hover:text-white transition-all transform hover:rotate-90"
                        aria-label={`View details for ${dish.name}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                    </button>
               </div>

                {dish.isSignature && (
                    <div className="absolute bottom-3 left-3 bg-brand-dark text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg z-10 tracking-widest uppercase border border-white/20">
                        Signature
                    </div>
                )}
           </div>

           <div className="flex flex-col px-1">
               <h6 className="text-gray-900 font-bold text-base leading-tight group-hover:text-brand-gold transition-colors flex items-start justify-between">
                   <span className="flex-grow">{dish.name}</span>
                   {dish.allergens && dish.allergens.length > 0 && (
                        <div className="inline-flex flex-wrap gap-1 ml-2 flex-shrink-0 pt-0.5">
                            {dish.allergens.slice(0, 3).map((alg, i) => {
                                const icon = getAllergenIcon(alg);
                                if (!icon) return null;
                                return (
                                    <span key={i} title={alg} className="text-sm grayscale-[0.5] hover:grayscale-0 transition-all opacity-60 hover:opacity-100" role="img" aria-label={alg}>
                                        {icon}
                                    </span>
                                );
                            })}
                        </div>
                   )}
               </h6>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed h-8">
                    {dish.description}
                </p>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu, onBook, onUpdateMenu }) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  const [draggedCourse, setDraggedCourse] = useState<string | null>(null);
  const [dragOverCourse, setDragOverCourse] = useState<string | null>(null);

  const courseOrder = menu.courseOrder || ['starter', 'main', 'dessert'];
  const descriptionLimit = 200;
  const isLongDescription = menu.description && menu.description.length > descriptionLimit;

  const handleDragStart = (e: React.DragEvent, course: string) => {
      if (!onUpdateMenu) return;
      setDraggedCourse(course);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', course);
  };

  const handleDragOver = (e: React.DragEvent, course: string) => {
      e.preventDefault();
      if (!onUpdateMenu || draggedCourse === course) return;
      setDragOverCourse(course);
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCourse: string) => {
      e.preventDefault();
      if (!onUpdateMenu || !draggedCourse || draggedCourse === targetCourse) {
          setDraggedCourse(null);
          setDragOverCourse(null);
          return;
      }
      
      const newOrder = [...courseOrder];
      const draggedIdx = newOrder.indexOf(draggedCourse as any);
      const targetIdx = newOrder.indexOf(targetCourse as any);
      
      if (draggedIdx !== -1 && targetIdx !== -1) {
          newOrder.splice(draggedIdx, 1);
          newOrder.splice(targetIdx, 0, draggedCourse as any);
          onUpdateMenu({ ...menu, courseOrder: newOrder as any });
      }
      
      setDraggedCourse(null);
      setDragOverCourse(null);
  };

  const handleBookClick = () => {
      setIsBooking(true);
      setTimeout(() => {
          onBook(menu);
          setIsBooking(false);
      }, 1200);
  };

  return (
    <>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 relative flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-5 sm:p-10 pb-28 md:pb-32">
                <div className="mb-10 max-w-2xl">
                    <h4 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark mb-4">{menu.name}</h4>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {isExpanded || !isLongDescription 
                            ? menu.description 
                            : `${menu.description.slice(0, descriptionLimit)}...`
                        }
                        {isLongDescription && (
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)} 
                                className="ml-2 text-brand-gold font-bold hover:text-brand-dark transition-all underline underline-offset-4 decoration-1"
                            >
                                {isExpanded ? 'Read Less' : 'Read Full Story'}
                            </button>
                        )}
                    </p>
                </div>

                <div className="space-y-4">
                    {courseOrder.map((courseKey) => {
                        const dishes = (menu.courses as any)[courseKey];
                        if (dishes && dishes.length > 0) {
                            return (
                                <div
                                    key={courseKey}
                                    draggable={!!onUpdateMenu}
                                    onDragStart={(e) => handleDragStart(e, courseKey)}
                                    onDragOver={(e) => handleDragOver(e, courseKey)}
                                    onDrop={(e) => handleDrop(e, courseKey)}
                                    onDragEnd={() => { setDraggedCourse(null); setDragOverCourse(null); }}
                                    className={`transition-all duration-300 rounded-3xl
                                        ${draggedCourse === courseKey ? 'opacity-30 bg-gray-50' : ''}
                                        ${dragOverCourse === courseKey ? 'ring-2 ring-brand-gold ring-offset-4 bg-brand-light/30' : ''}
                                    `}
                                >
                                    <CourseSection 
                                        title={COURSE_TITLES[courseKey] || courseKey} 
                                        dishes={dishes} 
                                        onViewDetails={setSelectedDish} 
                                        dragHandle={onUpdateMenu ? (
                                            <span 
                                                className="cursor-move text-gray-300 hover:text-brand-gold transition-colors p-2 -ml-2" 
                                                title="Drag to reorder course"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                                            </span>
                                        ) : undefined}
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>

            {/* Optimized Sticky Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-gray-50 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Standard Booking</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-serif font-bold text-2xl sm:text-3xl text-brand-dark">£{menu.pricePerHead}</span>
                        <span className="text-gray-400 text-xs font-medium">/pp</span>
                    </div>
                </div>
                <button 
                    onClick={handleBookClick}
                    disabled={isBooking}
                    className="bg-brand-dark hover:bg-black text-white font-bold py-3.5 px-8 sm:px-12 rounded-2xl transition-all shadow-xl shadow-brand-dark/10 text-sm min-w-[140px] sm:min-w-[180px] flex items-center justify-center disabled:opacity-80 active:scale-95 group"
                >
                    {isBooking ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            Verifying...
                        </>
                    ) : (
                        <>
                            Check Availability
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </>
                    )}
                </button>
            </div>
        </div>

        {selectedDish && (
            <DishDetailModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
        )}
    </>
  );
};

export default MenuDisplay;