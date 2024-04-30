import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';

import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonContent,
  IonTitle,
  IonText,
  IonChip,
  IonAvatar,
  IonMenuToggle
} from '@ionic/angular/standalone'
import { User } from 'src/app/types/user-request';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  imports: [
    IonMenu,
    IonIcon,
    IonItem,
    IonToolbar,
    IonLabel,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonText,
    RouterLinkActive,
    RouterLink,
    IonChip,
    IonAvatar,
    IonMenuToggle
  ]
})
export class SideMenuComponent  implements OnInit {
  user: User | null = null
  constructor(
    private router: Router,
    private loginService: LoginService,
    ) {
      this.user = localStorage.getItem('@D&CUser') ? JSON.parse(localStorage.getItem('@D&CUser')!) : null
    }

  ngOnInit() {
    return null
  }

  logout() {
    this.loginService.logout()
    this.router.navigate(['/login']);
    this.user = null
  }
}
