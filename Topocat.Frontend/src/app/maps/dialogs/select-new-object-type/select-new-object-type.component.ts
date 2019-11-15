import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WktPrimitives} from '../../models/wkt-primitives';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogResult} from '../../../core/models/dialog-result';
import {MapObjectModel} from '../../models/map-object.model';
import {MapService} from '../../services/map.service';

@Component({
    selector: 'app-select-new-object-type',
    templateUrl: './select-new-object-type.component.html',
    styleUrls: ['./select-new-object-type.component.scss']
})
export class SelectNewObjectTypeComponent implements OnInit {

    WktPrimitives = WktPrimitives;

    typeForm = new FormGroup({
        type: new FormControl(undefined, [Validators.required])
    });

    constructor(public dialogRef: MatDialogRef<SelectNewObjectTypeComponent, DialogResult<string>>,
                @Inject(MAT_DIALOG_DATA) data: any) {
    }

    ngOnInit() {
    }

    onCancelClick() {
        this.dialogRef.close(DialogResult.Cancel());
    }

    onOkClick() {
        if (this.typeForm.invalid)
            return;

        this.dialogRef.close(DialogResult.Ok(this.typeForm.value.type));
    }
}
