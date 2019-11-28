import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MapObjectModel} from '../../models/map-object.model';
import {MapObjectAttachmentsHttpService} from '../../services/map-object-attachments.http.service';
import {FileListComponent} from '../../../custom-components/file-list/components/file-list/file-list.component';
import {FileUploadModel} from '../../../custom-components/file-list/models/file-upload.model';
import {catchError, filter, last, map, switchMap, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {MapObjectAttachmentModel} from '../../models/map-object-attachment.model';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpRequest} from '@angular/common/http';
import {Item} from '../../../custom-components/file-list/models/item';

@Component({
    selector: 'app-attachments-map-object-properties',
    templateUrl: './attachments-map-object-properties.component.html',
    styleUrls: ['./attachments-map-object-properties.component.scss']
})
export class AttachmentsMapObjectPropertiesComponent implements OnInit {

    @ViewChild('fileList', {static: true})
    fileList: FileListComponent;

    @Input()
    model: MapObjectModel;

    @Input()
    mapId: string;

    objectId: string;
    itemHeight = 75;
    itemWidth = 75;

    constructor(private mapObjectAttachmentsHttpService: MapObjectAttachmentsHttpService,
                private http: HttpClient) {
    }

    ngOnInit() {
        this.objectId = this.model.id.toString();

        this.mapObjectAttachmentsHttpService.getObjectAttachments(this.mapId, this.objectId).subscribe(
            response => {
                if (!response.isSuccessful) {
                    throw new Error();
                }

                this.fileList.add(response.data.attachments.map(attachment => this.createFileItem(attachment)));
            });
    }

    uploadFunc(context: AttachmentsMapObjectPropertiesComponent) {
        return (fileModel: FileUploadModel, successCallback: (fileModel: FileUploadModel) => void) => {
            context.mapObjectAttachmentsHttpService.getUploadLink(context.mapId, context.objectId, {
                sourceFileName: fileModel.data.name,
                mimeType: fileModel.mimeType
            }).pipe(
                filter(result => !!result.isSuccessful),
                map(result => result.data),
                switchMap(uploadData => context.uploadToAWS(uploadData.uploadUrl, fileModel, successCallback)
                    .pipe(
                        switchMap(() => context.mapObjectAttachmentsHttpService.confirmUpload(context.mapId, context.objectId, uploadData.id))
                    )
                ),
                tap(attachmentModel => {
                    context.onFileUploaded(attachmentModel.data);
                })
            ).subscribe();
        };
    }

    private uploadToAWS(uploadUrl: string, file: FileUploadModel, successCallback: (fileModel: FileUploadModel) => void): Observable<any> {
        const req = new HttpRequest('PUT', uploadUrl, file.data, {
            reportProgress: true
        });

        file.inProgress = true;
        const observable = this.http.request(req).pipe(
            map(event => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        file.progress = Math.round(event.loaded * 100 / event.total);
                        break;
                    case HttpEventType.Response:
                        return event;
                }
            }),
            last(),
            catchError((error: HttpErrorResponse) => {
                file.inProgress = false;
                file.canRetry = true;
                return of(`${file.data.name} upload failed.`);
            }),
            tap((event: any) => {
                if (typeof (event) === 'object') {
                    successCallback(file);
                }
            })
        );

        file.sub = observable.subscribe();
        return observable;
    }

    private onFileUploaded(attachment: MapObjectAttachmentModel) {
        const item = this.createFileItem(attachment);
        this.fileList.add([item]);
    }

    private createFileItem(attachment: MapObjectAttachmentModel): Item {
        const thumbUrl = attachment.previewTemplate.replace('{0}', `${this.itemWidth}x${this.itemHeight}`);

        return {
            url: attachment.accessUrl,
            thumbUrl,
            mimeType: attachment.mimeType,
            id: attachment.id
        };
    }

    onFileRemoved(event: { id: string }) {
        this.mapObjectAttachmentsHttpService.deleteAttachment(this.mapId, this.objectId, event.id).subscribe();
    }
}
