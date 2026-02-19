import { User } from '../types';
import { db } from './databaseService';

const CURRENT_USER_KEY = 'luxeplate_current_user';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let user = db.findUserByEmail(email);
    
    // Auto-provision admin if using the default admin email in this demo environment
    if (!user && email.toLowerCase() === 'admin@luxeplate.com') {
      user = await this.register('System Admin', 'admin@luxeplate.com', password, 'ADMIN');
      return user;
    }
    
    if (!user) {
      throw new Error('Account not found. Please check your credentials.');
    }
    
    // For demo: Accept any password for existing users
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  async register(name: string, email: string, password: string, role: 'DINER' | 'CHEF' | 'ADMIN' = 'DINER'): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (db.findUserByEmail(email)) {
      throw new Error('This email address is already registered.');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${role === 'ADMIN' ? '0f172a' : 'd4af37'}&color=fff`,
      favoriteChefIds: []
    };

    db.saveUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  updateCurrentUser(user: User): void {
    db.updateUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
};