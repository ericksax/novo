import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

class PermissionsService {
  constructor(private router: Router) { };
  canActivate(token: string | null ): boolean {
   const isAdmin = inject(LoginService).isAdmin(token);

    if(!isAdmin) {
      this.router.navigate(['/not-authorized']);
      return false
    }
    return true
  }
 }

export const isAdmin: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate(inject(LoginService).getToken());
};
