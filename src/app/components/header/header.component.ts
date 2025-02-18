import { Component, Input } from '@angular/core'
import { IonHeader, IonButtons, IonToolbar, IonTitle, IonBackButton } from '@ionic/angular/standalone'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonToolbar,
    IonButtons,
    IonHeader,
    IonTitle,
    IonBackButton
  ]
})
export class HeaderComponent {
  @Input() title: string = ''

  constructor(){}
}
