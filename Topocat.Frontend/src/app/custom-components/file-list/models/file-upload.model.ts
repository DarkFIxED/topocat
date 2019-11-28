import {Subscription} from 'rxjs';

export class FileUploadModel {
    data: File;
    mimeType: string;
    state: string;
    inProgress: boolean;
    progress: number;
    canRetry: boolean;
    canCancel: boolean;
    sub?: Subscription;
}
