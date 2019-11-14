import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MapObjectModel} from '../../models/map-object.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MapService} from '../../services/map.service';
import {DialogResult} from '../../../core/models/dialog-result';

@Component({
  selector: 'app-edit-map-object',
  templateUrl: './edit-map-object.component.html',
  styleUrls: ['./edit-map-object.component.scss']
})
export class EditMapObjectComponent  {

    mapObjectForm = new FormGroup({
        id: new FormControl(undefined, [Validators.required]),
        createdAt: new FormControl(Date.now().toString(), [Validators.required]),
        lastModifiedAt: new FormControl(Date.now().toString(), [Validators.required]),
        title: new FormControl(undefined, [Validators.required]),
        wktString: new FormControl(undefined, [Validators.required])
    });

    constructor(
        public dialogRef: MatDialogRef<EditMapObjectComponent, DialogResult<MapObjectModel>>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private mapService: MapService) {

        this.mapObjectForm.setValue(data);
    }

    onNoClick() {
        this.dialogRef.close(DialogResult.Cancel());
    }

    onOkClick() {
        if (this.mapObjectForm.invalid)
            return;

        this.dialogRef.close(DialogResult.Ok(this.mapObjectForm.value));
    }

    onDrawClick() {
        this.mapService.setDrawingMode();
    }
}
