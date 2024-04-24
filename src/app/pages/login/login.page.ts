import { Component, OnInit, signal } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { presentToast } from '../../helpers/toast'
import { Observable, catchError, of } from 'rxjs';
import { LoginResponse } from 'src/app/types/login-response.type';
import { User } from 'src/app/types/user-request';
import { ToastController } from '@ionic/angular';
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

  readonly userSignal = signal<User | null>(null);

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.loginForm = new FormGroup({
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(14),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  async ngOnInit() {
    console.log(this.userSignal())
    if(this.loginService.isLogged()) {
      this.router.navigate(['/home']);
    }
  }

  submit() {
    const { password, login } = this.loginForm.value;

    this.loginService
      .login(login, password)
      .pipe(
        catchError((error, caught: Observable<LoginResponse>) => {
          if (error.status === 401) {
            presentToast(this.toastController, 'top', 'Login ou senha inválidos!!', 'danger');
          } else if (error.status === 404) {
            presentToast(this.toastController, 'top', 'Usuario não encontrado!!', 'danger');
          } else {
            presentToast(
              this.toastController,
              'top',
              'Ocorreu um erro. Tente novamente mais tarde.',
              'danger'
            );
          }
          return of(null);
        })
      )
      .subscribe((result: LoginResponse | null) => {
        if (result && result.token) {
          presentToast(this.toastController, 'top', 'Usuário logado com sucesso!!', 'success');
          this.loginService.setToken(result.token);
          this.loginService.setUser(result.user);
          this.userSignal.set(result.user);
          this.router.navigate(['/home']);
        }
      });
      this.loginForm.reset();
  }
}
