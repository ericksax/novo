import { Component, OnInit, signal } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { presentToast } from '../../helpers/toast'
import { Observable, catchError, of } from 'rxjs';
import { LoginResponse } from 'src/app/types/login-response.type';

import {
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
} from '@ionic/angular/standalone';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  providers: [LoginService],
  imports: [
    IonContent,
    ReactiveFormsModule,
    NgIf,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonInput,
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  password: string = '';
  login: string = '';



  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {
    this.loginForm = new FormGroup({
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(3),

      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  async ngOnInit() {
    if(this.loginService.isLogged()) {
      this.router.navigate(['/home']);
    }
  }

  submit() {
    const { password, login } = this.loginForm.value;

    this.loginService
      .login(login, password)
    
  
      this.loginForm.reset();
  }
}
