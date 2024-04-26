import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { environment } from 'src/environments/environment';
import { User } from '../types/user-request';
import { Observable, catchError, of } from 'rxjs';
import { presentToast } from '../helpers/toast';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})

export class LoginService {
  readonly userSignal = signal<User | null>(null);

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController,
    private router: Router
  ) {}

  login(login: string, password: string) {
    const data = {
      usuario: login,
      senha: password
    }
    const { baseApiUrl } = environment

    return this.httpClient.post<LoginResponse>(`${baseApiUrl}/login`, JSON.stringify(data))
    .pipe(
      catchError((error, caught: Observable<LoginResponse>) => {
        if (error.status === 401) {
          presentToast(this.toastController, 'top', 'Login ou senha inválidos!!', 'danger');
        } else if (error.status === 404) {
          presentToast(this.toastController, 'top', 'Usuario não encontrado!!', 'danger');
        } else {
          presentToast(
            this.toastController,
            'top',
            'Ocorreu um erro. Tente novamente mais tarde.',
            'danger'
          );
        }
        return of(null);
      }),
    ).subscribe((result) => {
      if (result && result.token) {
        this.userSignal.set(result.user)
        this.setToken(result.token)
        this.setUser(result.user)
        this.router.navigate(['/home'])
      } 
    })
  }

  getUser() {
    return this.userSignal()
  }

  setToken(token: string) {
    localStorage.setItem('@D&CToken', token)
  }

  setUser(user: any) {
    localStorage.setItem('@D&CUser', JSON.stringify(user))
  }

  getToken() {
    return localStorage.getItem('@D&CToken')
  }

  removeToken() {
    localStorage.removeItem('@D&CToken')
  }

  removeUser() {
    localStorage.removeItem('@D&CUser')
  }

  hasToken() {
    return !!this.getToken()
  }

  isLogged() {
    return this.hasToken()
  }

  logout() {
    this.removeToken()
    this.removeUser()
  }

  isAdmin(token: string | null ) {
    const decoded = this.getDecodedAccessToken(token)
    if(decoded) {
      return decoded.admin
    }
  }

  getTokenExpirationDate(token: string) {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (decoded.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string | null): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;
    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date!.valueOf() > new Date().valueOf());
  }

  getDecodedAccessToken(token: string | null): any {
    try {
      return JSON.parse(atob(token!.split('.')[1]));
    } catch(Error) {
      return null;
    }
  }
}
