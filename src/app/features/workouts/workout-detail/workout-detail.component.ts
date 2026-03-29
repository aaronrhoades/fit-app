import { Component, signal, inject, input, computed } from '@angular/core';
import { ExerciseComponent } from "../../exercise/exercise.component";
import { Exercise } from '@features/exercise/exercise';
import { Workout } from '../models/workout';
import { WorkoutService } from '../services/workout.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-workout-detail',
  imports: [ExerciseComponent],
  templateUrl: './workout-detail.component.html',
  styleUrl: './workout-detail.component.scss',
})
export class WorkoutDetailComponent {
  private router = inject(Router);
  // Using a Signal Input (best for Angular 21)
  // This will automatically hold the value of ':id' from the URL
  id = input.required<string>();
  // This signal will fetch the workout details whenever 'id' changes
  public workout = toSignal<Workout | null>(
    toObservable(this.id).pipe(
      switchMap(id => this.workoutService.getWorkoutById(id))
    )
  );
  public currentExerciseIndex = signal<number | null>(null);
  public currentExercise = signal<Exercise | null>(null);
  public isWorkoutComplete = signal(false);
  public isLastExercise = computed(
    () => {
      return !this.isWorkoutComplete() &&
      this.currentExerciseIndex() !== null &&
      this.workout()?.exercises &&
      this.currentExerciseIndex() === this.workout()!.exercises!.length - 1
    }
  );
  private workoutService = inject(WorkoutService);

  startWorkout() {
    this.isWorkoutComplete.set(false);
    this.currentExerciseIndex.set(0);
    this.currentExercise.set(this.workout()?.exercises?.[0] || null);
  }
  finishWorkout() {
    this.currentExerciseIndex.set(null);
    this.currentExercise.set(null);
    this.isWorkoutComplete.set(true);
  }
  nextExercise() {
    const nextIndex = (this.currentExerciseIndex() ?? -1) + 1;
    if (nextIndex < (this.workout()?.exercises?.length ?? 0)) {
      this.currentExerciseIndex.set(nextIndex);
      this.currentExercise.set(this.workout()?.exercises?.[nextIndex] || null);
    } else {
      this.currentExerciseIndex.set(null);
      this.currentExercise.set(null);
      this.isWorkoutComplete.set(true);
    }
  }
  goBackToAllWorkouts() {
    this.router.navigate(['/workouts']);
  }
}