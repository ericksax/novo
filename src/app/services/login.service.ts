import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(login: string, password: string) {
    const { baseApiUrl } = environment
    return this.httpClient.post<LoginResponse>(`${baseApiUrl}/login`, JSON.stringify({login, password}))
  }

  setToken(token: string) {
    localStorage.setItem('@D&CToken', token)
  }

  getToken() {
    return localStorage.getItem('@D&CToken')
  }

  removeToken() {
    localStorage.removeItem('@D&CToken')
  }

  hasToken() {
    return !!this.getToken()
  }

  isLogged() {
    return this.hasToken()
  }

  logout() {
    this.removeToken()
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

  getDecodedAccessToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch(Error) {
      return null;
    }
  }


}
