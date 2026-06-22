import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { Asset } from '../models/asset';

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
}

@Injectable({ providedIn: 'root' })
export class AssetService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private assetApi = `${this.apiUrl}/asset`;
  private assetServerApi = `${this.apiUrl}/asset-server`;

  private apiAssetServerUrl = `${this.apiUrl}/asset-server`; // Update to your API port
  private metadataUrl = `${this.apiUrl}/asset`; // Wherever you save DB records
  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.metadataUrl)
  }

  getAsset(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.assetApi}/${id}`);
  }
  /**
   * Orchestrates the entire process: Get URL -> Upload to S3 -> Save Metadata to DB
   */
  uploadAssetWithMetadata(file: File, assetMetadata: Asset): Observable<Asset> {
    return this.getUploadUrl(file.name, file.type).pipe(
      switchMap((response) => {
        assetMetadata.fileKey = response.fileKey; // Ensure fileKey is set in metadata before saving
        assetMetadata.contentType = file.type; // Set content type in metadata
        assetMetadata.size = file.size; // Set file size in metadata

        // 1. Upload directly to S3 using the presigned URL
        return this.uploadToS3(response.uploadUrl, file).pipe(
          // 2. Once S3 upload succeeds, pass the fileKey forward to save metadata
          switchMap(() => {
            return this.saveAssetMetadata(assetMetadata);
          }),
          catchError(error => {
            console.error('Metadata save failed after S3 upload; attempting cleanup', {
              fileKey: response.fileKey,
              error,
            });

            return this.deleteAssetFile(response.fileKey).pipe(
              catchError(deleteError => {
                console.error('Failed to delete uploaded object after metadata error', deleteError);
                return EMPTY;
              }),
              switchMap(() => throwError(() => error))
            );
          })
        );
      })
    );
  }

  updateAssetWithMetadata(
    assetId: string,
    assetMetadata: Asset,
    file?: File | null,
    oldFileKey?: string
  ): Observable<Asset> {
    if (!file) {
      return this.updateAssetMetadata(assetId, assetMetadata);
    }

    return this.getUploadUrl(file.name, file.type).pipe(
      switchMap((response) => {
        const newFileKey = response.fileKey;
        const uploadUrl = response.uploadUrl;

        return this.uploadToS3(uploadUrl, file).pipe(
          switchMap(() => {
            const newMetadata = {
              ...assetMetadata,
              fileKey: newFileKey,
              contentType: file.type,
              size: file.size,
            };

            return this.updateAssetMetadata(assetId, newMetadata).pipe(
              switchMap((updatedAsset) => {
                if (!oldFileKey) {
                  return of(updatedAsset);
                }

                return this.deleteAssetFile(oldFileKey).pipe(
                  map(() => updatedAsset)
                );
              }),
              catchError(error => {
                console.error('Metadata update failed after new file upload; cleaning up new S3 object', error);

                return this.deleteAssetFile(newFileKey).pipe(
                  catchError(deleteError => {
                    console.error('Failed to delete newly uploaded object after metadata update error', deleteError);
                    return EMPTY;
                  }),
                  switchMap(() => throwError(() => error))
                );
              })
            );
          }),
          catchError(error => {
            console.error('Failed to upload replacement file to S3', error);
            return throwError(() => error);
          })
        );
      })
    );
  }

  // Step 1: Fetch presigned URL from .NET
  private getUploadUrl(fileName: string, contentType: string): Observable<UploadUrlResponse> {
    return this.http.get<UploadUrlResponse>(`${this.apiAssetServerUrl}/upload-url`, {
      params: { fileName, contentType }
    });
  }

  // Step 2: Upload binary data directly to S3
  private uploadToS3(presignedUrl: string, file: File): Observable<void> {
    // CRITICAL: S3 expects the exact Content-Type header that matched your backend request
    const headers = new HttpHeaders({ 'Content-Type': file.type });
    
    return this.http.put<void>(presignedUrl, file, { headers });
  }

  // Step 3: Save metadata to your DB backend
  private saveAssetMetadata(metadata: Asset): Observable<Asset> {
    const payload = { ...metadata };

    return this.http.post<Asset>(this.metadataUrl, payload);
  }

  getViewUrl(fileKey: string): Observable<{ assetUrl: string }> {
    return this.http.get<{ assetUrl: string }>(
      `${this.assetServerApi}/view-url`,
      { params: { fileKey } }
    );
  }

  private updateAssetMetadata(id: string, asset: Asset): Observable<Asset> {
    return this.http.put<Asset>(`${this.assetApi}/${id}`, asset);
  }

  deleteAssetFile(fileKey: string): Observable<void> {
    return this.http.delete<void>(`${this.assetServerApi}/delete`, {
      params: { fileKey }
    });
  }
}