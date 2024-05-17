import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import {  DocumentResponse } from "../types/document.type";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private httpClient: HttpClient ) { }

  updateDocument(data: any) {
    const {baseApiUrl} = environment;
    return this.httpClient.post(`${baseApiUrl}/updateDocument.php`, data)
  };

  readDocument(documentId: string): Observable<DocumentResponse> {
    const id = parseInt(documentId)
    const {baseApiUrl} = environment;
    return this.httpClient.post<DocumentResponse>(`${baseApiUrl}/retrieveDocument.php`, {
        id: id
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

  readDocumentByKey(chave: string) {
    const {baseApiUrl} = environment;
    return this.httpClient.post<DocumentResponse>(`${baseApiUrl}/retrieveDocumentByNFKey.php`, {
      chave_acesso: chave
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}
