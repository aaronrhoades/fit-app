import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Asset } from '@shared/models/asset';
import { AssetService } from '@shared/services/asset.service';

@Component({
  selector: 'app-asset',
  imports: [],
  templateUrl: './asset.component.html',
  styleUrl: './asset.component.scss',
})
export class AssetComponent implements OnInit {
  asset = input<Asset | null>(null);
  width = input<number | null>(null);
  hasControls = input<boolean>(false);
  isMuted = input<boolean>(true);
  loop = input<boolean>(true);
  assetService = inject(AssetService);
  previewUrl = signal<string>('');

  ngOnInit() {
    if (this.asset()) {
      this.assetService.getViewUrl(this.asset()!.fileKey)
        .subscribe((response) => {
          this.previewUrl.set(response.assetUrl);
        });
    } else {
      console.warn('AssetComponent initialized without an asset input.');
    }
  }
}
