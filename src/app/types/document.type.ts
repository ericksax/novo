export type DocumentResponse = {
  iddocumento: string;
  idusuario_transportadora: string;
  numero_documento: string;
  chave_acesso: string;
  nome_destinatario: string;
  cpf_destinatario: string;
  cnpj_destinatario: string;
  end_logradouro: string;
  end_numero: string;
  end_complemento: string;
  end_cidade: string;
  end_bairro: string;
  end_cep: string;
  recebedor_nome: string;
  recebedor_documento: string;
  data_cadastro: string;
  data_atualizacao: string;
  foto_canhoto: string;
  nome_completo: string;
  telefone: string;
  tel_destinatario: string;
  uf_destinatario: string;
};

export type DocumentRequestUpdateImage = {
  imageUrl: string;
  recipient_document: string;
  recipient_name: string;
};
