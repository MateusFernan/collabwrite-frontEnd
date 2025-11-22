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
  private readonly _api = environment.apiUrl + '/auth';
  private readonly _user = signal<User | null>(null);

  constructor(private _http: HttpClient) {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      this._user.set(JSON.parse(savedUser));
    } else if (savedToken) {
      this._http.get<User>(`${this._api}/me`).subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this._user.set(user);
        },
        error: () => this.logout(),
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hydrateFromStorage(): void {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      this._user.set(JSON.parse(savedUser));

      return;
    }
    if (savedToken) {
      this._http.get<User>(`${this._api}/me`).subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this._user.set(user);
        },
        error: () => this._clearSession(),
      });
    }
  }

  isLoggedIn(): boolean {
    return !!this._user();
  }

  login(email: string, password: string) {
    return this._http
      .post<{
        token: string;
        user: User;
      }>(`${this._api}/login`, { email, password })
      .pipe(tap(({ token, user }) => this._setSession(token, user)));
  }

  logout(): void {
    this._clearSession();
  }

  register(name: string, email: string, password: string) {
    return this._http
      .post<{
        token: string;
        user: User;
      }>(`${this._api}/register`, {
        name,
        email,
        password,
      })
      .pipe(tap(({ token, user }) => this._setSession(token, user)));
  }

  private _clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user.set(null);
  }

  private _setSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._user.set(user);
  }
}
