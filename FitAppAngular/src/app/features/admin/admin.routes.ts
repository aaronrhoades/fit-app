import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      // Add your admin sub-routes here (e.g., dashboard, users)
      {
        path: '',
        loadComponent: () => import('./sub-features/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      { 
        path: 'assets', 
        loadChildren: () => import('./sub-features/assets/assets.routes').then(m => m.assetRoutes) 
      }
    ]
  }
];