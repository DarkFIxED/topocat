import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NewMapModel} from '../../models/new-map.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogResult} from '../../../core/models/dialog-result';

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
        public dialogRef: MatDialogRef<NewMapComponent, DialogResult<NewMapModel>>,
        @Inject(MAT_DIALOG_DATA) public data: {model: NewMapModel, isNewMap: boolean}) {

        this.newMapForm.patchValue(data.model);
    }

    onNoClick(): void {
        this.dialogRef.close(DialogResult.Cancel());
    }

    onOkClick() {
        if (this.newMapForm.invalid)
            return;

        this.dialogRef.close(DialogResult.Ok(this.newMapForm.value));
    }
}
