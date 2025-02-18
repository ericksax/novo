import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component'
@Component({
  selector: 'app-document',
  templateUrl: './document.page.html',
  styleUrls: ['./document.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent]
})
export class DocumentPage implements OnInit {
  documentForm! : FormGroup
  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.documentForm = this.formBuilder.group({
      tipo: new FormControl( '', [Validators.required]),
      destinatario :new FormControl( '', [Validators.required]),
      login: new FormControl( '', [Validators.required]),
      rua: new FormControl( '', [Validators.required]),
      numero: new FormControl( '', [Validators.required]),
      telefone: new FormControl( '', [Validators.required]),
      cep: new FormControl( '', [Validators.required]),
      cidade: new FormControl( '', [Validators.required]),
      uf: new FormControl( '', [Validators.required]),
    })
  }

  onSubmit(event: any) {
    event.preventDefault();
    console.log(this.documentForm.value)
  }
}
