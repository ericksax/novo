export type UserRequest = {
  login: string;
  password: string;
  name: string;
  phone: string;
}

export type UserResponse = {
  idusuario_transportadora: number;
  nome_completo: string;
  usuario: string;
  telefone: string;
}

export type User = {
  id: number;
  name: string;
  login: string;
}

export type usersResponse = {
  users: UserResponse[]
}
