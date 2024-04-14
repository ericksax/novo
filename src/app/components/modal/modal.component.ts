import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonModal, IonHeader, IonList,IonImg, IonToolbar, IonTitle, IonContent, IonMenuButton, IonMenu, IonButton, IonButtons, IonItem, IonIcon, IonCard, IonCardContent, IonInput, IonSelect, IonSelectOption
} from '@ionic/angular/standalone'
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [IonModal,IonImg, IonHeader, IonList, IonButton, IonContent, IonToolbar, IonTitle, IonMenuButton, IonMenu, IonButtons, IonItem, IonIcon, IonCard, IonCardContent, IonInput, IonSelect, IonSelectOption]
})
export class ModalComponent  implements OnInit {
  imageUrl!: string;
  @ViewChild(IonModal)
  modal!: IonModal;
  formSendPhoto! : FormGroup;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';


  constructor() { }

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
    this.modal.dismiss('confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
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
}
