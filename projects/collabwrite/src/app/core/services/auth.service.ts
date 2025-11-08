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

  user = this._user.asReadonly();

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

  login(email: string, password: string) {
    return this._http
      .post<{
        token: string;
        user: User;
      }>(`${this._api}/login`, { email, password })
      .pipe(tap(({ token, user }) => this._setSession(token, user)));
  }

  register(name: string, email: string, password: string) {
    console.log(name, email, password);
    return this._http.post<User>(`${this._api}/register`, {
      name,
      email,
      password,
    });
  }
  logout(): void {
    this._clearSession();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this._user();
  }

  private _setSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._user.set(user);
  }

  private _clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user.set(null);
  }
}
