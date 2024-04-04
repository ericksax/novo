import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import {
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
  ],
})
export class HomePage implements OnInit{
  isSupported = false;
  barcodes: Barcode[] = [];
  valueInput = '';

  constructor(private route: Router, private alertController: AlertController) {}

  goToLogin() {
    this.route.navigate(['/login']);
  }

  goToRegister() {
    this.route.navigate(['/register']);
  }

  goToRegisterDocument() {
    this.route.navigate(['/register-document']);
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
    this.valueInput = ""
    this.valueInput = barcodes[0].displayValue;
    console.log(barcodes);
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
  }
}
