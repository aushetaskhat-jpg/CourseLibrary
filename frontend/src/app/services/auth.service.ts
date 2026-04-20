import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  // ✅ РЕАЛЬНЫЙ LOGIN
  login(username: string, password: string) {
    return this.http.post<any>('/api/v1/auth/login/', { username, password }).pipe(
      catchError(err => {
        alert('Login error');
        return EMPTY;
      })
    );
  }

  // ✅ РЕАЛЬНЫЙ REGISTER
  register(data: { username: string; email: string; password: string; firstName: string; lastName: string }) {
    return this.http.post<any>('/api/v1/auth/register/', data).pipe(
      catchError(err => {
        alert('Register error');
        return EMPTY;
      })
    );
  }

  // ✅ СОХРАНЕНИЕ ЛОГИНА
  setUser(user: User, token: string) {
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    localStorage.setItem('token', token);
  }

  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    localStorage.removeItem('token');
  }

  getInitials(): string {
    const u = this.currentUser();
    if (!u) return '?';
    return (u.firstName[0] + (u.lastName[0] || '')).toUpperCase();
  }
}