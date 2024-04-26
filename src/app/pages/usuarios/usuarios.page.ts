import { Component, OnInit, Signal, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { CardUsuariosComponent } from 'src/app/components/cardUsuarios/card-usuarios.component';
import { UserService } from 'src/app/services/user.service';
import { catchError } from 'rxjs';
import { UserResponse } from 'src/app/types/user-request';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    CardUsuariosComponent
   ]
})
export class UsuariosPage implements OnInit {
  users: WritableSignal<UserResponse[] | null> = signal(null)

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    this.userService.showUsers().pipe(
      catchError(error => {
        console.error(error)
        throw new Error('Ocorreu um erro')
      })
    ).subscribe(
      result =>  {
        this.users.set(result)
      },
    )
  };

  onDeleteUser() {
    this.getUsers()
  }
}
