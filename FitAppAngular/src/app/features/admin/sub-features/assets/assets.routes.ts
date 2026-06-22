import { Route } from "@angular/router";

export const assetRoutes: Route[] = [
  { 
    path: '',
    loadComponent: () => import('./asset-list/asset-list.component').then(m => m.AssetListComponent)
},
  { path: 'new', loadComponent: () => import('./asset-create-edit/asset-create-edit.component').then(m => m.AssetCreateEditComponent) },             // Create Mode
  { path: ':id', loadComponent: () => import('./asset-detail/asset-detail.component').then(m => m.AssetDetailComponent) },
  { path: ':id/edit', loadComponent: () => import('./asset-create-edit/asset-create-edit.component').then(m => m.AssetCreateEditComponent) }         // Edit Mode
];