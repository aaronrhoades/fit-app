import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
export class AssetListComponent implements OnInit {
  private assetService = inject(AssetService);
  private router = inject(Router);
  public assets = signal<Asset[] | null>(null);
  public error = signal<string | null>(null);
  ngOnInit() {
    this.loadAssets();
  }

  private loadAssets(): void {
    this.assetService.getAssets().subscribe({
      next: assets => this.assets.set(assets),
      error: err => {
        console.error('Failed to load assets', err);
        this.error.set('Failed to load assets');
      },
    });
  }

  public backToAdminDashboard() {
    this.router.navigate(['admin']);
  }
}

