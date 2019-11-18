import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MapObjectModel} from '../../models/map-object.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MapService} from '../../services/map.service';
import {DialogResult} from '../../../core/models/dialog-result';
import {EditObjectTypesActions} from '../../models/edit-object-types-actions';

@Component({
    selector: 'app-edit-map-object',
    templateUrl: './edit-map-object.component.html',
    styleUrls: ['./edit-map-object.component.scss']
})
export class EditMapObjectComponent {

    mapObjectForm = new FormGroup({
        id: new FormControl(undefined, [Validators.required]),
        createdAt: new FormControl(Date.now().toString(), [Validators.required]),
        lastModifiedAt: new FormControl(Date.now().toString(), [Validators.required]),
        title: new FormControl(undefined, [Validators.required]),
        wktString: new FormControl(undefined, [Validators.required])
    });

    data: { model: MapObjectModel, isNewObject: boolean };

    constructor(public dialogRef: MatDialogRef<EditMapObjectComponent, DialogResult<{ action: EditObjectTypesActions, data: MapObjectModel }>>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        this.data = data as { model: MapObjectModel, isNewObject: boolean };
        this.mapObjectForm.patchValue(this.data.model);
    }

    onNoClick() {
        this.dialogRef.close(DialogResult.Cancel());
    }

    onOkClick() {
        if (this.mapObjectForm.invalid) {
            return;
        }

        this.dialogRef.close(DialogResult.Ok({action: EditObjectTypesActions.Finished, data: this.mapObjectForm.value}));
    }

    onDrawClick() {
        this.dialogRef.close(DialogResult.Ok({action: EditObjectTypesActions.RedrawRequested, data: this.data.model}));
    }

    onDeleteClick() {
        this.dialogRef.close(DialogResult.Ok({action: EditObjectTypesActions.RemoveRequested, data: this.data.model}));
    }
}
