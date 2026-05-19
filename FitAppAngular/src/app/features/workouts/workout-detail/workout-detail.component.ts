import { Component, signal, inject, input, computed } from '@angular/core';
import { ExerciseComponent } from "../../exercise/exercise.component";
import { Workout } from '../models/workout';
import { WorkoutExercise } from '../models/workoutExercise';
import { WorkoutService } from '../services/workout.service';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { IonButton, IonGrid, IonRow, IonCol, IonContent, IonFooter, IonHeader, IonToolbar, IonIcon, IonTitle, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { LoadingAnimationComponent } from '@shared/components/loading-animation/loading-animation.component';

@Component({
  selector: 'app-workout-detail',
  imports: [
    ExerciseComponent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    IonFooter,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    LoadingAnimationComponent
  ],
  templateUrl: './workout-detail.component.html',
  styleUrl: './workout-detail.component.scss',
})
export class WorkoutDetailComponent {
    constructor() {
      addIcons({ arrowBack });
    }
  private router = inject(Router);
  // Using a Signal Input (best for Angular 21)
  // This will automatically hold the value of ':id' from the URL
  id = input.required<string>();
  // This signal will fetch the workout details whenever 'id' changes
  public workout = toSignal<Workout | null>(
    toObservable(this.id).pipe(
      switchMap(id => this.workoutService.getWorkoutById(id).pipe(
          catchError((err) => {
            console.error(err);
            return of(null);
          })
        )
      )
    ),
    { initialValue: null }
  );
  public currentExerciseIndex = signal<number | null>(null);
  public currentExercise = signal<WorkoutExercise | null>(null);
  public isWorkoutComplete = signal<boolean>(false);
  public isLastExercise = computed<boolean>(
    () => {
      const lastWorkoutExerciseIndex: number | null = this.workout()?.workoutExercises?.length ? this.workout()!.workoutExercises!.length - 1 : null;
      
      return !this.isWorkoutComplete() &&
      this.currentExerciseIndex() !== null &&
      !!this.workout()?.workoutExercises &&
      this.currentExerciseIndex() === lastWorkoutExerciseIndex
    }
  );
  public isFirstExercise = computed<boolean>(
    () => {
      return !this.isWorkoutComplete() &&
      this.currentExerciseIndex() !== null &&
      this.currentExerciseIndex() === 0
    }
  );
  private workoutService = inject(WorkoutService);

  startWorkout() {
    this.isWorkoutComplete.set(false);
    this.currentExerciseIndex.set(0);
    this.currentExercise.set(this.workout()?.workoutExercises?.[0] || null);
  }
  finishWorkout() {
    this.currentExerciseIndex.set(null);
    this.currentExercise.set(null);
    this.isWorkoutComplete.set(true);
  }
  nextExercise() {
    const nextIndex = (this.currentExerciseIndex() ?? -1) + 1;
    if (nextIndex < (this.workout()?.workoutExercises?.length ?? 0)) {
      this.currentExerciseIndex.set(nextIndex);
      this.currentExercise.set(this.workout()?.workoutExercises?.[nextIndex] || null);
    } else {
      this.currentExerciseIndex.set(null);
      this.currentExercise.set(null);
      this.isWorkoutComplete.set(true);
    }
  }
  nextExerciseOrFinish(event: Event | null = null) {
    if (this.isLastExercise()) {
      this.finishWorkout();
    } else {
      this.nextExercise();
    }
    // Force the button to lose focus
    if (event instanceof Event && event.target instanceof HTMLElement) {
      event.target.blur();
    }
  }
  previousExercise(event: Event) {
    const prevIndex = (this.currentExerciseIndex() ?? 0) - 1;
    if (prevIndex >= 0) {
      this.currentExerciseIndex.set(prevIndex);
      this.currentExercise.set(this.workout()?.workoutExercises?.[prevIndex] || null);
    }
    // Force the button to lose focus
    if (event.target instanceof HTMLElement) {
      event.target.blur();
    }
  }
  goBackToAllWorkouts() {
    this.router.navigate(['/workouts']);
  }
}