import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register-document',
  templateUrl: './register-document.page.html',
  styleUrls: ['./register-document.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterDocumentPage implements OnInit {
  formDocument!: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formDocument =  this.formBuilder.group({
      name: [''],
      email:[''],
      login: [''],
      telefone:['']
    })
  }

  onSubmit() {
    console.log(this.formDocument.value)
  }
}
