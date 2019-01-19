import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { map } from 'rxjs/operators';

@Injectable()
export class ConfirmationDialogService {

    public constructor(private dialog: MatDialog) {
    }

    public call(title: string, content: string): Observable<boolean> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: 1,
            title: title,
            content: content
        };

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

        return dialogRef.afterClosed()
            .pipe(
                map(result => !!result)
            );
    }
}