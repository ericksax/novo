import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FretesService {
  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  constructor(private http: HttpClient ) {}

  private handleError(error: any) {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro de rede ou erro no lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro na resposta da API
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
    }

    // Exibir ou logar o erro
    console.error(errorMessage);

    // Retorna um Observable com erro para o fluxo de dados
    return throwError(() => new Error(errorMessage));
  }

  getFretes(versao: {versao: string}) {
    const  { baseApiFretes } = environment
    return this.http.post(`${baseApiFretes}/listaFretesEmAberto3.php`, versao, {headers: this.headers})
      .pipe(
        retry(2),
        catchError(this.handleError)
    )
  }
}
