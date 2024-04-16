import { Component } from '@angular/core';
import { IonContent, IonItem, IonLabel, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  providers: [
    LoginService
  ],
  imports: [IonContent, ReactiveFormsModule, NgIf, IonItem, IonLabel, IonIcon, IonButton, IonInput]
})

export class LoginPage {
  loginForm!: FormGroup
  password: string = ""
  login: string = ""

  constructor(private loginService: LoginService, private router: Router, private toastController: ToastController) {
    this.loginForm = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, type: 'danger' | 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      color: type,
      position: position,
    });

    await toast.present();
  }

  submit() {
    const {password, login} = this.loginForm.value

    try {
        this.loginService.login(login, password).subscribe(
        result => {
          this.loginService.setToken(result.token);
          this.router.navigate(['/home']);
          this.presentToast('top', 'Usuário logado com sucesso!!', 'success');
        },
        error => {
          this.presentToast('top', 'Login ou senha inválidos!!', 'danger');
          console.log(error);
        }
      )
      this.router.navigate(['/home'])
    } catch (error) {
      this.presentToast('top', 'login ou senha inválidos!!', 'danger')
      console.log(error)
    }
  }
}


