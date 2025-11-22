import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService, User } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};

    spyOn(localStorage, 'getItem').and.callFake(
      (key: string): string | null => store[key] ?? null
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string): void => {
        store[key] = value;
      }
    );
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
  });

  function createService(): AuthService {
    return TestBed.inject(AuthService);
  }

  it('deve começar deslogado quando não há token nem user nos storage', () => {
    const service = createService();

    expect(service.isLoggedIn()).toBeFalse();
  });

  it('get token deve ler local storage', () => {
    store['token'] = 'token fake';

    const service = createService();

    expect(service.getToken()).toBe('token fake');
  });

  it('hydrateFromStorage deve setar o user quando token e user existirem no storage', () => {
    const mockUser: User = {
      id: 1,
      name: 'user',
      email: 'user@gmail.com',
    };
    store['token'] = 'token-salvo';
    store['user'] = JSON.stringify(mockUser);

    const service = createService();

    service.hydrateFromStorage();

    expect(service.isLoggedIn()).toBeTrue();
  });
});
