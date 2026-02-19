
import { User, Booking, Chef, JobPosting, Contract, SearchParams } from '../types';

// Pre-seeded, high-quality data to simulate a real database.
const SEED_CHEFS: Chef[] = [
  {
    id: 'chef_01',
    name: 'Julian Marchant',
    location: 'Notting Hill, London',
    bio: 'Classically trained French chef with a modern twist. I bring the elegance of Parisian fine dining to your home, focusing on seasonal British produce.',
    rating: 4.9,
    reviewsCount: 124,
    cuisines: ['French', 'Modern European'],
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800',
    minPrice: 150,
    minSpend: 600,
    menus: [
      {
        id: 'menu_01a',
        name: 'A Taste of Provence',
        pricePerHead: 150,
        description: 'A vibrant, sun-kissed menu celebrating the rustic yet elegant flavours of Southern France, using the finest ingredients from local London suppliers.',
        courses: {
          starter: [{ name: 'Heirloom Tomato Tart', description: 'With tapenade, goat\'s cheese mousse, and basil oil.', isSignature: true, ingredients: ['Tomato', 'Goat Cheese', 'Olives'], allergens: ['Gluten', 'Dairy'], image: 'https://images.unsplash.com/photo-1565299543923-37dd37887f2g?q=80&w=600' }],
          main: [{ name: 'Pan-Seared Duck Breast', description: 'With lavender honey glaze, potato gratin, and seasonal greens.', isSignature: false, ingredients: ['Duck', 'Honey', 'Potato'], allergens: ['Dairy'], image: 'https://images.unsplash.com/photo-1604503468822-38f75b7b0b43?q=80&w=600' }],
          dessert: [{ name: 'Valrhona Chocolate Fondant', description: 'Served with crème fraîche and a raspberry coulis.', isSignature: false, ingredients: ['Chocolate', 'Egg', 'Cream'], allergens: ['Gluten', 'Dairy', 'Eggs'], image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600' }]
        }
      },
      // ... more menus
    ],
    yearsExperience: 15,
    eventsCount: 320,
    badges: ['Michelin Background', 'Luxury Service'],
    tags: ['Classic French Technique', 'Wine Pairing Expert']
  },
  {
    id: 'chef_02',
    name: 'Elena Ricci',
    location: 'Mayfair, London',
    bio: 'Passionate about authentic Italian cuisine, my cooking is a journey through Italy\'s regions, from handmade pasta to delicate seafood.',
    rating: 4.9,
    reviewsCount: 98,
    cuisines: ['Italian', 'Mediterranean'],
    imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800',
    minPrice: 120,
    minSpend: 500,
    menus: [
       {
        id: 'menu_02a',
        name: 'Amalfi Coast Discovery',
        pricePerHead: 120,
        description: 'A fresh and zesty menu inspired by the coastal cuisine of Amalfi, focusing on fresh seafood, citrus, and artisanal ingredients.',
        courses: {
          starter: [{ name: 'Hand-dived Scallop Crudo', description: 'With Amalfi lemon, pink peppercorns, and extra virgin olive oil.', isSignature: false, ingredients: ['Scallops', 'Lemon'], allergens: ['Molluscs'], image: 'https://images.unsplash.com/photo-1541542944-890259952219?q=80&w=600' }],
          main: [{ name: 'Squid Ink Tagliatelle', description: 'With lobster, cherry tomatoes, and chili.', isSignature: true, ingredients: ['Flour', 'Squid Ink', 'Lobster'], allergens: ['Gluten', 'Shellfish'], image: 'https://images.unsplash.com/photo-1621996346565-e326b20f5572?q=80&w=600' }],
          dessert: [{ name: 'Delizia al Limone', description: 'A light sponge cake with a rich lemon cream filling.', isSignature: false, ingredients: ['Lemon', 'Cream', 'Flour'], allergens: ['Gluten', 'Dairy', 'Eggs'], image: 'https://images.unsplash.com/photo-1598192045584-75054e754954?q=80&w=600' }]
        }
      }
    ],
    yearsExperience: 10,
    eventsCount: 250,
    badges: ['Super Chef', 'Italian Specialist'],
    tags: ['Handmade Pasta', 'Regional Cuisine']
  },
   {
    id: 'chef_03',
    name: 'Kenji Tanaka',
    location: 'Shoreditch, London',
    bio: 'A master of modern Japanese cuisine, blending traditional Edomae techniques with a contemporary London edge. Omakase specialist.',
    rating: 5.0,
    reviewsCount: 75,
    cuisines: ['Japanese', 'Asian Fusion'],
    imageUrl: 'https://images.unsplash.com/photo-1563255143-70523db42de3?q=80&w=800',
    minPrice: 200,
    minSpend: 800,
    menus: [
       {
        id: 'menu_03a',
        name: 'Edomae Omakase',
        pricePerHead: 200,
        description: 'A seasonal tasting menu curated based on the finest fish from the market, featuring aged sashimi, delicate nigiri, and hot dishes.',
        courses: {
          starter: [{ name: 'Otoro Sashimi with Fresh Wasabi', description: 'Premium fatty tuna, aged for 5 days for maximum umami.', isSignature: true, ingredients: ['Tuna'], allergens: ['Fish'], image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=600' }],
          main: [{ name: 'A5 Wagyu Nigiri', description: 'Torched Kagoshima A5 Wagyu with a hint of yuzu kosho.', isSignature: false, ingredients: ['Wagyu Beef', 'Rice'], allergens: [], image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?q=80&w=600' }],
          dessert: [{ name: 'Matcha Tiramisu', description: 'A Japanese take on the Italian classic, with mascarpone and premium Uji matcha.', isSignature: false, ingredients: ['Matcha', 'Mascarpone'], allergens: ['Dairy', 'Eggs', 'Gluten'], image: 'https://images.unsplash.com/photo-1501957958444-c2fab5f62e82?q=80&w=600' }]
        }
      }
    ],
    yearsExperience: 12,
    eventsCount: 180,
    badges: ['Top Rated', 'Omakase Master'],
    tags: ['Sushi & Sashimi', 'A5 Wagyu']
  },
  // Add 9 more distinct chefs
];

const STORAGE_KEYS = {
  USERS: 'luxeplate_users',
  BOOKINGS: 'luxeplate_bookings',
  CHEFS: 'luxeplate_chefs_cache',
  JOBS: 'luxeplate_jobs',
  CONTRACTS: 'luxeplate_contracts'
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DatabaseService {
  constructor() {
    this.initSeedData();
  }

  private initSeedData() {
    if (!localStorage.getItem(STORAGE_KEYS.CHEFS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.CHEFS)!).length < 5) {
      localStorage.setItem(STORAGE_KEYS.CHEFS, JSON.stringify(SEED_CHEFS));
    }
  }

  // --- Chefs ---
  getChefs(): Chef[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHEFS);
    return data ? JSON.parse(data) : [];
  }

  searchChefs(params: SearchParams): Chef[] {
    const allChefs = this.getChefs();
    return allChefs.filter(chef => {
        const locationMatch = params.location ? chef.location.toLowerCase().includes(params.location.toLowerCase()) : true;
        const cuisineMatch = params.cuisine && params.cuisine !== 'Any' ? chef.cuisines.includes(params.cuisine) : true;
        // In a real app, guest count would filter availability, here we just filter based on text
        return locationMatch && cuisineMatch;
    });
  }
  
  saveChef(chef: Chef): void {
    const chefs = this.getChefs();
    const index = chefs.findIndex(c => c.id === chef.id);
    if (index !== -1) {
        chefs[index] = chef;
    } else {
        chefs.push(chef);
    }
    localStorage.setItem(STORAGE_KEYS.CHEFS, JSON.stringify(chefs));
  }

  getChefById(id: string): Chef | undefined {
    return this.getChefs().find(c => c.id === id);
  }

  getChefsByIds(ids: string[]): Chef[] {
    return this.getChefs().filter(c => ids.includes(c.id));
  }
  
  // --- Users ---
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }
  
  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  
  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }
  
  findUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }
  
  // --- Bookings ---
  getBookings(): Booking[] {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  }
  
  getBookingsByUserId(userId: string): Booking[] {
    return this.getBookings().filter(b => b.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  getBookingsByChefId(chefId: string): Booking[] {
    return this.getBookings().filter(b => b.chefId === chefId);
  }
  
  async createBooking(booking: Booking): Promise<void> {
    await delay(800);
    const bookings = this.getBookings();
    bookings.push(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
  
  async updateBooking(updatedBooking: Booking): Promise<void> {
      await delay(300);
      const bookings = this.getBookings();
      const index = bookings.findIndex(b => b.id === updatedBooking.id);
      if (index !== -1) {
          bookings[index] = updatedBooking;
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      }
  }
  
  // --- Jobs ---
  getJobs(): JobPosting[] {
    const data = localStorage.getItem(STORAGE_KEYS.JOBS);
    return data ? JSON.parse(data) : [];
  }
  
  saveJob(job: JobPosting): void {
    const jobs = this.getJobs();
    jobs.push(job);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }
  
  // --- Contracts ---
  getContracts(): Contract[] {
    const data = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
    return data ? JSON.parse(data) : [];
  }
  
  saveContract(contract: Contract): void {
    const contracts = this.getContracts();
    contracts.push(contract);
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
  }
}

export const db = new DatabaseService();
