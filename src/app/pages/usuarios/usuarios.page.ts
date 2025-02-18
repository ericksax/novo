import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons} from '@ionic/angular/standalone';
import { CardUsuariosComponent } from 'src/app/components/cardUsuarios/card-usuarios.component';
import { UserService } from 'src/app/services/user.service';
import { catchError } from 'rxjs';
import { UserResponse } from 'src/app/types/user-request';
import { HeaderComponent } from 'src/app/components/header/header.component'
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
    IonButtons,
    IonBackButton,
    CommonModule,
    FormsModule,
    CardUsuariosComponent,
    HeaderComponent
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
