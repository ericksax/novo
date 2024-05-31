import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { DocumentResponse } from 'src/app/types/document.type';
import {
  IonList,
  IonCol,
  IonRow,
  IonInput,
  IonListHeader,
  IonItem,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonThumbnail,
  IonButton,
  IonImg,
  IonLabel,

} from '@ionic/angular/standalone'
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-document-info',
  standalone: true,
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.scss'],
  imports: [
    IonLabel,
    IonList,
    IonCol,
    IonRow,
    IonInput,
    IonListHeader,
    IonItem,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonThumbnail,
    IonButton,
    IonImg,
    ModalComponent
  ]
})
export class DocumentInfoComponent  implements OnInit {
  @Input() document: DocumentResponse = {} as DocumentResponse;
  @Input() dataEntrega: string = '';
  @Input() canOpenModal!: boolean;
  @Input() updateComplete!: boolean;
  @Input() handleUpdateDocument!: () => void;
  @Output() clearInputCode = new EventEmitter();

  constructor() { }

  clearData() {
    this.document.iddocumento = ''
    this.document = {} as DocumentResponse
    this.clearInputCode.emit()
  }
  ngOnInit() {
    return null
  }
}
