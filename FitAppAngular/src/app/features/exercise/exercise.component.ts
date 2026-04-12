import { Component, Input } from '@angular/core';
import { Exercise } from './exercise';

@Component({
  selector: 'app-exercise',
  imports: [],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss',
})
export class ExerciseComponent {
  @Input() exercise: Exercise | null = null;
}
