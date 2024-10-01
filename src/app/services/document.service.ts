import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';
import { DocumentResponse } from "../types/document.type";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private httpClient: HttpClient ) { }

  updateDocument(data: any) {
    console.log(data)
    const {baseApiUrl} = environment;
    return this.httpClient.post(`${baseApiUrl}/updateDocument.php`, data)
  };

  readDocument(documentId: string): Observable<DocumentResponse | null> | null {
  const {baseApiUrl} = environment;

  return this.httpClient.post<DocumentResponse>(`${baseApiUrl}/retrieveDocument.php`, {
      id: documentId
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
