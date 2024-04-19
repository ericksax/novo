import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';
import { formatDistance} from 'date-fns'
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonContent,
  IonMenuButton,
  IonMenu,
  IonButton,
  IonButtons,
  IonItem,
  IonIcon,
  IonList,
  IonRow,
  IonInput,
  IonListHeader,
  IonCard,
  IonCardContent,
  IonCol,
  IonSelectOption,
  IonSelect,
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonThumbnail



} from '@ionic/angular/standalone';
import { DocumentResponse } from 'src/app/types/document.type';
import { DocumentService } from 'src/app/services/document.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonMenu,
    IonButtons,
    IonList,
    IonRow,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    IonInput,
    IonListHeader,
    IonCard,
    IonCardContent,
    IonCol,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonImg,
    ModalComponent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonThumbnail

  ],
})
export class HomePage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  valueInput: string = '';
  modal!: IonModal;
  dataEntrega!: string

  document: DocumentResponse = {
    atualizado_em: '',
    criado_em: '',
    documento_nome: '',
    documento_tipo: '',
    id: '',
    id_usuario: '',
    recebedor_cep: '',
    recebedor_cidade: '',
    recebedor_documento: '',
    recebedor_nome: '',
    recebedor_numero: '',
    recebedor_rua: '',
    recebedor_telefone: '',
    recebedor_uf: ''

  } as DocumentResponse;

  canOpenModal!: boolean;
  updateComplete!: boolean;

  constructor(
    private route: Router,
    private alertController: AlertController,
    private documentService: DocumentService
  ) {

  }

  goToLogin() {
    this.route.navigate(['/login']);
  }

  goToRegister() {
    this.route.navigate(['/register']);
  }

  goToDocument() {
    this.route.navigate(['/document']);
  }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();

    this.barcodes.push(...barcodes);
    this.valueInput = '';
    this.valueInput = barcodes[0].displayValue;
    if (barcodes[0].displayValue) {
      this.sendCodeToApi()
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendCodeToApi()
    }
  }

  sendCodeToApi() {
    this.documentService.readDocument(this.valueInput).pipe(
      catchError(error => {
        console.error(error)
        throw new Error('Ocorreu um erro')
      })
    ).subscribe(
      result =>  {
        this.document = result

        this.dataEntrega = Intl.DateTimeFormat('pt-BR').format(new Date(this.document.atualizado_em))

        if(this.document.id !== '') {
          this.canOpenModal = true
        } else {
          this.canOpenModal = false
        }

        if(this.document.recebedor_nome && this.document.recebedor_documento ) {
          this.updateComplete = true
        } else {
          this.updateComplete = false
        }
      },
    )
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  };

  changeValueInput(event: any) {
    this.valueInput = event.target.value;
  }

  handleUpdateDocument() {
    this.sendCodeToApi()
  }
}
