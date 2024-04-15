export type UserRequest = {
  login: string;
  password: string;
  name: string;
  phone: string;
}

export type UserResponse = {
  id: number;
  name: string;
  login: string;
  phone: string;
}


export type usersResponse = {
  users: UserResponse[]
}
