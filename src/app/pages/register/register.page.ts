import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { MaskitoDirective} from '@maskito/angular';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';
import { Observable, catchError, of } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, MaskitoDirective]
})

export class RegisterPage implements OnInit {
  quantity: string = ''
  registerForm!: FormGroup
  maskitoOptions!: MaskitoOptions
  component = HomePage

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastController: ToastController, private router: Router) {
   }

   ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      login: new FormControl('', [Validators.required, Validators.minLength(14), Validators.maxLength(18)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(11)])
    }, {
      validator: this.passwordMatchValidator
    })
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')!.value;
    const confirmPassword = control.get('confirmPassword')!.value;
      if (password !== confirmPassword) {
        control.get('confirmPassword')!.setErrors({ passwordMatch: true });
        return { passwordMatch: true };
      } else {
        return null; // Retornar null quando as senhas coincidem
      }
  }

  readonly maskitoPhoneOptions: MaskitoOptions = {
      mask: ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    };

  //essa função serve para mudar o formato do campo(máscara) de acordo com o tipo de documento
  changeMaskCpfAndCnpj() {
   return  this.quantity.length > 13 ? {
      mask:  [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    } : {
      mask:  [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    };
  }

  onLoginChange(event: any){
    this.quantity = event.target.value
    this.maskitoOptions = this.changeMaskCpfAndCnpj()
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    type: 'danger' | 'success'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: type,
      position: position,
    });

    await toast.present();
  }

  onSubmit(event: any) {
    event.preventDefault();
    const {name, login, password, phone} = this.registerForm.value
    try {
      this.userService.create({
        name,
        login,
        password,
        phone
      }).pipe(
        catchError((error, caught: Observable<any>) => {
            if (error.status === 409) {
              this.presentToast('top', 'Usuário já existe!!', 'danger');
            } else {
              this.presentToast(
                'top',
                'Ocorreu um erro. Tente novamente mais tarde.',
                'danger'
              );
            }
            return of(null);
          }),

      ).subscribe( (result: any) => {
          if(result.status === 201) {
            this.presentToast('top', 'Usário criado com sucesso!!', 'success');
          }
        },
      )
    } catch (error) {
      this.presentToast('top', 'Erro interno, tente novamente!!', 'danger')
    }
      this.registerForm.reset();
  };

  readonly predicate: MaskitoElementPredicate = async (element) => {
    return (element as HTMLIonInputElement).getInputElement();
  }
}
