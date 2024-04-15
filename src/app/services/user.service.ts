import { Injectable } from "@angular/core";
import { UserRequest } from "../types/user-request";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable ({
  providedIn: 'root'
})

export class UserService {

  constructor(private httpClient: HttpClient) {}

  create(userRequest: UserRequest) {
    const { baseApiUrl } = environment;
    return this.httpClient.post(`${baseApiUrl}/users`, userRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
