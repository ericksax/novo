export type DocumentResponse = {
  atualizado_em: string;
  criado_em: string;
  documento_nome: string;
  documento_tipo: string;
  id: string;
  id_usuario: string;
  recebedor_cep: string;
  recebedor_cidade: string;
  recebedor_documento: string;
  recebedor_nome: string;
  recebedor_numero: string;
  recebedor_rua: string;
  recebedor_telefone: string;
  recebedor_uf: string;
};

export type DocumentRequestUpdateImage = {
  imageUrl: string;
  recipient_document: string;
  recipient_name: string;
};
