import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbell, imagesOutline } from 'ionicons/icons';
@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, IonGrid, IonRow, IonCol, IonIcon, IonButton],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
    constructor() {
      addIcons({ imagesOutline, barbell });
    }
}
