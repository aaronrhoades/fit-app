import { Component, OnDestroy, signal, computed, effect, input, output, ChangeDetectionStrategy } from '@angular/core';
import { IonProgressBar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-timer',
  imports: [IonProgressBar],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent implements OnDestroy {
  duration = input<number | null>(null);
  resetKey = input<number | null>(null);
  timerIsVisible = signal<boolean>(false);
  finished = output<void>();
  private remainingTimeMs = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  public progress = computed(() => {
    const dur = this.duration();
    if (dur === null) {
      return 0;
    }
    const durationMs = dur * 1000;
    const elapsed = durationMs - this.remainingTimeMs();
    return elapsed / durationMs;
  });
  
  get timeLeft(): number {
    return Math.round(this.remainingTimeMs() / 100) / 10;
  }

  getFormattedTime(): string {
    return this.timeLeft.toFixed(1);
  }

  durationEffect = effect(() => {
    const dur = this.duration();
    const reset = this.resetKey();
    this.resetTimer(dur);
  });

  ngOnDestroy() {
    this.clearTimer();
  }

  private resetTimer(dur: number | null) {
    this.timerIsVisible.set(false);
    this.clearTimer();
    if (dur === null) {
      this.remainingTimeMs.set(0);
      return;
    }

    this.remainingTimeMs.set(dur * 1000);
    this.intervalId = setInterval(() => {
      this.remainingTimeMs.update(val => val - 100);
      if (this.remainingTimeMs() <= 0) {
        this.clearTimer();
        this.finished.emit();
      }
    }, 100);
    
    // Ensure the timerIsVisible update happens after the DOM has a chance to process the changes
    Promise.resolve().then(() => {
      this.timerIsVisible.set(true);
    });
  }

  private clearTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
