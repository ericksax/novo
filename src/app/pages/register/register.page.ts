import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { MaskitoDirective} from '@maskito/angular';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
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

  onSubmit(event: any) {
    event.preventDefault();
    try {
      this.userService.create({
        name: this.registerForm.value.name,
        login: this.registerForm.value.login,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone
      }).subscribe(
        result => console.log(result)
      )
      alert('Cadastrado com sucesso')
    } catch (error) {
      console.log(error)
    }

  };

  readonly predicate: MaskitoElementPredicate = async (element) => {
    return (element as HTMLIonInputElement).getInputElement();
  }
}
