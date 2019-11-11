import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NewInviteModel} from '../../models/new-invite.model';

@Component({
  selector: 'app-new-invite',
  templateUrl: './new-invite.component.html',
  styleUrls: ['./new-invite.component.scss']
})
export class NewInviteComponent {
    newInviteForm = new FormGroup({
        email: new FormControl(undefined, [Validators.email, Validators.required])
    });

    constructor(
        public dialogRef: MatDialogRef<NewInviteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NewInviteModel) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onOkClick() {
        if (this.newInviteForm.invalid)
            return;

        this.dialogRef.close(this.newInviteForm.value);
    }
}
