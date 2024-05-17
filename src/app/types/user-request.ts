export type UserRequest = {
  usuario: string;
  senha: string;
  nome_completo: string;
  telefone: string;
  cpfcnpj: string;
}

export type UserResponse = {
  idusuario_transportadora: number;
  nome_completo: string;
  usuario: string;
  telefone: string;
  cpfcnpj: string;
}

export type User = {
  id: number;
  name: string;
  login: string;
}

export type usersResponse = {
  users: UserResponse[]
}
