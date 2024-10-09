import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';
import { DocumentInfoComponent } from '../../components/document-info/document-info.component';
import { DocumentResponse } from 'src/app/types/document.type';
import { DocumentService } from 'src/app/services/document.service';
import { catchError } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SideMenuComponent } from 'src/app/components/side-menu/side-menu.component';
import { CommonModule } from '@angular/common';
import { presentToast } from 'src/app/helpers/toast';
import { EmptyDocumentComponent } from 'src/app/components/empty-document/empty-document.component';
import { EventService } from 'src/app/services/event.service';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerAndroidScanningLibrary,
} from '@capacitor/barcode-scanner';

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
  IonThumbnail,
  IonSpinner,
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
    IonSpinner,
    DocumentInfoComponent,
    SideMenuComponent,
    EmptyDocumentComponent,
    CommonModule,
  ],
})
export class HomePage implements OnInit {
  barcodes: any[] = [];
  modal!: IonModal;
  dataEntrega!: string;
  valueInput: string = '';
  nfKey!: string;

  qrValue: string = '';
  NFvalue: string = '';

  document: DocumentResponse = {} as DocumentResponse;

  canOpenModal!: boolean;
  updateComplete!: boolean;

  isLoading!: boolean;

  constructor(
    private route: Router,
    private alertController: AlertController,
    private documentService: DocumentService,
    private loginService: LoginService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    if (!this.loginService.isLogged()) this.route.navigate(['/login']);

    this.eventService.documentUpdate$.subscribe((updateDocument) => {
      this.document = updateDocument;

      if (this.nfKey) {
        this.sendCodeToApiByKey();
      }

      this.sendCodeToApi();
    });
  }

  async scan(): Promise<void> {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      cameraDirection: 1,
      hint: 17,
      android: {
        scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.ZXING,
      },
    });

    if (result.ScanResult) {
      this.barcodes.push(result.ScanResult);
      this.nfKey = '';
      this.nfKey = result.ScanResult.trim();
      this.sendCodeToApiByKey();
    }
  }

  async scanQrCode(): Promise<void> {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      cameraDirection: 1,
      hint: 17,
      android: {
        scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.ZXING,
      },
    });

    if (result.ScanResult) {
      this.barcodes.push(result.ScanResult);
      this.valueInput = '';
      this.valueInput = result.ScanResult.trim();
      this.sendCodeToApi();
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendCodeToApi();
    }
  }

  onKeyUpByKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendCodeToApiByKey();
    }
  }

  sendCodeToApi() {
    this.isLoading = true;
    if (this.valueInput) this.qrValue = this.valueInput;
    this.documentService
      .readDocument(this.qrValue)!
      .pipe(
        catchError((error) => {
          if (error.status === 404 || error.message === 'Document not found') {
            this.document = {} as DocumentResponse;
            presentToast('O documento não foi encontrado', 'short', 'top');
            this.isLoading = false;
          }

          presentToast(
            'Ocorreu um erro. Verifique o código ou chave e tente novamente.',
            'short',
            'top'
          );
          this.document = {} as DocumentResponse;
          this.isLoading = false;
          throw new Error('Ocorreu um erro ao ler o documento');
        })
      )
      .subscribe((result) => {
        this.document = result as DocumentResponse;

        this.dataEntrega = Intl.DateTimeFormat('pt-BR').format(
          new Date(this.document.data_atualizacao)
        );

        if (this.document.iddocumento !== '') {
          this.canOpenModal = true;
        } else {
          this.canOpenModal = false;
        }

        if (this.document.recebedor_nome && this.document.recebedor_documento) {
          this.updateComplete = true;
        } else {
          this.updateComplete = false;
        }

        this.isLoading = false;
        this.valueInput = '';
      });
  }

  sendCodeToApiByKey() {
    this.isLoading = true;
    if (this.nfKey) this.NFvalue = this.nfKey;
    this.documentService
      .readDocumentByKey(this.NFvalue)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            this.isLoading = false;
            this.document = {} as DocumentResponse;
            presentToast('O documento não foi encontrado', 'short', 'top');
          }

          presentToast(
            'Ocorreu um erro. Verifique o código ou chave e tente novamente.',
            'short',
            'top'
          );
          this.isLoading = false;
          this.document = {} as DocumentResponse;
          throw new Error('Ocorreu um erro');
        })
      )
      .subscribe((result) => {
        this.document = result;
        this.dataEntrega = Intl.DateTimeFormat('pt-BR').format(
          new Date(this.document.data_atualizacao)
        );

        if (this.document.iddocumento !== '') {
          this.canOpenModal = true;
        } else {
          this.canOpenModal = false;
        }

        if (this.document.recebedor_nome && this.document.recebedor_documento) {
          this.updateComplete = true;
        } else {
          this.updateComplete = false;
        }

        this.isLoading = false;
        this.nfKey = '';
      });
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permissão negada',
      message: 'Por favor, permita o acesso a camera.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  changeValueInput(event: any) {
    const { value } = event.target;
    this.valueInput = value.trim();

    if (!this.valueInput) {
      this.document = {} as DocumentResponse;
      this.isLoading = false;
    }
  }

  changeValueInputKey(event: any) {
    const { value } = event.target;
    this.nfKey = value.trim();

    if (!this.nfKey) {
      this.document = {} as DocumentResponse;
      this.isLoading = false;
    }
  }

  handleUpdateDocument() {
    if (this.valueInput !== '') {
      this.sendCodeToApi();
    }
    this.sendCodeToApiByKey();
  }

  handleClearCode() {
    this.nfKey = '';
    this.valueInput = '';
    this.document = {} as DocumentResponse;
  }
}
