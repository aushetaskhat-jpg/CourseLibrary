// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  login(username: string, password: string): boolean {
    // Mock login — replace with real HTTP call to /api/v1/auth/login/
    if (username && password) {
      this.currentUser.set({
        id: 1,
        username,
        firstName: 'Aushet',
        lastName: 'Askhat',
        email: 'aushet@kbtu.kz',
      });
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  register(data: { username: string; email: string; password: string; firstName: string; lastName: string }): boolean {
    // Mock register — replace with real HTTP call to /api/v1/auth/register/
    this.currentUser.set({
      id: 1,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
    this.isLoggedIn.set(true);
    return true;
  }

  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getInitials(): string {
    const u = this.currentUser();
    if (!u) return '?';
    return (u.firstName[0] + (u.lastName[0] || '')).toUpperCase();
  }
}
