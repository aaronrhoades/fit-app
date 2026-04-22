import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WakeLockStore } from '@core/store/wake-lock-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fit-app');
  public readonly wakeLockStore = inject(WakeLockStore);
}
