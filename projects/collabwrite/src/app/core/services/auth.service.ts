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
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      this._user.set(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>(`${this.api}/login`, { email, password }).pipe(
      tap(({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this._user.set(user);
      })
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post<User>(`${this.api}/register`, { name, email, password });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user.set(null);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this._user();
  }
}
