import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl + '/auth';
  private readonly _user = signal<User | null>(null);

  user = this._user.asReadonly();

  constructor(private http: HttpClient) {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      this._user.set(JSON.parse(savedUser));
    } else if (savedToken) {
      this.http.get<User>(`${this.api}/me`).subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this._user.set(user);
        },
        error: () => this.logout(),
      });
    }
  }

  hydrateFromStorage() {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      this._user.set(JSON.parse(savedUser));
      return;
    }
    if (savedToken) {
      this.http.get<User>(`${this.api}/me`).subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this._user.set(user);
        },
        error: () => this.clearSession(),
      });
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<{
        token: string;
        user: User;
      }>(`${this.api}/login`, { email, password })
      .pipe(tap(({ token, user }) => this.setSession(token, user)));
  }

  register(name: string, email: string, password: string) {
    console.log(name, email, password);
    return this.http.post<User>(`${this.api}/register`, {
      name,
      email,
      password,
    });
  }
  logout() {
    this.clearSession();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this._user();
  }

  private setSession(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._user.set(user);
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user.set(null);
  }
}
