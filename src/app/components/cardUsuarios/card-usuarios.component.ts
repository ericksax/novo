import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonItem,
  IonList,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle
} from '@ionic/angular/standalone';
import { catchError } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UserResponse, usersResponse } from 'src/app/types/user-request';
@Component({
  selector: 'app-card-usuarios',
  standalone: true,
  templateUrl: './card-usuarios.component.html',
  styleUrls: ['./card-usuarios.component.scss'],
  imports: [
    IonButton,
    IonCard,
    IonList,
    IonItem,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle
  ]
})
export class CardUsuariosComponent  implements OnInit {

  @Input() user!: UserResponse
  @Output() deleteUserEvent = new EventEmitter<number>()

  constructor(private userService: UserService) { }

  ngOnInit() {
    return null
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).pipe(
      catchError(error => {
        console.error(error)
        throw new Error('Ocorreu um erro')
      })
    ).subscribe(
      result =>  {
        this.handleDeleteUser()
      },
    )
  }

  handleDeleteUser() {
    this.deleteUserEvent.emit()
  }

  editUser(userId: number){
    console.log(userId)
  }

}
