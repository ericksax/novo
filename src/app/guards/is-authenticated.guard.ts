import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
class PermissionsService {
  canActivate(token: string | null): boolean {
   const isExpired =  inject(LoginService).isTokenExpired(token)

    if(isExpired) return false

    return true
  }
 }

export const isAuthenticated: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate(inject(LoginService).getToken());
};
