import { Component, inject, signal } from '@angular/core';
import { WakeLockStore } from '@core/store/wake-lock-store';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Overtone');
  public readonly wakeLockStore = inject(WakeLockStore);
}
