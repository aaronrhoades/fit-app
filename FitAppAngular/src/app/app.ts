import { Component, inject, afterNextRender } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly platform = inject(Platform);
  private readonly document = inject(DOCUMENT);

  constructor() {
   afterNextRender(() => {
      // Platform.ready() returns a promise that resolves once Capacitor is fully loaded
      this.platform.ready().then(() => {
        const isAndroidNative = this.platform.is('android') && this.platform.is('capacitor');
        
        if (isAndroidNative) {
          this.document.body.classList.add('android-native');
        }
      });
    });
  }
}
