import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, IonContent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {

}
