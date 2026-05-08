import { Component, effect, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { WakeLockStore } from '@core/store/wake-lock-store';
import { Exercise } from './exercise';
import { TimerComponent } from '@shared/components/timer/timer.component';
@Component({
  selector: 'app-exercise',
  imports: [TimerComponent],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss',
})
export class ExerciseComponent implements OnInit, OnDestroy {
  exercise = input<Exercise | null>(null);
  reps = input<number | null>(null);
  timer = input<number | null>(null);
  exerciseKey = input<number | null>(0);
  timerFinished = output<void>();
  private readonly wakeLockStore = inject(WakeLockStore);

  ngOnInit() {
    // Just set the state; the store's rxMethod handles the rest
    this.wakeLockStore.setWakeLock('exercise', true);
  }

  ngOnDestroy() {
    this.wakeLockStore.setWakeLock('exercise', false);
  }
  onTimerFinished() {
    this.timerFinished.emit();
  }
}
