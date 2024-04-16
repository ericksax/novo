import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DocumentService } from '../../services/document.service'
import {
  IonModal,
  IonHeader,
  IonList,
  IonImg,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonMenu,
  IonButton,
  IonButtons,
  IonItem,
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonModal,IonImg, IonHeader, IonList, IonButton, IonContent, IonToolbar, IonTitle, IonMenuButton, IonMenu, IonButtons, IonItem, IonIcon, IonCard, IonCardContent, IonInput, IonSelect, IonSelectOption]
})
export class ModalComponent  implements OnInit {
  formSendPhoto! : FormGroup;
  @Input() documentId!: string
  imageUrl!: string;
  imagePath: any;
  @ViewChild(IonModal) modal!: IonModal;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';


  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.formSendPhoto = new FormGroup({
      name: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
      photo: new FormControl('', [Validators.required]),
    })
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss({
      image_url: this.imageUrl,
      recebedor_nome: this.formSendPhoto.value.name,
      image_path: this.imagePath,
      recebedor_documento: this.formSendPhoto.value.document},
      'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log(ev.detail.data)
      this.documentService.updateDocument(ev.detail.data, this.documentId).pipe(
        catchError(error => {
          console.error(error)
          throw new Error('Ocorreu um erro')
        })
      ).subscribe (
        result => console.log(result),
      )
    }
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      promptLabelPicture: 'Tirar foto',
      promptLabelPhoto: 'Carregar imagem',
      promptLabelCancel: 'Cancelar',
      promptLabelHeader: 'Selecione uma opção',
      presentationStyle: 'popover',
    });


    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    this.imageUrl = image.webPath!;


    // Can be set to the src of an image now
  };

  sendImage() {
      this.modal.dismiss({
        image_url: this.imageUrl,
        image_path: this.imagePath,
        recebedor_nome: this.formSendPhoto.value.name,
        recebedor_documento: this.formSendPhoto.value.document},
        'confirm');
  };
}
