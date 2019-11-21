import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NewMapModel} from '../../models/new-map.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-map',
  templateUrl: './new-map.component.html',
  styleUrls: ['./new-map.component.scss']
})
export class NewMapComponent {

    newMapForm = new FormGroup({
        title: new FormControl(undefined, [Validators.required])
    });

    constructor(
        public dialogRef: MatDialogRef<NewMapComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NewMapModel) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onOkClick() {
        if (this.newMapForm.invalid)
            return;

        this.dialogRef.close(this.newMapForm.value);
    }
}
