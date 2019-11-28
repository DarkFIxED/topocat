import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileListComponent} from './components/file-list/file-list.component';
import {MatIconModule, MatProgressBarModule, MatRippleModule} from '@angular/material';
import {CoreModule} from '../../core/core.module';


@NgModule({
    declarations: [FileListComponent],
    imports: [
        CommonModule,
        CoreModule,
        MatRippleModule,
        MatProgressBarModule,
        MatIconModule,
    ],
    exports: [
        FileListComponent
    ]
})
export class FileListModule {
}
