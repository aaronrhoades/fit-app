import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AssetService } from '@shared/services/asset.service';
import { Asset } from '@shared/models/asset';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { AssetComponent } from '@shared/components/asset/asset.component';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [
    AssetComponent,
    DecimalPipe,
    RouterLink,
    IonItem,
    IonLabel,
    IonList,
    IonButton
  ],
  templateUrl: './asset-detail.component.html',
  styleUrl: './asset-detail.component.scss',
})
export class AssetDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private assetService = inject(AssetService);

  public asset = signal<Asset | null>(null);
  public error = signal<string | null>(null);

  ngOnInit() {
    this.loadAsset();
  }

  private loadAsset(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing asset ID.');
      return;
    }

    this.assetService.getAsset(id).subscribe({
      next: loaded => this.asset.set(loaded),
      error: () => this.error.set('Failed to load asset details.'),
    });
  }

  back(): void {
    this.router.navigate(['/admin/assets']);
  }
}

