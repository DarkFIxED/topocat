import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogResult} from '../../models/dialog-result';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {

    constructor(public dialogRef: MatDialogRef<ConfirmationComponent, DialogResult<any>>,
                @Optional() @Inject(MAT_DIALOG_DATA) data: any) {
    }

    onNoClick() {
        this.dialogRef.close(DialogResult.Cancel());
    }

    onOkClick() {
        this.dialogRef.close(DialogResult.Ok());
    }
}
