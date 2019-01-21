import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { JsonSerializer } from './json-serializer.service';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './dialogs/confirmation-dialog/confirmation-dialog.service';

@NgModule({
    declarations: [ConfirmationDialogComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
    ],
    providers: [
        JsonSerializer,
        ConfirmationDialogService
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ],
    exports: [
    ]
})
export class InfrastructureModule {
}
