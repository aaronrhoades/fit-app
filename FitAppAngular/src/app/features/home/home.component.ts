import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonToolbar,IonTitle, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbell, idCard } from 'ionicons/icons';
@Component({
  selector: 'app-home',
  imports: [IonContent, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonHeader],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private router = inject(Router);
  constructor() {
    addIcons({ barbell, idCard });
  }
  public navigateToWorkouts() {
    this.router.navigate(['/workouts']);
  }
  public navigateToAdmin() {
    this.router.navigate(['/admin']);
  }
}
