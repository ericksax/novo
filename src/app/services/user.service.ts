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
    const { baseApiUrl } = environment;
    return this.httpClient.post(`${baseApiUrl}/createUser.php`, userRequest, {observe: 'response'});
  }

  showUsers() {
    const { baseApiUrl } = environment;
    return this.httpClient.get<UserResponse[]>(`${baseApiUrl}/showUsers.php`)
  }

  deleteUser(userId: number) {
    const { baseApiUrl } = environment;
    return this.httpClient.delete(`${baseApiUrl}/deleteUser.php`, {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: userId })
    })
  }

  updateUser(userId: number, userRequest: UserRequest) {
    const { baseApiUrl } = environment;
    const data = {
      id: userId,
      usuario: userRequest.usuario,
      cpfcnpj: userRequest.cpfcnpj,
      nome_completo: userRequest.nome_completo,
      telefone: userRequest.telefone
    }
    return this.httpClient.put(`${baseApiUrl}/updateUser.php`, data, {
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  retrieveOne(id: number) {
    const { baseApiUrl } = environment;
    return this.httpClient.post<UserResponse>(`${baseApiUrl}/retrieveUser.php`, { id })
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
