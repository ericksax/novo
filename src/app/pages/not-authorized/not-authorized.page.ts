import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router'
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.page.html',
  styleUrls: ['./not-authorized.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    RouterLink,
    RouterLinkActive
  ]
})
export class NotAuthorizedPage implements OnInit {

  constructor() { }

  ngOnInit() {
    return null
  }

}
