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
  IonTitle
} from '@ionic/angular/standalone'

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
    RouterLinkActive,
    RouterLink
  ]
})
export class SideMenuComponent  implements OnInit {

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    return null
  }

  logout() {
    this.loginService.logout()
    this.router.navigate(['/login']);
  }
}