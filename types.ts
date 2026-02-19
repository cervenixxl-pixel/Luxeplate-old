
export enum CuisineType {
  MODERN_EUROPEAN = 'Modern European',
  ITALIAN = 'Italian',
  JAPANESE = 'Japanese',
  FRENCH = 'French',
  MEDITERRANEAN = 'Mediterranean',
  ASIAN_FUSION = 'Asian Fusion',
  BRITISH = 'British',
  MEXICAN = 'Mexican'
}

export interface Dish {
  name: string;
  description: string;
  isSignature?: boolean;
  ingredients: string[];
  allergens: string[];
  image?: string;
}

export interface Menu {
  id: string;
  name: string;
  pricePerHead: number;
  description: string;
  courses: {
    starter: Dish[];
    main: Dish[];
    dessert: Dish[];
  };
  courseOrder?: ('starter' | 'main' | 'dessert')[];
}

export interface Chef {
  id: string;
  name: string;
  location: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  cuisines: string[];
  imageUrl: string;
  minPrice: number;
  minSpend: number;
  menus: Menu[];
  yearsExperience: number;
  eventsCount: number;
  badges: string[]; // e.g., "Super Chef", "Luxury"
  tags: string[]; // e.g., "1* Michelin Experience"
}

export interface MenuRecommendation {
  chefName: string;
  chefId: string;
  chefImage: string;
  menuName: string;
  pricePerHead: number;
  description: string;
  matchReason: string; // e.g. "Similar price point"
}

export interface SearchParams {
  location: string;
  date: string;
  guests: number;
  cuisine?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'DINER' | 'CHEF' | 'ADMIN';
  avatar?: string;
  favoriteChefIds: string[];
}

export interface Booking {
  id: string;
  userId: string;
  chefId: string;
  chefName: string;
  chefImage: string;
  menuName: string;
  date: string;
  time: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Contract' | 'Event-based';
  applicants: number;
  status: 'ACTIVE' | 'FILLED' | 'DRAFT';
  platform: string;
  postedDate: string;
}

export interface Contract {
  id: string;
  chefName: string;
  type: string;
  status: 'SIGNED' | 'PENDING' | 'EXPIRED';
  value: number;
  date: string;
}

export interface NetworkAnalysis {
  reach: number;
  engagement: number;
  conversions: number;
  efficiency: number;
  channelPerformance: { platform: string; value: number }[];
}

export type ViewState = 
  | 'HOME' 
  | 'SEARCH_RESULTS'
  | 'CHEF_PROFILE' 
  | 'BOOKING_FLOW' 
  | 'PAYMENT' 
  | 'BOOKING_SUCCESS' 
  | 'USER_PROFILE' 
  | 'INBOX' 
  | 'ADMIN' 
  | 'CHEF_DASHBOARD' 
  | 'ADMIN_LOGIN';
