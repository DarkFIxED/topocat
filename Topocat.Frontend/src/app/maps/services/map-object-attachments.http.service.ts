import {Injectable} from '@angular/core';
import {AuthHttpService} from '../../core/services/auth.http.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../core/models/api.response';
import {MapObjectAttachmentModel} from '../models/map-object-attachment.model';

@Injectable()
export class MapObjectAttachmentsHttpService {

    constructor(private authHttpService: AuthHttpService) {
    }

    getObjectAttachments(mapId: string, objectId: string): Observable<ApiResponse<{ attachments: MapObjectAttachmentModel[] }>> {
        return this.authHttpService.get<ApiResponse<{ attachments: MapObjectAttachmentModel[] }>>(`maps/${mapId}/objects/${objectId}/attachments`);
    }

    getUploadLink(mapId: string, objectId: string, data: {sourceFileName: string, mimeType: string}): Observable<ApiResponse<{id: string, uploadUrl: string}>> {
        return this.authHttpService.post<ApiResponse<{id: string, uploadUrl: string}>>(`maps/${mapId}/objects/${objectId}/attachments`, data);
    }

    confirmUpload(mapId: string, objectId: string, attachmentId: string): Observable<ApiResponse<MapObjectAttachmentModel>> {
        return this.authHttpService.post<ApiResponse<MapObjectAttachmentModel>>(`maps/${mapId}/objects/${objectId}/attachments/${attachmentId}/confirm`, undefined);
    }

    deleteAttachment(mapId: string, objectId: string, attachmentId: string): Observable<ApiResponse<any>> {
        return this.authHttpService.delete<ApiResponse<any>>(`maps/${mapId}/objects/${objectId}/attachments/${attachmentId}`);
    }
}
