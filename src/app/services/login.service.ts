import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../types/login-response.type';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(login: string, senha: string) {
    return this.httpClient.post<LoginResponse>('/login', {login, senha}).pipe(
      tap((value) => {
        sessionStorage.setItem('@tokenLoginStub', value.token)
        sessionStorage.setItem('@usernameLoginStub', value.username)
      })
    )
  }
}
