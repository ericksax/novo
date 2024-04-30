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

  updateDocument(data: any, id: string) {
    const {baseApiUrl} = environment;
    return this.httpClient.post(`${baseApiUrl}/documents/${id}`, data)
  };

  readDocument(documentId: string): Observable<DocumentResponse> {
    const {baseApiUrl} = environment;
    return this.httpClient.get<DocumentResponse>(`${baseApiUrl}/documents/${documentId}`)
  }

  readDocumentByKey(chave: string) {
    const {baseApiUrl} = environment;
    return this.httpClient.get<DocumentResponse>(`${baseApiUrl}/documents?chave=${chave}`)
  }

}
