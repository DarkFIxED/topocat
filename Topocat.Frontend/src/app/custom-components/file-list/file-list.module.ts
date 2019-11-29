import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileListComponent} from './components/file-list/file-list.component';
import {MatCardModule, MatDividerModule, MatIconModule, MatProgressBarModule, MatRippleModule} from '@angular/material';
import {CoreModule} from '../../core/core.module';
import {SlideshowModule} from 'ng-simple-slideshow';


@NgModule({
    declarations: [FileListComponent],
    imports: [
        CommonModule,
        CoreModule,
        MatRippleModule,
        MatProgressBarModule,
        MatIconModule,
        SlideshowModule,
        MatDividerModule,
        MatCardModule,
    ],
    exports: [
        FileListComponent
    ]
})
export class FileListModule {
}
