import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { catchError, of } from 'rxjs';
import { presentToast } from 'src/app/helpers/toast';
import { ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonList,
  IonButton
} from '@ionic/angular/standalone';
import { UserResponse } from 'src/app/types/user-request';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonItem,
    IonList,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})

export class EditUserPage implements OnInit {
  formEdit!: FormGroup;
  userId!: number;
  user: UserResponse = {} as UserResponse;

  constructor(
    private userService: UserService,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.formEdit = new FormGroup({
      nome_completo: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      usuario: new FormControl('', [Validators.required]),
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.userId = Number(params.get('id'));
    });

    this.userService.retrieveOne(this.userId)?.subscribe((result: any) => {
      this.formEdit.setValue({
        nome_completo: result.nome_completo,
        telefone: result.telefone,
        usuario: result.usuario,
      })

      this.user = result;
    })
  }

  submit() {

    this.userService
      .updateUser(this.userId, this.formEdit.value)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((result: any) => {
        if (result.message === "Usário atualizado com sucesso") {
          presentToast(
            this.toastController,
            'top',
            'Usário atualizado com sucesso',
            'success'
          );
        } else if (result.status === 404) {
          presentToast(
            this.toastController,
            'top',
            'Usuario não encontrado',
            'danger'
          );
        } else {
          presentToast(
            this.toastController,
            'top',
            'Ocorreu um erro. Tente novamente mais tarde',
            'danger'
          );
        }
      });
  }
}
