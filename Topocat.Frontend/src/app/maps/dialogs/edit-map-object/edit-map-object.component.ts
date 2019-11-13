import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MapObjectModel} from '../../models/map-object.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-map-object',
  templateUrl: './edit-map-object.component.html',
  styleUrls: ['./edit-map-object.component.scss']
})
export class EditMapObjectComponent  {

    mapObjectForm = new FormGroup({
        id: new FormControl(undefined, [Validators.required]),
        title: new FormControl(undefined, [Validators.required]),
        wktString: new FormControl(undefined, [Validators.required])
    });

    constructor(
        public dialogRef: MatDialogRef<EditMapObjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: MapObjectModel) {

        this.mapObjectForm.patchValue({
            id: data.id,
            title: data.title,
            wktString: data.wktString
        });
    }

    onNoClick() {
        this.dialogRef.close();
    }

    onOkClick() {
        if (this.mapObjectForm.invalid)
            return;

        this.dialogRef.close(this.mapObjectForm.value);
    }
}
