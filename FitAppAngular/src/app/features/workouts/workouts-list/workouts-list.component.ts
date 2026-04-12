import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Workout } from '../models/workout';
import { WorkoutService } from '../services/workout.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-workouts-list',
  imports: [RouterLink],
  templateUrl: './workouts-list.component.html',
  styleUrl: './workouts-list.component.scss',
})
export class WorkoutsListComponent {
  private workoutService = inject(WorkoutService);
  public workouts = toSignal<Workout[] | null>(this.workoutService.getWorkouts(), { initialValue: null });
}
