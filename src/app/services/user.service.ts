import { Injectable } from "@angular/core";
import { UserRequest, UserResponse } from "../types/user-request";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable ({
  providedIn: 'root'
})

export class UserService {

  constructor(private httpClient: HttpClient) {}

  create(userRequest: UserRequest) {
    const data = {
      usuario: userRequest.login,
      senha: userRequest.password,
      nome_completo: userRequest.name,
      telefone: userRequest.phone
    }
    const { baseApiUrl } = environment;
    return this.httpClient.post(`${baseApiUrl}/users`, data);
  }

  showUsers() {
    const { baseApiUrl } = environment;
    return this.httpClient.get<UserResponse[]>(`${baseApiUrl}/users`)
  }

  deleteUser(userId: number) {
    const { baseApiUrl } = environment;
    return this.httpClient.delete(`${baseApiUrl}/users/${userId}`)
  }

  retrieve() {
    const { baseApiUrl } = environment;
    const token = localStorage.getItem('@D&CToken')
    const user = JSON.parse(localStorage.getItem('@D&CUser')!)

    if(!token || !user) {
      return null
    }

    return this.httpClient.get<UserResponse>(`${baseApiUrl}/users/${user.id}`)
  }
}
