import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workout } from '../models/workout';
import { environment } from '@environments/environment';

@Service()
export class WorkoutService {
  private apiUrl = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.apiUrl}/workout`);
  }

  getWorkoutById(id: string): Observable<Workout> {
    return this.http.get<Workout>(`${this.apiUrl}/workout/${id}`);
  }
}