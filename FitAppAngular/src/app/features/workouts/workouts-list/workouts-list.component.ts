import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonRow } from '@ionic/angular/standalone';
import { Workout } from '../models/workout';
import { WorkoutService } from '../services/workout.service';
import { LoadingAnimationComponent } from "@shared/components/loading-animation/loading-animation.component";

@Component({
  selector: 'app-workouts-list',
  imports: [
    RouterLink,
    IonContent,
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    LoadingAnimationComponent
  ],
  templateUrl: './workouts-list.component.html',
  styleUrl: './workouts-list.component.scss',
})
export class WorkoutsListComponent {
  private workoutService = inject(WorkoutService);
  public workouts = toSignal<Workout[] | null>(this.workoutService.getWorkouts(), { initialValue: null });
}
