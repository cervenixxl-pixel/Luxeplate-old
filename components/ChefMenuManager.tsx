
import React, { useState, useRef, useEffect } from 'react';
import { Chef, Menu, Dish } from '../types';

interface ChefMenuManagerProps {
  chef: Chef;
  onUpdate: (updatedChef: Chef) => void;
}

const EMPTY_DISH: Dish = {
  name: '',
  description: '',
  ingredients: [],
  allergens: [],
  isSignature: false
};

const ALLERGEN_OPTIONS = [
  "Gluten", "Dairy", "Nuts", "Shellfish", "Eggs", "Soy", "Fish", 
  "Peanuts", "Sulphites", "Mustard", "Celery", "Sesame", "Lupin", "Molluscs"
];

const COMMON_INGREDIENTS = [
    "Fleur de Sel", "Black Truffle", "Extra Virgin Olive Oil", "Shallots", "Garlic", "Unsalted Butter", "Organic Lemon", "Fresh Thyme", "Italian Basil",
    "Madagascar Vanilla", "Double Cream", "Panko Breadcrumbs", "Saffron Threads", "Smoked Paprika", "Balsamic Glaze", "Chives", "Miso Paste", "Ginger",
    "Wagyu Beef", "Corn-fed Chicken", "Hand-dived Scallops", "Atlantic Salmon", "Wild Mushrooms", "Burrata", "Parmigiano Reggiano"
];

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
    return "⚠️";
};

const TagInput: React.FC<{
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}> = ({ label, tags, onChange, placeholder, suggestions = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [draggedTagIndex, setDraggedTagIndex] = useState<number | null>(null);
  const [dragOverTagIndex, setDragOverTagIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
              setShowSuggestions(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processInput();
    }
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        removeTag(tags.length - 1);
    }
  };

  const processInput = (inputOverride?: string) => {
    const textToProcess = inputOverride !== undefined ? inputOverride : inputValue;
    const parts = textToProcess.split(',').map(s => s.trim()).filter(Boolean);
    
    if (parts.length > 0) {
       const nextTags = [...tags];
       let changed = false;
       parts.forEach(p => {
           if (!nextTags.some(t => t.toLowerCase() === p.toLowerCase())) {
               nextTags.push(p);
               changed = true;
           }
       });
       
       if (changed) onChange(nextTags);
       setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedTagIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverTagIndex !== index) setDragOverTagIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedTagIndex === null || draggedTagIndex === dropIndex) {
        setDraggedTagIndex(null);
        setDragOverTagIndex(null);
        return;
    }
    const nextTags = [...tags];
    const [moved] = nextTags.splice(draggedTagIndex, 1);
    nextTags.splice(dropIndex, 0, moved);
    onChange(nextTags);
    setDraggedTagIndex(null);
    setDragOverTagIndex(null);
  };

  const availableSuggestions = suggestions.filter(s => !tags.some(t => t.toLowerCase() === s.toLowerCase()));

  return (
    <div className="flex flex-col h-full group relative" ref={containerRef}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        {tags.length > 0 && (
            <button 
                onClick={() => onChange([])}
                className="text-[9px] font-bold text-red-400 hover:text-red-600 uppercase tracking-tighter transition-colors"
            >
                Clear all
            </button>
        )}
      </div>
      
      <div 
        className="flex-grow bg-white border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-brand-gold/10 focus-within:border-brand-gold transition-all cursor-text flex flex-wrap content-start gap-2 min-h-[60px]" 
        onClick={() => {
            inputRef.current?.focus();
            setShowSuggestions(true);
        }}
      >
        {tags.map((tag, i) => (
            <span 
                key={i} 
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                className={`bg-brand-dark text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center transition-all shadow-sm cursor-grab active:cursor-grabbing
                    ${draggedTagIndex === i ? 'opacity-20 scale-95' : 'animate-in zoom-in-95'}
                    ${dragOverTagIndex === i ? 'ring-2 ring-brand-gold ring-offset-1' : ''}
                `}
            >
                <svg className="w-3 h-3 mr-1.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 8h16M4 16h16"></path></svg>
                {tag}
                <button 
                    onClick={(e) => { e.stopPropagation(); removeTag(i); }} 
                    type="button" 
                    className="ml-2 text-white/50 hover:text-white focus:outline-none"
                    tabIndex={-1}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </span>
        ))}
        
        <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => processInput()}
            onFocus={() => setShowSuggestions(true)}
            className="flex-grow text-sm p-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 min-w-[80px]"
            placeholder={tags.length === 0 ? placeholder : ""}
            autoComplete="off"
        />
      </div>

      {showSuggestions && availableSuggestions.length > 0 && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 w-full animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
                 <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Recommended Ingredients</p>
                 <button onClick={(e) => { e.stopPropagation(); setShowSuggestions(false); }} className="text-[10px] text-gray-400 hover:text-gray-600 font-bold uppercase">Close</button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2">
                {availableSuggestions.map(ing => (
                    <button 
                        key={ing}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); processInput(ing); inputRef.current?.focus(); }}
                        className="text-[11px] bg-gray-50 hover:bg-brand-dark hover:text-white px-3 py-1.5 rounded-full border border-gray-100 transition-all font-bold text-gray-600"
                    >
                        + {ing}
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

const MultiSelectDropdown: React.FC<{
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}> = ({ label, options, selected, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [draggedTagIndex, setDraggedTagIndex] = useState<number | null>(null);
    const [dragOverTagIndex, setDragOverTagIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(s => s !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.stopPropagation();
        setDraggedTagIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragOverTagIndex !== index) setDragOverTagIndex(index);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedTagIndex === null || draggedTagIndex === dropIndex) {
            setDraggedTagIndex(null);
            setDragOverTagIndex(null);
            return;
        }
        const nextSelected = [...selected];
        const [moved] = nextSelected.splice(draggedTagIndex, 1);
        nextSelected.splice(dropIndex, 0, moved);
        onChange(nextSelected);
        setDraggedTagIndex(null);
        setDragOverTagIndex(null);
    };

    return (
        <div className="flex flex-col h-full relative" ref={containerRef}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                {label}
                {selected.length > 0 && <span className="text-brand-gold ml-2 font-black">[{selected.length}]</span>}
            </label>
            
            <div 
                className={`w-full bg-white border border-gray-200 rounded-xl p-3 text-left flex justify-between items-center cursor-pointer transition-all min-h-[60px] ${isOpen ? 'ring-2 ring-brand-gold/10 border-brand-gold' : 'hover:border-gray-300'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                 <div className="flex flex-wrap gap-2 max-w-[90%]">
                    {selected.length === 0 && (
                        <span className="text-gray-400 text-sm font-medium py-1">{placeholder}</span>
                    )}
                    {selected.map((tag, i) => (
                        <span 
                            key={i} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, i)}
                            onDragOver={(e) => handleDragOver(e, i)}
                            onDrop={(e) => handleDrop(e, i)}
                            className={`bg-orange-50 text-orange-700 border border-orange-100 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center transition-all cursor-grab active:cursor-grabbing
                                ${draggedTagIndex === i ? 'opacity-20 scale-95' : 'animate-in fade-in duration-200'}
                                ${dragOverTagIndex === i ? 'ring-2 ring-brand-gold ring-offset-1' : ''}
                            `}
                        >
                            <span className="mr-1.5 text-xs">{getAllergenIcon(tag)}</span>
                            {tag}
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleSelect(tag); }}
                                className="ml-1.5 hover:text-red-600 transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </span>
                    ))}
                 </div>
                 <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input 
                                type="text" 
                                className="w-full text-sm pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-gold/10 focus:border-brand-gold transition-all"
                                placeholder="Filter allergens..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-1 gap-1">
                        {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                            <div 
                                key={opt} 
                                onClick={(e) => { e.stopPropagation(); handleSelect(opt); }}
                                className={`px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group ${selected.includes(opt) ? 'bg-brand-light/40' : ''}`}
                            >
                                <span className={`flex items-center text-sm font-bold ${selected.includes(opt) ? 'text-brand-dark' : 'text-gray-600'}`}>
                                    <span className="mr-3 text-xl w-6 text-center">{getAllergenIcon(opt)}</span>
                                    {opt}
                                </span>
                                {selected.includes(opt) ? (
                                    <div className="w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center shadow-sm">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-brand-gold transition-colors"></div>
                                )}
                            </div>
                        )) : (
                            <div className="p-6 text-center text-xs text-gray-400 font-bold uppercase tracking-widest italic">No match found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const DishImageUploader: React.FC<{
    image?: string;
    onChange: (value?: string) => void;
}> = ({ image, onChange }) => {
    const [isUrlMode, setIsUrlMode] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => onChange(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) onChange(urlInput.trim());
        setIsUrlMode(false);
        setUrlInput('');
    };

    if (image) {
        return (
            <div className="flex-shrink-0 pt-1 w-full md:w-40">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden group shadow-lg border border-gray-100">
                    <img src={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Dish" />
                    <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                        <button 
                            onClick={() => onChange(undefined)}
                            className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center"
                        >
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isUrlMode) {
        return (
            <div className="flex-shrink-0 pt-1 w-full md:w-40">
                <div className="aspect-square w-full flex flex-col justify-center gap-3 p-4 bg-white border-2 border-brand-gold rounded-2xl shadow-inner">
                    <p className="text-[10px] font-bold text-brand-gold uppercase text-center tracking-widest">Image URL</p>
                    <input 
                        type="text" 
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:border-brand-gold outline-none bg-gray-50"
                        placeholder="https://..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        autoFocus
                    />
                    <div className="flex justify-between">
                        <button onClick={() => { setIsUrlMode(false); setUrlInput(''); }} className="text-[10px] font-bold text-gray-400 hover:text-gray-700 uppercase">Cancel</button>
                        <button onClick={handleUrlSubmit} className="text-[10px] font-bold text-brand-gold hover:text-brand-dark uppercase">Save</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-shrink-0 pt-1 w-full md:w-40">
            <div className="aspect-square w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-gold hover:bg-white transition-all relative group overflow-hidden flex flex-col items-center justify-center text-gray-400">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onChange={handleFileChange} />
                
                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100 group-hover:text-brand-gold">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest block">Add Dish Photo</span>
                </div>
                
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsUrlMode(true); }}
                    className="absolute bottom-4 text-[10px] font-bold text-gray-400 hover:text-brand-gold uppercase transition-colors"
                >
                    Paste URL Instead
                </button>
            </div>
        </div>
    );
};

const ChefMenuManager: React.FC<ChefMenuManagerProps> = ({ chef, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<'starter' | 'main' | 'dessert'>('starter');
  
  const [dragType, setDragType] = useState<'DISH' | 'COURSE' | null>(null);
  const [draggedDishIndex, setDraggedDishIndex] = useState<number | null>(null);
  const [draggedCourseIndex, setDraggedCourseIndex] = useState<number | null>(null);
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  const [dragOverDishIndex, setDragOverDishIndex] = useState<number | null>(null);
  const [dragOverCourseIndex, setDragOverCourseIndex] = useState<number | null>(null);

  const handleAddNewMenu = () => {
    const newMenu: Menu = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      pricePerHead: 0,
      description: '',
      courses: {
        starter: [{ ...EMPTY_DISH }],
        main: [{ ...EMPTY_DISH }],
        dessert: [{ ...EMPTY_DISH }]
      },
      courseOrder: ['starter', 'main', 'dessert']
    };
    setEditingMenu(newMenu);
    setIsEditing(true);
    setActiveCourseTab('starter');
  };

  const handleEditMenu = (menu: Menu) => {
    const menuCopy = JSON.parse(JSON.stringify(menu));
    if (!menuCopy.courseOrder) {
        menuCopy.courseOrder = ['starter', 'main', 'dessert'];
    }
    setEditingMenu(menuCopy);
    setIsEditing(true);
    setActiveCourseTab(menuCopy.courseOrder[0]);
  };

  const handleDeleteMenu = (menuId: string) => {
    if (window.confirm('Delete this menu forever?')) {
      const updatedMenus = chef.menus.filter(m => m.id !== menuId);
      onUpdate({ ...chef, menus: updatedMenus });
    }
  };

  const handleSaveMenu = () => {
    if (!editingMenu || !editingMenu.name) {
        alert("Enter a professional menu name to proceed.");
        return;
    }
    let updatedMenus = [...chef.menus];
    const index = updatedMenus.findIndex(m => m.id === editingMenu.id);
    if (index >= 0) updatedMenus[index] = editingMenu;
    else updatedMenus.push(editingMenu);
    onUpdate({ ...chef, menus: updatedMenus });
    setIsEditing(false);
    setEditingMenu(null);
  };

  const handleDishChange = (index: number, field: keyof Dish, value: any) => {
    if (!editingMenu) return;
    const currentDishes = [...editingMenu.courses[activeCourseTab]];
    currentDishes[index] = { ...currentDishes[index], [field]: value };
    setEditingMenu({
      ...editingMenu,
      courses: { ...editingMenu.courses, [activeCourseTab]: currentDishes }
    });
  };

  const handleAddDish = () => {
    if (!editingMenu) return;
    const currentDishes = [...editingMenu.courses[activeCourseTab]];
    currentDishes.push({ ...EMPTY_DISH });
    setEditingMenu({
      ...editingMenu,
      courses: { ...editingMenu.courses, [activeCourseTab]: currentDishes }
    });
  };

  const handleDeleteDish = (index: number) => {
    if (!editingMenu) return;
    const currentDishes = [...editingMenu.courses[activeCourseTab]];
    if (currentDishes.length === 1) return;
    currentDishes.splice(index, 1);
    setEditingMenu({
      ...editingMenu,
      courses: { ...editingMenu.courses, [activeCourseTab]: currentDishes }
    });
  };

  const handleDishDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDragType('DISH');
    setDraggedDishIndex(index);
  };

  const handleDishDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragType === 'DISH' && dragOverDishIndex !== index) setDragOverDishIndex(index);
  };

  const handleDishDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragType !== 'DISH' || draggedDishIndex === null || draggedDishIndex === dropIndex || !editingMenu) {
        setDragType(null); setDraggedDishIndex(null); setDragOverDishIndex(null);
        return;
    }
    const currentDishes = [...editingMenu.courses[activeCourseTab]];
    const [draggedItem] = currentDishes.splice(draggedDishIndex, 1);
    currentDishes.splice(dropIndex, 0, draggedItem);
    setEditingMenu({
      ...editingMenu,
      courses: { ...editingMenu.courses, [activeCourseTab]: currentDishes }
    });
    setDragType(null); setDraggedDishIndex(null); setDragOverDishIndex(null);
  };

  if (isEditing && editingMenu) {
    const courseOrder = editingMenu.courseOrder || ['starter', 'main', 'dessert'];

    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="bg-brand-dark px-8 py-6 flex justify-between items-center border-b border-white/5">
            <div>
                <h3 className="text-white font-serif font-bold text-2xl">
                    {chef.menus.find(m => m.id === editingMenu.id) ? 'Refining Menu' : 'New Culinary Concept'}
                </h3>
                <p className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mt-1">LuxePlate Executive Portal</p>
            </div>
            <button onClick={() => setIsEditing(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <div className="p-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-3 space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Menu Headline</label>
                        <input 
                            type="text" 
                            value={editingMenu.name}
                            onChange={(e) => setEditingMenu({...editingMenu, name: e.target.value})}
                            className="w-full bg-transparent border-b-2 border-gray-100 focus:border-brand-gold outline-none font-serif font-bold text-3xl text-gray-900 pb-3 transition-colors"
                            placeholder="e.g. Modern Gastronomy"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">The Culinary Story</label>
                        <textarea 
                            value={editingMenu.description}
                            onChange={(e) => setEditingMenu({...editingMenu, description: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-gold/10 focus:border-brand-gold outline-none h-28 resize-none text-sm text-gray-600 leading-relaxed"
                            placeholder="Describe the experience, inspiration, and techniques used..."
                        />
                    </div>
                </div>
                <div className="md:col-span-1">
                    <div className="bg-brand-light p-6 rounded-3xl border border-brand-accent/50 text-center">
                        <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-3">Investment pp</label>
                        <div className="flex items-center justify-center">
                            <span className="text-3xl font-serif font-bold text-brand-dark">£</span>
                            <input 
                                type="number" 
                                value={editingMenu.pricePerHead || ''}
                                onChange={(e) => setEditingMenu({...editingMenu, pricePerHead: parseFloat(e.target.value) || 0})}
                                className="w-24 bg-transparent text-4xl font-serif font-bold text-brand-dark outline-none text-center"
                                placeholder="0"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-3 tracking-tighter">Excluding VAT & Fees</p>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <div className="flex items-center justify-between mb-6">
                    <label className="text-xs font-bold text-brand-dark uppercase tracking-[0.2em] flex items-center">
                        <span className="w-8 h-px bg-brand-gold mr-3"></span>
                        Course Sequencing
                    </label>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Drag tabs to reorder</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-10 bg-gray-100/50 p-2 rounded-2xl">
                    {courseOrder.map((tab, idx) => (
                        <div
                            key={tab}
                            draggable
                            onDragStart={(e) => { setDragType('COURSE'); setDraggedCourseIndex(idx); }}
                            onDragOver={(e) => { e.preventDefault(); if(dragOverCourseIndex !== idx) setDragOverCourseIndex(idx); }}
                            onDrop={(e) => {
                                e.preventDefault();
                                const newOrder = [...courseOrder];
                                const [removed] = newOrder.splice(draggedCourseIndex!, 1);
                                newOrder.splice(idx, 0, removed);
                                setEditingMenu({...editingMenu, courseOrder: newOrder as any});
                                setDragType(null); setDragOverCourseIndex(null);
                            }}
                            onDragEnd={() => { setDragType(null); setDragOverCourseIndex(null); }}
                            onClick={() => setActiveCourseTab(tab as any)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-3
                                ${activeCourseTab === tab 
                                    ? 'bg-white text-brand-dark shadow-xl ring-1 ring-gray-100 scale-105' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }
                                ${dragOverCourseIndex === idx ? 'ring-2 ring-brand-gold ring-offset-2' : ''}
                            `}
                        >
                            <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16"></path></svg>
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    {editingMenu.courses[activeCourseTab].map((dish, idx) => (
                        <div 
                            key={idx} 
                            draggable={isDragEnabled}
                            onDragStart={(e) => handleDishDragStart(e, idx)}
                            onDragOver={(e) => handleDishDragOver(e, idx)}
                            onDrop={(e) => handleDishDrop(e, idx)}
                            onDragEnd={() => { setDragType(null); setDraggedDishIndex(null); setDragOverDishIndex(null); }}
                            className={`flex flex-col md:flex-row gap-8 bg-white border rounded-[2.5rem] p-6 md:p-8 relative transition-all duration-300
                                ${draggedDishIndex === idx ? 'opacity-20 scale-95 border-dashed' : 'border-gray-100 shadow-sm hover:shadow-xl'}
                                ${dragOverDishIndex === idx ? 'border-brand-gold ring-2 ring-brand-gold/10' : ''}
                            `}
                        >
                            <div 
                                className="absolute left-1/2 md:left-4 top-2 md:top-1/2 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 flex md:flex-col gap-1 items-center justify-center text-gray-200 hover:text-brand-gold cursor-grab active:cursor-grabbing p-2"
                                onMouseEnter={() => setIsDragEnabled(true)}
                                onMouseLeave={() => setIsDragEnabled(false)}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                            </div>

                            <button onClick={() => handleDeleteDish(idx)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>

                            <DishImageUploader image={dish.image} onChange={(val) => handleDishChange(idx, 'image', val)} />

                            <div className="flex-grow space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-4">
                                    <input 
                                        type="text" 
                                        value={dish.name}
                                        onChange={(e) => handleDishChange(idx, 'name', e.target.value)}
                                        className="bg-transparent text-xl md:text-2xl font-serif font-bold text-gray-900 focus:text-brand-gold outline-none placeholder-gray-200"
                                        placeholder="Name of Creation..."
                                    />
                                    <div 
                                        onClick={() => handleDishChange(idx, 'isSignature', !dish.isSignature)}
                                        className="flex items-center gap-3 cursor-pointer group select-none"
                                    >
                                        <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${dish.isSignature ? 'bg-brand-gold' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${dish.isSignature ? 'left-6' : 'left-1'}`}></div>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${dish.isSignature ? 'text-brand-gold' : 'text-gray-400'}`}>Signature Dish</span>
                                    </div>
                                </div>

                                <input 
                                    type="text" 
                                    value={dish.description}
                                    onChange={(e) => handleDishChange(idx, 'description', e.target.value)}
                                    className="w-full bg-transparent text-sm text-gray-500 font-medium outline-none placeholder-gray-200"
                                    placeholder="Describe the dish, preparation, and presentation style..."
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                                    <TagInput 
                                        label="Key Components" 
                                        tags={dish.ingredients} 
                                        onChange={(tags) => handleDishChange(idx, 'ingredients', tags)}
                                        placeholder="Add ingredient..."
                                        suggestions={COMMON_INGREDIENTS}
                                    />
                                    <MultiSelectDropdown 
                                        label="Dietary Compliances" 
                                        options={ALLERGEN_OPTIONS}
                                        selected={dish.allergens || []} 
                                        onChange={(tags) => handleDishChange(idx, 'allergens', tags)}
                                        placeholder="Select allergens..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button onClick={handleAddDish} className="w-full py-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-gray-300 font-bold hover:border-brand-gold hover:text-brand-gold hover:bg-brand-light/30 transition-all flex flex-col items-center justify-center gap-2 group">
                        <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Add Another {activeCourseTab}</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end items-center gap-6 pt-10 border-t border-gray-50">
                <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-400 hover:text-gray-800 uppercase tracking-widest transition-colors">Discard Draft</button>
                <button 
                    onClick={handleSaveMenu} 
                    className="w-full md:w-auto bg-brand-dark text-brand-gold px-12 py-4 rounded-2xl font-bold shadow-2xl hover:bg-black transition-all transform active:scale-95"
                >
                    Publish Menu
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h2 className="text-4xl font-serif font-bold text-gray-900">Your Menu Portfolio</h2>
                <p className="text-gray-500 font-medium mt-2">Manage your culinary offerings for discerning clients.</p>
            </div>
            <button 
                onClick={handleAddNewMenu}
                className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all transform hover:-translate-y-1 flex items-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                Create New Concept
            </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
            {chef.menus.map(menu => (
                <div key={menu.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 mb-6 md:mb-0">
                        <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-serif font-bold text-2xl text-gray-900">{menu.name}</h3>
                            <span className="bg-brand-light text-brand-dark border border-brand-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">£{menu.pricePerHead} pp</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xl leading-relaxed italic mb-4">"{menu.description}"</p>
                        <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-2"></span>{menu.courses.starter.length} Starters</span>
                            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-2"></span>{menu.courses.main.length} Mains</span>
                            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-2"></span>{menu.courses.dessert.length} Desserts</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                         <button 
                            onClick={() => handleEditMenu(menu)}
                            className="px-8 py-3 bg-white border-2 border-gray-100 rounded-2xl text-xs font-bold text-gray-700 hover:border-brand-gold hover:text-brand-dark transition-all"
                        >
                            Refine
                        </button>
                        <button 
                            onClick={() => handleDeleteMenu(menu.id)}
                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            title="Delete permanently"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            ))}
            
            {chef.menus.length === 0 && (
                <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <span className="text-4xl">👨‍🍳</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No active menus</h3>
                    <p className="text-gray-500 font-medium max-w-xs mx-auto">Create your first signature menu to start receiving booking requests.</p>
                    <button onClick={handleAddNewMenu} className="text-brand-gold font-bold hover:underline mt-6 uppercase tracking-widest text-[10px]">Start Drafting Now</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default ChefMenuManager;
