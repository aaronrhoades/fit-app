import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canMatch: [authGuard]
    },
    {
        path: 'workouts',
        loadComponent: () => import('./features/workouts/workouts-list/workouts-list.component').then(m => m.WorkoutsListComponent)
    },
    {
        path: 'workout/:id',
        loadComponent: () => import('./features/workouts/workout-detail/workout-detail.component').then(m => m.WorkoutDetailComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'error-404',
        loadComponent: () => import('./features/errors/error-404/error-404.component').then(m => m.Error404Component)
    },
    {
        path: '**',
        redirectTo: '/error-404'
    }
];
