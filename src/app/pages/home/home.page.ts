import { Component, OnInit} from '@angular/core';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';
import { DocumentInfoComponent } from '../../components/document-info/document-info.component';
import { DocumentResponse } from 'src/app/types/document.type';
import { DocumentService } from 'src/app/services/document.service';
import { catchError } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SideMenuComponent } from 'src/app/components/side-menu/side-menu.component';
import { CommonModule } from '@angular/common';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonContent,
  IonMenuButton,
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
    IonSelect,
    IonSelectOption,
    IonImg,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonThumbnail,
    RouterLink,
    RouterLinkActive,
    ModalComponent,
    DocumentInfoComponent,
    SideMenuComponent,
    CommonModule
  ],
})
export class HomePage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  valueInput: string = '';
  modal!: IonModal;
  dataEntrega!: string
  nfKey!: string

  document: DocumentResponse = {} as DocumentResponse;

  canOpenModal!: boolean;
  updateComplete!: boolean;

  constructor(
    private route: Router,
    private alertController: AlertController,
    private documentService: DocumentService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    if(!this.loginService.isLogged()) this.route.navigate(['/login']);
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();

    this.barcodes.push(...barcodes);
    this.nfKey = '';
    this.nfKey = barcodes[0].displayValue;


    if (this.nfKey) {
      this.sendCodeToApiByKey()
    }
  }

  async scanQrCode(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();

    this.barcodes.push(...barcodes);
    this.valueInput = '';
    this.valueInput = barcodes[0].displayValue;

    if (this.valueInput) {
      this.sendCodeToApi()
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendCodeToApi()
    }
  }

  onKeyUpByKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendCodeToApiByKey()
    }
  }

  sendCodeToApi() {

    this.documentService.readDocument(this.valueInput).pipe(
      catchError(error => {

        throw new Error('Ocorreu um erro')
      })
    ).subscribe(
      result =>  {
        this.document = result
        this.dataEntrega = Intl.DateTimeFormat('pt-BR').format(new Date(this.document.data_atualizacao))

        if(this.document.iddocumento!== '') {
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

  sendCodeToApiByKey() {
    this.documentService.readDocumentByKey(this.nfKey).pipe(
      catchError(error => {
        console.error(error)
        throw new Error('Ocorreu um erro')
      })
    ).subscribe(
      result =>  {
        this.document = result
        this.dataEntrega = Intl.DateTimeFormat('pt-BR').format(new Date(this.document.data_atualizacao))

        if(this.document.iddocumento!== '') {
          this.canOpenModal = true
        } else {
          this.canOpenModal = false
        }

        if(this.document.recebedor_nome && this.document.recebedor_documento ) {
          this.updateComplete = true
        } else {
          this.updateComplete = false
        }
      })
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
    const { value } = event.target
    this.valueInput = value.trim();

    if (!this.valueInput) {
      this.document = {} as DocumentResponse
    }
  }

  changeValueInputKey(event: any) {
    const { value } = event.target
    this.nfKey = value.trim();

    if (!this.nfKey) {
      this.document = {} as DocumentResponse
    }
  }

  handleUpdateDocument() {
    if(this.valueInput !== '') {
      this.sendCodeToApi()
    }
    this.sendCodeToApiByKey()
  }

  handleClearCode() {
    this.nfKey = ''
    this.valueInput = ''
    this.document = {} as DocumentResponse
  }
}
