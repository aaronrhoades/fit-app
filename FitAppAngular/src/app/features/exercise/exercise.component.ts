import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { WakeLockStore } from '@core/store/wake-lock-store';
import { Exercise } from './exercise';

@Component({
  selector: 'app-exercise',
  imports: [],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss',
})
export class ExerciseComponent implements OnInit, OnDestroy {
  @Input() exercise: Exercise | null = null;
  @Input() reps: number | null = null;
  @Input() timer: number | null = null;
  private readonly wakeLockStore = inject(WakeLockStore);

  ngOnInit() {
    // Just set the state; the store's rxMethod handles the rest
    this.wakeLockStore.setWakeLock('exercise', true);
  }

  ngOnDestroy() {
    this.wakeLockStore.setWakeLock('exercise', false);
  }
}
