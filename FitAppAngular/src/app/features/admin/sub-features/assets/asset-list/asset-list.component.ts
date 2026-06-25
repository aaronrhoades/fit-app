import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow
} from '@ionic/angular/standalone';
import { AssetComponent } from "@shared/components/asset/asset.component";
import { LoadingAnimationComponent } from '@shared/components/loading-animation/loading-animation.component';
import { Asset } from '@shared/models/asset';
import { AssetService } from '@shared/services/asset.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [
    LoadingAnimationComponent,
    DecimalPipe,
    RouterLink,
    IonItem,
    IonLabel,
    IonList,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    AssetComponent
],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss',
})
export class AssetListComponent {
  private assetService = inject(AssetService);
  private router = inject(Router);
  public error = signal<string | null>(null);
  public assets = toSignal<Asset[]>(
    this.assetService.getAssets().pipe(
      catchError(err => {
        console.error('Failed to load assets', err);
        this.error.set('Failed to load assets');
        return of([]); // Return fallback value on error
      })
    ),
    { initialValue: null }
  );

  public backToAdminDashboard() {
    this.router.navigate(['admin']);
  }
}

