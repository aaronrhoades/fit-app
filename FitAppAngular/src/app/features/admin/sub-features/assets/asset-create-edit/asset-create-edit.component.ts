import { DecimalPipe, Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonTextarea,
} from '@ionic/angular/standalone';
import { AssetComponent } from '@shared/components/asset/asset.component';
import { Asset } from '@shared/models/asset';
import { AssetService } from '@shared/services/asset.service';
import { addIcons } from 'ionicons';
import { arrowBack, cloudUploadOutline, saveOutline } from 'ionicons/icons';
import { map } from 'rxjs';

@Component({
  selector: 'app-asset-create-edit',
  standalone: true,
  imports: [
    AssetComponent,
    FormsModule,
    IonRow,
    IonCol,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonList,
    IonIcon,
    IonText,
    DecimalPipe
  ],
  templateUrl: './asset-create-edit.component.html',
  styleUrl: './asset-create-edit.component.scss',
})
export class AssetCreateEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private assetService = inject(AssetService);
  private location = inject(Location);
  public asset = signal<Asset>(new Asset());
  public fileToUpload = signal<File | null>(null);
  public previewUrl = signal<string>('');
  public isSaving = signal(false);
  public error = signal<string | null>(null);
  public replaceImage = signal(false);
  public isEditMode = toSignal(
    this.route.paramMap.pipe(
      map(paramMap => !!paramMap.get('id'))
    ),
    { initialValue: false }
  );
  public pageTitle = computed(() => this.isEditMode() ? 'Edit Asset' : 'Upload Asset');

  constructor() {
    addIcons({ arrowBack, cloudUploadOutline, saveOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAsset(id);
    }
  }

  private loadAsset(id: string): void {
    this.assetService.getAsset(id).subscribe({
      next: asset => {
        if (!asset) {
          this.error.set('Asset not found');
          return;
        }
        this.asset.set(asset);
      },
      error: () => this.error.set('Failed to load asset.'),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.error.set(null);
    this.fileToUpload.set(file);

    // Generate a preview URL for the selected file (works for images and videos)
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    if (this.fileToUpload() === null && (!this.asset().fileKey || this.replaceImage())) {
      this.error.set('Please select a file to upload.');

      return;
    }

    if (this.isSaving()) {
      return;
    }

    this.error.set(null);
    const payload = { ...this.asset() };

    if (!this.asset().id) {
      delete payload.id;
    }

    this.isSaving.set(true);
   
    const request$ = this.isEditMode() && this.asset().id
      ? this.assetService.updateAssetWithMetadata(this.asset().id!, payload as Asset, this.fileToUpload(),  this.replaceImage() ? this.asset().fileKey : undefined)
      : this.assetService.uploadAssetWithMetadata(this.fileToUpload()!, payload as Asset);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/admin/assets']);
      },
      error: () => {
        console.error('Failed to save asset');
        this.error.set('Could not save asset.');
        this.isSaving.set(false);
      },
    });
  }

  cancel(): void {
    this.location.back();
  }
}

