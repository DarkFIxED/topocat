import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Item} from '../../models/item';
import {FileUploadModel} from '../../models/file-upload.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from '@angular/material';
import {ConfirmationComponent} from '../../../../core/dialogs/confirmation/confirmation.component';
import {filter, tap} from 'rxjs/operators';
import {DialogResult} from '../../../../core/models/dialog-result';
import {SlideshowComponent} from 'ng-simple-slideshow/src/app/modules/slideshow/slideshow.component';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss'],
    animations: [
        trigger('fadeInOut', [
            state('in', style({opacity: 100})),
            transition('* => void', [
                animate(300, style({opacity: 0}))
            ])
        ])
    ]
})
export class FileListComponent implements OnInit {

    readonly imageTypePrefix = 'image/';

    @ViewChild('uploadInput', {static: true})
    uploadInputRef: ElementRef;

    @ViewChild('slideShow', {static: true})
    slideShow: SlideshowComponent;

    @Input()
    itemWidth = 75;

    @Input()
    itemHeight = 75;

    @Input()
    uploadFunc: (file: FileUploadModel, successCallback: (fileModel: FileUploadModel) => void) => void;

    @Output()
    fileRemoved = new EventEmitter<{ id: string }>();

    files: FileUploadModel[] = [];
    showCarousel = false;

    items: Item[] = [];

    private uploadInput: HTMLInputElement;

    constructor(private matDialog: MatDialog,
                private httpClient: HttpClient) {
    }

    ngOnInit() {
        this.uploadInput = this.uploadInputRef.nativeElement;
    }

    getItems(): Item[] {
        return [...this.items];
    }

    add(items: Item[]) {
        if (!items || !items.length) {
            return;
        }

        if (this.items.some(existingItem => items.some(newItem => newItem === existingItem))) {
            throw new Error('Items identifiers must be unique');
        }

        this.items.push(...items);
    }

    remove(ids: string[]) {
        if (!ids || !ids.length) {
            throw new Error('At least 1 id required');
        }

        const indexes = [];
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (ids.some(id => id === this.items[i].id)) {
                indexes.push(i);
            }
        }

        indexes.forEach(index => this.items.splice(index, 1));
    }

    cancelFile(file: FileUploadModel) {
        file.sub.unsubscribe();
        this.removeFileFromArray(file);
    }

    retryFile(file: FileUploadModel) {
        this.uploadFile(file);
        file.canRetry = false;
    }

    openUploadDialog() {
        this.uploadInput.onchange = () => {
            // tslint:disable-next-line:prefer-for-of
            for (let index = 0; index < this.uploadInput.files.length; index++) {
                const file = this.uploadInput.files[index];
                this.files.push({
                    data: file,
                    state: 'in',
                    inProgress: false,
                    progress: 0,
                    canRetry: false,
                    canCancel: true,
                    mimeType: file.type
                });
            }
            this.uploadFiles();
        };
        this.uploadInput.click();
    }

    private uploadFile(file: FileUploadModel) {
        if (!this.uploadFunc) {
            throw new Error('uploadFunc must be specified');
        }

        this.uploadFunc(file, fileModel => {
            this.removeFileFromArray(fileModel);
        });
    }

    private uploadFiles() {
        this.uploadInput.value = '';
        this.files.forEach(file => {
            this.uploadFile(file);
        });
    }

    private removeFileFromArray(file: FileUploadModel) {
        const index = this.files.indexOf(file);
        if (index > -1) {
            this.files.splice(index, 1);
        }
    }

    onDelete($event: MouseEvent, item: Item) {
        $event.stopImmediatePropagation();

        this.matDialog.open(ConfirmationComponent, {})
            .afterClosed()
            .pipe(
                filter((dialogResult: DialogResult<any>) => !dialogResult.isCancelled),
                tap(() => {
                    this.fileRemoved.emit({id: item.id});
                }),
                tap(() => {
                    this.remove([item.id]);
                })
            ).subscribe();
    }

    onShowImages(startItem: Item) {
        // TODO: add carousel
        const images = this.items
            .filter(item => item.mimeType.includes(this.imageTypePrefix))
            .map(item => item.url);

        const startIndex = images.findIndex(image => image === startItem.url);

        this.slideShow.imageUrls = images;
        this.slideShow.autoPlay = true;
        this.slideShow.lazyLoad = true;
        this.slideShow.autoPlayWaitForLazyLoad = true;


        const sub = this.slideShow.onFullscreenExit.subscribe(() => {
            sub.unsubscribe();
            this.showCarousel = false;
            this.slideShow.imageUrls = [];
        });

        this.showCarousel = true;
        setTimeout(() => {
            this.slideShow.fullscreen = true;
            this.slideShow.goToSlide(startIndex);
        });
    }

    onDownload(item: Item) {
        this.httpClient.get(item.url, {responseType: 'blob'})
            .subscribe(data => {
                const blob = new Blob([data], {type: item.mimeType});
                const url = window.URL.createObjectURL(blob);
                window.open(url);
            });
    }
}
