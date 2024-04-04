import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup
  component = HomePage

  constructor(private formBuilder: FormBuilder) {

   }

   ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      login: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]),
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

}
