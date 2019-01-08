import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonDeserializer } from './json-deserializer';
import { MessageBusService } from 'litebus';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatButtonModule, MatDialogModule } from '@angular/material';

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
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ],
    exports: [
    ]
})
export class InfrastructureModule {
}
