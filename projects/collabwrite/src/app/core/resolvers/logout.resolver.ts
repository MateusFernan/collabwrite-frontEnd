import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const logoutResolver: ResolveFn<boolean> = () => {
  inject(AuthService).logout();
  return true;
};
