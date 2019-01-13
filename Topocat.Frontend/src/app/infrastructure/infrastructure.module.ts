import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { MessageBusService } from 'litebus';
import { JsonDeserializer } from './json-deserializer';
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
        MessageBusService,
        JsonDeserializer,
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
