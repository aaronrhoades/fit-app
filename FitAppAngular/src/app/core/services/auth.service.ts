import { signal, inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginRequest } from '@models/index';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  
  // A signal to track the current token
  // Initialize it by checking LocalStorage immediately
  private token = signal<string | null>(localStorage.getItem('token'));

  // Computed-like check for the Guard to use
  isAuthenticated() {
    return !!this.token();
  }

  login(credentials: LoginRequest) {
    return this.http.post<{ token: string }>('/api/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.token.set(response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }
}
