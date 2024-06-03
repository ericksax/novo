import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private documentUpdateSubject = new Subject<any>();
  documentUpdate$ = this.documentUpdateSubject.asObservable();

  constructor() { }

  emitDocumentUpdate(updateDocument: any) {
    this.documentUpdateSubject.next(updateDocument);
  }
}
