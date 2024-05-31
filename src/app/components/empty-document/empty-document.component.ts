import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
@Component({
  selector: 'app-empty-document',
  templateUrl: './empty-document.component.html',
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonIcon],
  styleUrls: ['./empty-document.component.scss'],
})
export class EmptyDocumentComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    return null
  }

}
